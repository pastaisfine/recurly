import { useAuth, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import React, { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView)


const Settings = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(null);
    try {
      await signOut();
    } catch (err) {
      setSignOutError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 gap-6 bg-background p-5">
      <Text className="screen-title">Settings</Text>
      <Text className="auth-subtitle">
        {user?.primaryEmailAddress?.emailAddress}
      </Text>
      {signOutError && <Text className="auth-error">{signOutError}</Text>}
      <Pressable
        onPress={handleSignOut}
        disabled={signingOut}
        className="auth-button"
      >
        <Text className="auth-button-text">
          {signingOut ? "Signing out…" : "Sign out"}
        </Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Settings