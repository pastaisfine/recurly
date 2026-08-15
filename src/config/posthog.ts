import PostHog from 'posthog-react-native'
import Constants from 'expo-constants'

// Configuration loaded from app.config.js extras via expo-constants.
// Environment variables are read at build time in app.config.js.
const projectToken = Constants.expoConfig?.extra?.posthogProjectToken as string | undefined
const host = (Constants.expoConfig?.extra?.posthogHost as string | undefined) ?? 'https://us.i.posthog.com'
const isPostHogConfigured = Boolean(projectToken)

if (__DEV__ && !isPostHogConfigured) {
  console.warn(
    'POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, ' +
      'this causes events to be silently missed. ' +
      'This error stops appearing once POSTHOG_PROJECT_TOKEN is configured.'
  )
}

/**
 * PostHog client instance for Expo.
 *
 * Configuration loaded from app.config.js extras via expo-constants.
 * Required peer dependencies: expo-constants, react-native-svg
 *
 * @see https://posthog.com/docs/libraries/react-native
 */
export const posthog = new PostHog(projectToken ?? 'placeholder_key', {
  host,

  // Disable when no token is present to avoid silently missed events
  disabled: !isPostHogConfigured,

  // Capture app lifecycle events (Installed, Updated, Opened, Backgrounded)
  captureAppLifecycleEvents: true,

  // Verbose logging in development builds
  debug: __DEV__,

  // Batching to optimise battery/network usage
  flushAt: 20,
  flushInterval: 10000,
  maxBatchSize: 100,
  maxQueueSize: 1000,

  // Feature flags
  preloadFeatureFlags: true,
  sendFeatureFlagEvent: true,
  featureFlagsRequestTimeoutMs: 10000,

  // Network
  requestTimeout: 10000,
  fetchRetryCount: 3,
  fetchRetryDelay: 3000,
})

export const isPostHogEnabled = isPostHogConfigured
