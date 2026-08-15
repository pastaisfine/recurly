import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import React, { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import SubscriptionCard from "../component/SubscriptionCard";
const SafeAreaView = styled(RNSafeAreaView)

const Subscription = () => {
  const posthog = usePostHog();
  const [search, setSearch] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

  const filteredSubscriptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return HOME_SUBSCRIPTIONS;

    return HOME_SUBSCRIPTIONS.filter((item) =>
      [item.name, item.plan, item.category, item.paymentMethod, item.status]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query))
    );
  }, [search]);

  const handleSubscriptionPress = (item: Subscription) => {
    const isExpanding = expandedSubscriptionId !== item.id
    if (isExpanding) {
      posthog.capture('subscription_expanded', {
        subscription_name: item.name,
        subscription_billing: item.billing,
        subscription_category: item.category ?? null,
      })
    }
    setExpandedSubscriptionId(isExpanding ? item.id : null)
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <View className="mb-5">
            <Text className="mb-2.5 text-2xl font-sans-bold text-primary">
              Subscriptions
            </Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search subscriptions..."
              placeholderTextColor="rgba(0, 0, 0, 0.6)"
              autoCorrect={false}
              autoCapitalize="none"
              className="rounded-2xl border border-border bg-card p-4 text-base font-sans-medium text-primary"
            />
          </View>
        )}
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => handleSubscriptionPress(item)}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">
            No subscriptions match "{search.trim()}"
          </Text>
        }
        contentContainerClassName="pb-30"
      />
    </SafeAreaView>
  )
}

export default Subscription
