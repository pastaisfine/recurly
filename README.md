# React Native Recurly

A subscription tracking & management mobile app built with **React Native + Expo** (SDK 54). It helps users track their recurring subscriptions, upcoming renewals, and monthly/yearly spending, with analytics and a polished NativeWind-styled UI.

## What this app does

- **Authentication** via [Clerk](https://clerk.com) — email + password sign up (with email verification) and sign in, gated behind protected routes.
- **Home dashboard** — shows the user's balance, a horizontal list of **upcoming renewals**, and an expandable list of **all subscriptions**. A modal lets you add a new subscription (name, price, monthly/yearly frequency, and category).
- **Subscriptions** — a searchable, filterable list of all subscriptions.
- **Insights** — computed analytics: monthly/yearly spend, active subscription count, most expensive subscription, spend by category, monthly/yearly billing split, spend by subscription, and a status breakdown (active / paused / cancelled).
- **Settings** — displays the signed-in account and provides sign out.
- **Product analytics** via [PostHog](https://posthog.com) — screen tracking and custom events for sign-in, sign-up, subscription creation, expansion, and onboarding, with automatic user identification tied to Clerk user IDs.

> Note: Subscription data is currently backed by **mock/hardcoded data** in `constants/data.ts` rather than a backend.

## Tech stack

- **Expo SDK 54** with [Expo Router](https://docs.expo.dev/router/introduction) (file-based routing) and typed routes
- **React Native 0.81** + React 19
- **NativeWind / Tailwind CSS** (v4) for styling
- **Clerk Expo** for authentication (`expo-secure-store` for token cache)
- **PostHog React Native** for analytics
- **dayjs** for date handling

## Project structure

```
app/
  _layout.tsx          Root layout (Clerk + PostHog providers, protected routes)
  (auth)/              Sign in / sign up screens
  (tabs)/              Bottom-tab navigator (Home, Subscriptions, Insights, Settings)
  onboarding.tsx       Post-signup onboarding
  component/           Reusable UI (SubscriptionCard, CreateSubscriptionModal, etc.)
  subscriptions/[id]   Subscription detail screen
constants/             Tabs, mock data, icons, images, theme
src/config/posthog.ts  PostHog client configuration
lib/utils.ts           Formatting helpers (currency, dates, status labels)
```

## Getting started

1. Install dependencies

   ```bash
   npm install
   ```

2. Create a `.env` file with your keys (see `.env.example`):

   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   POSTHOG_PROJECT_TOKEN=...
   POSTHOG_HOST=https://us.i.posthog.com
   ```

3. Start the app

   ```bash
   npx expo start
   ```

   Then press a key to open on a development build, Android/iOS emulator, or [Expo Go](https://expo.dev/go).

## Available scripts

- `npm start` — start the Expo dev server
- `npm run android` — start on Android
- `npm run ios` — start on iOS
- `npm run web` — start on web
- `npm run lint` — run ESLint
- `npm run reset-project` — reset to the blank starter template

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction)
- [Clerk for Expo](https://clerk.com/docs)
- [PostHog React Native](https://posthog.com/docs/libraries/react-native)
