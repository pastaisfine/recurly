import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { formatCurrency } from "@/lib/utils";
import { styled } from "nativewind";
import React, { useMemo } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView)

const monthlyEquivalent = (sub: Subscription) =>
    sub.billing?.toLowerCase() === "yearly" ? sub.price / 12 : sub.price;

const Insights = () => {
    const stats = useMemo(() => {
        const monthlySpend = HOME_SUBSCRIPTIONS.reduce(
            (sum, sub) => sum + monthlyEquivalent(sub),
            0
        );
        const yearlySpend = HOME_SUBSCRIPTIONS.reduce((sum, sub) => {
            const isYearly = sub.billing?.toLowerCase() === "yearly";
            return sum + (isYearly ? sub.price : sub.price * 12);
        }, 0);

        const activeCount = HOME_SUBSCRIPTIONS.filter(
            (sub) => sub.status?.toLowerCase() === "active"
        ).length;

        const mostExpensive = HOME_SUBSCRIPTIONS.reduce((max, sub) =>
            monthlyEquivalent(sub) > monthlyEquivalent(max) ? sub : max
        );

        const categories = HOME_SUBSCRIPTIONS.reduce<
            Record<string, number>
        >((acc, sub) => {
            const key = sub.category?.trim() || "Other";
            acc[key] = (acc[key] ?? 0) + monthlyEquivalent(sub);
            return acc;
        }, {});

        const categoryBreakdown = Object.entries(categories)
            .map(([category, spend]) => ({
                category,
                spend,
                percentage: monthlySpend ? (spend / monthlySpend) * 100 : 0,
            }))
            .sort((a, b) => b.spend - a.spend);

        const billingSplit = {
            monthly: HOME_SUBSCRIPTIONS.filter(
                (sub) => sub.billing?.toLowerCase() !== "yearly"
            ).length,
            yearly: HOME_SUBSCRIPTIONS.filter(
                (sub) => sub.billing?.toLowerCase() === "yearly"
            ).length,
        };

        const spendBySubscription = [...HOME_SUBSCRIPTIONS].sort(
            (a, b) => monthlyEquivalent(b) - monthlyEquivalent(a)
        );

        const statusSummary = HOME_SUBSCRIPTIONS.reduce<Record<string, number>>(
            (acc, sub) => {
                const key = sub.status?.toLowerCase() || "unknown";
                acc[key] = (acc[key] ?? 0) + 1;
                return acc;
            },
            {}
        );

        return {
            monthlySpend,
            yearlySpend,
            activeCount,
            mostExpensive,
            categoryBreakdown,
            billingSplit,
            spendBySubscription,
            statusSummary,
        };
    }, []);

    const statusOrder = ["active", "paused", "cancelled"];

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-30"
            >
                <View className="insight-header">
                    <Text className="insight-title">Insights</Text>
                </View>

                <View className="insight-grid">
                    <View className="insight-card insight-card-accent">
                        <Text className="insight-label insight-label-light">
                            Monthly spend
                        </Text>
                        <Text className="insight-value insight-value-light">
                            {formatCurrency(stats.monthlySpend)}
                        </Text>
                        <Text className="insight-label insight-label-light">
                            Per month
                        </Text>
                    </View>

                    <View className="insight-card">
                        <Text className="insight-label">Yearly spend</Text>
                        <Text className="insight-value">
                            {formatCurrency(stats.yearlySpend)}
                        </Text>
                        <Text className="insight-sub">Estimated per year</Text>
                    </View>

                    <View className="insight-card">
                        <Text className="insight-label">Active</Text>
                        <Text className="insight-value">{stats.activeCount}</Text>
                        <Text className="insight-sub">
                            of {HOME_SUBSCRIPTIONS.length} subscriptions
                        </Text>
                    </View>

                    <View className="insight-card">
                        <Text className="insight-label">Most expensive</Text>
                        <Text
                            className="insight-value"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {formatCurrency(
                                monthlyEquivalent(stats.mostExpensive)
                            )}
                        </Text>
                        <Text className="insight-sub" numberOfLines={1}>
                            {stats.mostExpensive.name}
                        </Text>
                    </View>
                </View>

                <View className="insight-section">
                    <Text className="insight-section-title">
                        Spend by category
                    </Text>
                    {stats.categoryBreakdown.map(({ category, spend, percentage }) => (
                        <View key={category} className="insight-bar-row">
                            <Text className="insight-bar-label" numberOfLines={1}>
                                {category}
                            </Text>
                            <View className="insight-bar-track">
                                <View
                                    className="insight-bar-fill"
                                    style={{ width: `${percentage}%` }}
                                />
                            </View>
                            <Text className="insight-bar-value">
                                {formatCurrency(spend)}
                            </Text>
                        </View>
                    ))}
                </View>

                <View className="insight-section">
                    <Text className="insight-section-title">
                        Billing split
                    </Text>
                    {["monthly", "yearly"].map((billing) => {
                        const count = stats.billingSplit[billing as keyof typeof stats.billingSplit];
                        const total = stats.billingSplit.monthly + stats.billingSplit.yearly;
                        const percentage = total ? (count / total) * 100 : 0;
                        return (
                            <View key={billing} className="insight-bar-row">
                                <Text
                                    className="insight-bar-label"
                                    style={{ textTransform: "capitalize" }}
                                >
                                    {billing}
                                </Text>
                                <View className="insight-bar-track">
                                    <View
                                        className="insight-bar-fill"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </View>
                                <Text className="insight-bar-value">
                                    {count} · {Math.round(percentage)}%
                                </Text>
                            </View>
                        );
                    })}
                </View>

                <View className="insight-section">
                    <Text className="insight-section-title">
                        Spend by subscription
                    </Text>
                    <View className="gap-3">
                        {stats.spendBySubscription.map((sub) => (
                            <View key={sub.id} className="insight-row">
                                <Image source={sub.icon} className="insight-row-icon" />
                                <View className="insight-row-main">
                                    <Text className="insight-row-name" numberOfLines={1}>
                                        {sub.name}
                                    </Text>
                                    <Text className="insight-row-meta">
                                        {sub.billing}
                                    </Text>
                                </View>
                                <Text className="insight-row-price">
                                    {formatCurrency(monthlyEquivalent(sub))}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View className="insight-section">
                    <Text className="insight-section-title">Status</Text>
                    <View className="status-chip-row">
                        {statusOrder.map((status) => (
                            <View key={status} className="status-chip">
                                <Text className="status-chip-value">
                                    {stats.statusSummary[status] ?? 0}
                                </Text>
                                <Text
                                    className="status-chip-label"
                                    style={{ textTransform: "capitalize" }}
                                >
                                    {status}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Insights;
