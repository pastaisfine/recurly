import { useSignUp } from "@clerk/expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { usePostHog } from "posthog-react-native";

const SignUp = () => {
  const { signUp } = useSignUp();
  const posthog = usePostHog();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setPending(true);
    setError(null);

    try {
      const { error } = await signUp.password({ emailAddress, password });
      if (error) {
        setError(error.longMessage || error.message);
        posthog.capture('sign_up_failed', { method: 'password', stage: 'registration' })
        posthog.captureException(new Error(error.longMessage || error.message))
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        setError(sendError.longMessage || sendError.message);
        posthog.capture('sign_up_failed', { method: 'password', stage: 'email_verification_send' })
        posthog.captureException(new Error(sendError.longMessage || sendError.message))
        return;
      }

      posthog.capture('email_verification_sent', { method: 'password' })
      setIsVerifying(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      posthog.capture('sign_up_failed', { method: 'password', stage: 'registration' })
      posthog.captureException(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setPending(false);
    }
  };

  const handleVerify = async () => {
    setPending(true);
    setError(null);

    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) {
        setError(error.longMessage || error.message);
        posthog.capture('sign_up_failed', { method: 'password', stage: 'email_verification' })
        posthog.captureException(new Error(error.longMessage || error.message))
        return;
      }

      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setError(finalizeError.longMessage || finalizeError.message);
        posthog.capture('sign_up_failed', { method: 'password', stage: 'finalize' })
        posthog.captureException(new Error(finalizeError.longMessage || finalizeError.message))
        return;
      }

      posthog.capture('user_signed_up', { method: 'password' })
      router.replace("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      posthog.capture('sign_up_failed', { method: 'password', stage: 'verification' })
      posthog.captureException(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setPending(false);
    }
  };

  return (
    <View className="auth-container">
      <View className="auth-header">
        <Text className="auth-title">Create account</Text>
        <Text className="auth-subtitle">
          We{"'"}ll email you a verification code.
        </Text>
      </View>

      {isVerifying ? (
        <View className="auth-fields">
          <TextInput
            className="auth-input"
            value={code}
            placeholder="Verification code"
            placeholderTextColor="#00000099"
            keyboardType="number-pad"
            onChangeText={setCode}
          />
        </View>
      ) : (
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
      )}

      {error && <Text className="auth-error">{error}</Text>}

      <Pressable
        onPress={isVerifying ? handleVerify : handleSignUp}
        disabled={pending}
        className="auth-button"
      >
        <Text className="auth-button-text">
          {pending ? "Please wait…" : isVerifying ? "Verify" : "Sign up"}
        </Text>
      </Pressable>

      <View className="auth-footer">
        <Text className="auth-footer-text">
          Already have an account?
        </Text>
        <Link href="/sign-in" className="auth-link">
          Sign in
        </Link>
      </View>

      {/* Required for sign-up flows on Expo web. Clerk skips the browser CAPTCHA on iOS and Android */}
      <View nativeID="clerk-captcha" />
    </View>
  );
};

export default SignUp;