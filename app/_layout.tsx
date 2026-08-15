import "@/global.css";
import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useNavigationState } from "@react-navigation/native";
import type { NavigationState } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import { PostHogProvider } from "posthog-react-native";
import { posthog } from "../src/config/posthog";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function getRouteName(state: NavigationState): string {
  let route = state.routes[state.index];
  while (route.state) {
    const nested = route.state;
    const index = nested.index ?? nested.routes.length - 1;
    route = nested.routes[index];
  }
  return route.name;
}

function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const routeName = useNavigationState(getRouteName);
  const previousRouteName = useRef<string | undefined>(undefined);

  // Screen tracking for Expo Router
  // @see https://posthog.com/docs/libraries/react-native
  // Track only a fixed, non-sensitive route pattern (the route name). Never send
  // dynamic path or query values (e.g. subscription ids) as screen properties.
  useEffect(() => {
    if (previousRouteName.current !== routeName) {
      posthog.screen(routeName, {
        previous_screen: previousRouteName.current ?? null,
      });
      previousRouteName.current = routeName;
    }
  }, [routeName]);

  // Identify user when Clerk auth state changes
  useEffect(() => {
    if (isSignedIn && user?.id) {
      posthog.identify(user.id, {
        $set: { email: user.primaryEmailAddress?.emailAddress },
      })
    } else if (!isSignedIn) {
      posthog.reset()
    }
  }, [isSignedIn, user?.id, user?.primaryEmailAddress?.emailAddress])

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#ea7a53" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="subscriptions/[id]" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf')
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <PostHogProvider
        client={posthog}
        autocapture={{
          captureScreens: false,
          captureTouches: true,
          propsToCapture: ['testID'],
        }}
      >
        <RootNavigator />
      </PostHogProvider>
    </ClerkProvider>
  );
}