import { useAuth, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import React, { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";
const SafeAreaView = styled(RNSafeAreaView)


const Settings = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const posthog = usePostHog();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(null);
    try {
      posthog.capture('user_signed_out')
      await signOut();
    } catch (err) {
      setSignOutError(err instanceof Error ? err.message : "Something went wrong");
      posthog.captureException(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 gap-6 bg-background p-5">
      <Text className="text-2xl font-sans-bold text-primary">Settings</Text>
      <Text className="text-base font-sans-medium text-muted-foreground">
        {user?.primaryEmailAddress?.emailAddress}
      </Text>
      {signOutError && <Text className="text-sm font-sans-semibold text-destructive">{signOutError}</Text>}
      <Pressable
        onPress={handleSignOut}
        disabled={signingOut}
        className="items-center rounded-full bg-primary py-4"
      >
        <Text className="font-sans-bold text-background">
          {signingOut ? "Signing out…" : "Sign out"}
        </Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Settings