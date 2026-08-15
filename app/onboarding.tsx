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
    <View className="flex-1 items-center justify-center gap-6 bg-background p-6">
      <Text className="text-2xl font-sans-bold text-primary">Get started</Text>
      <Pressable
        onPress={handleContinue}
        className="items-center rounded-full bg-primary px-10 py-4"
      >
        <Text className="font-sans-bold text-background">Continue</Text>
      </Pressable>
    </View>
  )
}

export default Onboarding