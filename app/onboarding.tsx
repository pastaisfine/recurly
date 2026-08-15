import { router } from 'expo-router'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

const onboarding = () => {
  return (
    <View className="onboarding-container">
      <Text className="screen-title">Get started</Text>
      <Pressable
        onPress={() => router.replace('/(tabs)')}
        className="onboarding-button"
      >
        <Text className="auth-button-text">Continue</Text>
      </Pressable>
    </View>
  )
}

export default onboarding