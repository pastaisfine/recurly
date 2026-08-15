import { useUser } from "@clerk/expo";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { formatCurrency } from "@/lib/utils";
import dayjs from 'dayjs';
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";
import CreateSubscriptionModal from "../component/CreateSubscriptionModal";
import ListHeading from "../component/ListHeading";
import SubscriptionCard from "../component/SubscriptionCard";
import UpcomingSubscriptionCard from "../component/UpcomingSubscriptionCard";
const SafeAreaView = styled(RNSafeAreaView)


export default function App() {
  const posthog = usePostHog();
  const { user } = useUser();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

  const handleCreateSubscription = (subscription: Subscription) => {
    posthog.capture('subscription_created', {
      subscription_name: subscription.name,
      subscription_price: subscription.price,
      subscription_frequency: subscription.frequency ?? null,
      subscription_billing: subscription.billing,
      subscription_category: subscription.category ?? null,
    })
    setSubscriptions((prev) => [subscription, ...prev]);
    setIsModalOpen(false);
  };

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
          <>
            <View className="home-header">
              <View className="home-user">
                <Image source={user?.hasImage ? { uri: user.imageUrl } : images.avatar} className="home-avatar" />
                <Text className="home-user-name">{user?.fullName ?? HOME_USER.name}</Text>
              </View>
              <Pressable onPress={() => setIsModalOpen(true)}>
                <Image source={icons.add} className="home-add-icon" />
              </Pressable>
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-data">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" />
              
              <FlatList 
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item}/>
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={<Text className="home-empty-state">No upcoming renewals yet</Text>}
              />
            </View>
            <ListHeading title="All Subscriptions " />
          </>
        )}
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => handleSubscriptionPress(item)}
            />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4"/>}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text className="home-empty-state">No subscription yet</Text>}
        contentContainerClassName="pb-30"
      />
      <CreateSubscriptionModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateSubscription}
      />
    </SafeAreaView>
  );

}