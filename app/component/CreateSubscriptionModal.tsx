import { icons } from "@/constants/icons";
import clsx from "clsx";
import dayjs from "dayjs";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const FREQUENCIES = ["Monthly", "Yearly"] as const;

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#f5c542",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#ea7a53",
  Productivity: "#8fd1bd",
  Cloud: "#c9c9f5",
  Music: "#b8e8d0",
  Other: "#d9d9d9",
};

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
}

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<string>("Monthly");
  const [category, setCategory] = useState<string>("Entertainment");
  const [error, setError] = useState<string | null>(null);

  const numericPrice = Number(price);
  const canSubmit = name.trim().length > 0 && price.trim().length > 0 && numericPrice > 0;

  const handleSubmit = () => {
    if (!canSubmit) {
      setError("Please enter a name and a positive price.");
      return;
    }

    const subscription: Subscription = {
      id: Date.now().toString(),
      name: name.trim(),
      price: numericPrice,
      currency: "USD",
      billing: frequency,
      frequency,
      category,
      status: "active",
      icon: icons.wallet,
      startDate: dayjs().toISOString(),
      renewalDate: dayjs().add(1, frequency === "Yearly" ? "year" : "month").toISOString(),
      color: CATEGORY_COLORS[category],
    };

    onCreate(subscription);
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Entertainment");
    setError(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="modal-overlay">
          <View className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable onPress={onClose} className="modal-close">
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            <View className="modal-body">
              <TextInput
                className="auth-input"
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor="#00000099"
                autoCorrect={false}
              />
              <TextInput
                className="auth-input"
                value={price}
                onChangeText={setPrice}
                placeholder="Price"
                placeholderTextColor="#00000099"
                keyboardType="decimal-pad"
              />

              <View className="picker-row">
                {FREQUENCIES.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => setFrequency(option)}
                    className={clsx("picker-option", frequency === option && "picker-option-active")}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === option && "picker-option-text-active"
                      )}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View className="category-scroll">
                {CATEGORIES.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => setCategory(option)}
                    className={clsx("category-chip", category === option && "category-chip-active")}
                  >
                    <Text
                      className={clsx(
                        "category-chip-text",
                        category === option && "category-chip-text-active"
                      )}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {error && <Text className="auth-error">{error}</Text>}
            </View>

            <View className="p-5 pt-0">
              <Pressable
                onPress={handleSubmit}
                disabled={!canSubmit}
                className={clsx("auth-button", !canSubmit && "auth-button-disabled")}
              >
                <Text className="auth-button-text">Create Subscription</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateSubscriptionModal;
