import { useSignUp } from "@clerk/expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const SignUp = () => {
  const { signUp } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setPending(true);
    setError(null);

    const { error } = await signUp.password({ emailAddress, password });
    if (error) {
      setError(error.longMessage || error.message);
      setPending(false);
      return;
    }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setError(sendError.longMessage || sendError.message);
      setPending(false);
      return;
    }

    setPending(false);
    setIsVerifying(true);
  };

  const handleVerify = async () => {
    setPending(true);
    setError(null);

    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      setError(error.longMessage || error.message);
      setPending(false);
      return;
    }

    const { error: finalizeError } = await signUp.finalize();
    if (finalizeError) {
      setError(finalizeError.longMessage || finalizeError.message);
      setPending(false);
      return;
    }

    setPending(false);
    router.replace("/onboarding");
  };

  return (
    <View className="flex-1 justify-center gap-6 bg-background p-6">
      <View className="gap-2">
        <Text className="text-3xl font-sans-bold text-primary">Create account</Text>
        <Text className="text-base font-sans-medium text-muted-foreground">
          We{"'"}ll email you a verification code.
        </Text>
      </View>

      {isVerifying ? (
        <View className="gap-3">
          <TextInput
            className="rounded-2xl border border-border bg-card p-4 text-base font-sans-medium text-primary"
            value={code}
            placeholder="Verification code"
            placeholderTextColor="#00000099"
            keyboardType="number-pad"
            onChangeText={setCode}
          />
        </View>
      ) : (
        <View className="gap-3">
          <TextInput
            className="rounded-2xl border border-border bg-card p-4 text-base font-sans-medium text-primary"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            value={emailAddress}
            placeholder="Email"
            placeholderTextColor="#00000099"
            onChangeText={setEmailAddress}
          />
          <TextInput
            className="rounded-2xl border border-border bg-card p-4 text-base font-sans-medium text-primary"
            value={password}
            placeholder="Password"
            placeholderTextColor="#00000099"
            secureTextEntry
            onChangeText={setPassword}
          />
        </View>
      )}

      {error && <Text className="text-sm font-sans-semibold text-destructive">{error}</Text>}

      <Pressable
        onPress={isVerifying ? handleVerify : handleSignUp}
        disabled={pending}
        className="items-center rounded-full bg-primary py-4"
      >
        <Text className="font-sans-bold text-background">
          {pending ? "Please wait…" : isVerifying ? "Verify" : "Sign up"}
        </Text>
      </Pressable>

      <View className="flex-row justify-center gap-1">
        <Text className="text-sm font-sans-medium text-muted-foreground">
          Already have an account?
        </Text>
        <Link href="/sign-in" className="text-sm font-sans-semibold text-accent">
          Sign in
        </Link>
      </View>

      {/* Required for sign-up flows on Expo web. Clerk skips the browser CAPTCHA on iOS and Android */}
      <View nativeID="clerk-captcha" />
    </View>
  );
};

export default SignUp;