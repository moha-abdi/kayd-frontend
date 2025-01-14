import React from "react";
import { View, Text } from "react-native";

export default function ErrorMessage({ message }) {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-red-500 text-center text-lg">{message}</Text>
    </View>
  );
}
