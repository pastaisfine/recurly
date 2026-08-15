import { useSignIn } from "@clerk/expo";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const SignIn = () => {
  const { signIn } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setPending(true);
    setError(null);

    const { error } = await signIn.password({ emailAddress, password });
    if (error) {
      setError(error.longMessage || error.message);
      setPending(false);
      return;
    }

    if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) {
        setError(finalizeError.longMessage || finalizeError.message);
      }
    }

    setPending(false);
  };

  return (
    <View className="flex-1 justify-center gap-6 bg-background p-6">
      <View className="gap-2">
        <Text className="text-3xl font-sans-bold text-primary">Welcome back</Text>
        <Text className="text-base font-sans-medium text-muted-foreground">
          Sign in to continue to your subscriptions.
        </Text>
      </View>

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

      {error && <Text className="text-sm font-sans-semibold text-destructive">{error}</Text>}

      <Pressable
        onPress={handleSignIn}
        disabled={pending}
        className="items-center rounded-full bg-primary py-4"
      >
        <Text className="font-sans-bold text-background">
          {pending ? "Signing in…" : "Sign in"}
        </Text>
      </Pressable>

      <View className="flex-row justify-center gap-1">
        <Text className="text-sm font-sans-medium text-muted-foreground">
          Don{"'"}t have an account?
        </Text>
        <Link href="/sign-up" className="text-sm font-sans-semibold text-accent">
          Sign up
        </Link>
      </View>
    </View>
  );
};

export default SignIn;