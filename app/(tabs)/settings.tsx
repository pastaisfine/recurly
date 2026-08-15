import { useAuth, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import React from 'react';
import { Pressable, Text } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView)


const Settings = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <SafeAreaView className="flex-1 gap-6 bg-background p-5">
      <Text className="text-2xl font-sans-bold text-primary">Settings</Text>
      <Text className="text-base font-sans-medium text-muted-foreground">
        {user?.primaryEmailAddress?.emailAddress}
      </Text>
      <Pressable onPress={() => signOut()} className="items-center rounded-full bg-primary py-4">
        <Text className="font-sans-bold text-background">Sign out</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Settings