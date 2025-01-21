import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import Onboarding1SVG from "@/components/icons/OnboardingIcon1";
import Onboarding2SVG from "@/components/icons/OnboardingIcon2";
import Onboarding3SVG from "@/components/icons/OnboardingIcon3";

const { width, height } = Dimensions.get("window");

const onboardingSteps = [
  {
    title: "Welcome to Kayd",
    description: "Your personal reading companion",
    SvgComponent: Onboarding1SVG,
  },
  {
    title: "Track Your Books",
    description: "Keep a record of your reading journey",
    SvgComponent: Onboarding2SVG,
  },
  {
    title: "Discover New Worlds",
    description: "Explore new books and genres",
    SvgComponent: Onboarding3SVG,
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace("/login");
    }
  };

  const handleSkip = () => {
    router.replace("/login");
  };

  const CurrentSvgComponent = onboardingSteps[currentStep].SvgComponent;

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={{ flex: 1 }}
    >
      <View className="flex-1 justify-between py-10 px-5">
        {/* Icon Section */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(1000)}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          className="flex-1 items-center justify-center"
        >
          {CurrentSvgComponent && (
            <CurrentSvgComponent width={width * 0.7} height={height * 0.35} />
          )}
        </Animated.View>

        {/* Text Section */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(1000)}
          className="items-center"
        >
          <Text className="text-2xl font-bold text-white text-center mb-3">
            {onboardingSteps[currentStep].title}
          </Text>
          <Text className="text-base text-white text-center opacity-80 mb-6">
            {onboardingSteps[currentStep].description}
          </Text>

          {/* Pagination Dots */}
          <View className="flex-row justify-center mb-8">
            {onboardingSteps.map((_, index) => (
              <View
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index === currentStep
                    ? "bg-white"
                    : "bg-white/50"
                }`}
              />
            ))}
          </View>

          {/* Next Button */}
          <TouchableOpacity
            className="bg-white py-4 px-8 rounded-full w-4/5 items-center mb-5"
            onPress={handleNext}
            style={{ alignSelf: "center" }}
          >
            <Text className="text-blue-700 text-lg font-bold">
              {currentStep === onboardingSteps.length - 1
                ? "Get Started"
                : "Next"}
            </Text>
          </TouchableOpacity>

          {/* Skip Button */}
          {currentStep < onboardingSteps.length - 1 && (
            <TouchableOpacity
              onPress={handleSkip}
              className="p-2"
              style={{ alignSelf: "center" }}
            >
              <Text className="text-white text-base opacity-80">Skip</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </LinearGradient>
  );
}
