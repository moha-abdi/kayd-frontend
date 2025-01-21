import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { registerUser, error, clearError, loading } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      clearError();
      setError("Passwords don't match");
      return;
    }

    try {
      await registerUser({ username, phone: phoneNumber, password });
      console.info("User registered successfully");
      router.replace("/(tabs)");
    } catch (error) {
      // Error is handled in AuthContext
    }
  };

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center px-6 py-8">
          <View className="bg-white p-8 rounded-3xl w-full max-w-md shadow-lg">
            <View className="items-center mb-8">
              <Ionicons name="book" size={64} color="#3b5998" />
              <Text className="text-3xl font-bold text-gray-800 mt-4">
                Create Account
              </Text>
              <Text className="text-sm text-gray-600 mt-2">
                Sign up to start your reading journey with Kayd
              </Text>
            </View>

            <View className="space-y-4">
              <View className="border border-gray-300 rounded-full overflow-hidden mb-4">
                <View className="relative">
                  <TextInput
                    className="bg-gray-100 text-gray-800 px-10 py-3"
                    placeholder="Username"
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      clearError();
                    }}
                    autoCapitalize="none"
                  />
                  <Ionicons
                    name="person"
                    size={24}
                    color="#3b5998"
                    style={{ position: "absolute", left: 12, top: 12 }}
                  />
                </View>
              </View>

              <View className="border border-gray-300 rounded-full overflow-hidden mb-4">
                <View className="relative">
                  <TextInput
                    className="bg-gray-100 text-gray-800 px-10 py-3"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={(text) => {
                      setPhoneNumber(text);
                      clearError();
                    }}
                    keyboardType="phone-pad"
                  />
                  <Ionicons
                    name="call"
                    size={24}
                    color="#3b5998"
                    style={{ position: "absolute", left: 12, top: 12 }}
                  />
                </View>
              </View>

              <View className="border border-gray-300 rounded-full overflow-hidden mb-4">
                <View className="relative">
                  <TextInput
                    className="bg-gray-100 text-gray-800 px-10 py-3 pr-10"
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      clearError();
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <Ionicons
                    name="lock-closed"
                    size={24}
                    color="#3b5998"
                    style={{ position: "absolute", left: 12, top: 12 }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 12, top: 12 }}
                  >
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={24}
                      color="#3b5998"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="border border-gray-300 rounded-full overflow-hidden mb-4">
                <View className="relative">
                  <TextInput
                    className="bg-gray-100 text-gray-800 px-10 py-3 pr-10"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      clearError();
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <Ionicons
                    name="lock-closed"
                    size={24}
                    color="#3b5998"
                    style={{ position: "absolute", left: 12, top: 12 }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: "absolute", right: 12, top: 12 }}
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={24}
                      color="#3b5998"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {error && (
                <Text className="text-red-500 text-sm mt-2">{error}</Text>
              )}

              <TouchableOpacity
                onPress={handleRegister}
                disabled={loading}
                className={`bg-blue-600 rounded-full py-3 mt-6 ${
                  loading ? "opacity-70" : ""
                }`}
              >
                <Text className="text-white text-center font-bold">
                  {loading ? "Signing Up..." : "Sign Up"}
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-center items-center mt-4">
                <Text className="text-sm text-gray-600">
                  Already have an account?
                </Text>
                <Link href="/login" asChild>
                  <TouchableOpacity>
                    <Text className="text-sm text-blue-600 font-bold ml-1">
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
