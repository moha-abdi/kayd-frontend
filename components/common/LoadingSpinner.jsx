import React from "react";
import { View } from "react-native";
import { Spinner } from "./Spinner";


export default function LoadingSpinner() {
  return (
    <View className="flex-1 justify-center items-center">
      <Spinner size="large" color="blue" />
    </View>
  );
}
