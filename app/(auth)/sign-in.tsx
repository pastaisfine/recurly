import { useSignIn } from "@clerk/expo";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { usePostHog } from "posthog-react-native";

const SignIn = () => {
  const { signIn } = useSignIn();
  const posthog = usePostHog();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setPending(true);
    setError(null);

    try {
      const { error } = await signIn.password({ emailAddress, password });
      if (error) {
        setError(error.longMessage || error.message);
        posthog.capture('sign_in_failed', { method: 'password' })
        posthog.captureException(new Error(error.longMessage || error.message))
        return;
      }

      if (signIn.status === "complete") {
        const { error: finalizeError } = await signIn.finalize();
        if (finalizeError) {
          setError(finalizeError.longMessage || finalizeError.message);
          posthog.capture('sign_in_failed', { method: 'password' })
          posthog.captureException(new Error(finalizeError.longMessage || finalizeError.message))
        } else {
          posthog.capture('user_signed_in', { method: 'password' })
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      posthog.capture('sign_in_failed', { method: 'password' })
      posthog.captureException(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setPending(false);
    }
  };

  return (
    <View className="auth-container">
      <View className="auth-header">
        <Text className="auth-title">Welcome back</Text>
        <Text className="auth-subtitle">
          Sign in to continue to your subscriptions.
        </Text>
      </View>

      <View className="auth-fields">
        <TextInput
          className="auth-input"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={emailAddress}
          placeholder="Email"
          placeholderTextColor="#00000099"
          onChangeText={setEmailAddress}
        />
        <TextInput
          className="auth-input"
          value={password}
          placeholder="Password"
          placeholderTextColor="#00000099"
          secureTextEntry
          onChangeText={setPassword}
        />
      </View>

      {error && <Text className="auth-error">{error}</Text>}

      <Pressable
        onPress={handleSignIn}
        disabled={pending}
        className="auth-button"
      >
        <Text className="auth-button-text">
          {pending ? "Signing in…" : "Sign in"}
        </Text>
      </Pressable>

      <View className="auth-footer">
        <Text className="auth-footer-text">
          Don{"'"}t have an account?
        </Text>
        <Link href="/sign-up" className="auth-link">
          Sign up
        </Link>
      </View>
    </View>
  );
};

export default SignIn;