import React, { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "@/global.css";
import { StatusBar } from "expo-status-bar";

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const checkFirstLaunch = async () => {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (!hasLaunched) {
          await AsyncStorage.setItem("hasLaunched", "true");
          router.replace("/onboarding");
        } else {
          const inAuthGroup = segments[0] === "(auth)";
          if (!user && !inAuthGroup) {
            router.replace("/onboarding");
          } else if (user && inAuthGroup) {
            router.replace("/");
          }
        }
      };

      checkFirstLaunch();
    }
  }, [user, loading]);

  if (loading) {
    return <Slot />;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <>
    <StatusBar style="auto" />
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
    </>
  );
}
