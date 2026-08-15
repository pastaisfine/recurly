import { router } from 'expo-router'
import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { usePostHog } from 'posthog-react-native'

const Onboarding = () => {
  const posthog = usePostHog()

  const handleContinue = () => {
    posthog.capture('onboarding_completed')
    router.replace('/(tabs)')
  }

  return (
    <View className="onboarding-container">
      <Text className="screen-title">Get started</Text>
      <Pressable
        onPress={handleContinue}
        className="onboarding-button"
      >
        <Text className="auth-button-text">Continue</Text>
      </Pressable>
    </View>
  )
}

export default Onboarding