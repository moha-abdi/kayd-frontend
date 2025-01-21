import React, { useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { VStack, Input, Button } from "@gluestack-ui/themed";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { registerUser } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await registerUser({ username, email, password });
      router.replace("/(main)");
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <VStack space={4} className="w-full max-w-sm">
      <Input
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        className="bg-white rounded-md p-2"
      />
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
      <Button onPress={handleRegister} className="bg-blue-500 rounded-md p-2">
        <Button.Text className="text-white font-bold">Register</Button.Text>
      </Button>
      {error ? <Text className="text-red-500 text-center">{error}</Text> : null}
    </VStack>
  );
}
