import React from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Box, HStack, VStack, Avatar, Text } from "@gluestack-ui/themed";

export default function AuthorItem({ _id, name, books }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(main)/author-details?id=${_id}`)}
    >
      <Box className="border-b border-gray-200 py-2">
        <HStack space="3" className="items-center">
          <Avatar size="md" />
          <VStack className="flex-1">
            <Text className="font-bold text-lg">{name.penName}</Text>
            <Text className="text-gray-600">
              {name.firstName} {name.lastName}
            </Text>
            <Text className="text-blue-500">Books: {books.length}</Text>
          </VStack>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
}
