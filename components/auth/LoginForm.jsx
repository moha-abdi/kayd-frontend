import React, { useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { VStack, Input, Button } from "@gluestack-ui/themed";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      router.replace("/(main)");
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <VStack space={4} className="w-full max-w-sm">
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="bg-white rounded-md p-2"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="bg-white rounded-md p-2"
      />
      <Button onPress={handleLogin} className="bg-blue-500 rounded-md p-2">
        <Button.Text className="text-white font-bold">Login</Button.Text>
      </Button>
      {error ? <Text className="text-red-500 text-center">{error}</Text> : null}
    </VStack>
  );
}
