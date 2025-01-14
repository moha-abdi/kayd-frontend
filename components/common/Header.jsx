import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function Header({ options }) {
  const router = useRouter();
  const { user, logoutUser } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  return (
    <View className="bg-blue-500 p-4 flex-row justify-between items-center">
      <Text className="text-white text-xl font-bold">{options.title}</Text>
      {user && (
        <TouchableOpacity onPress={handleLogout}>
          <Text className="text-white">Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
