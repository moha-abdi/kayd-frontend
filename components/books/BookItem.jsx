import React from "react"
import { TouchableOpacity, View, Image, Text } from "react-native"
import { useRouter } from "expo-router"
import { AntDesign } from "@expo/vector-icons"

export default function BookItem({ _id, title, author, rating, details }) {
  const router = useRouter()
  console.log("BookItem", { _id, title, author, rating })

  return (
    <TouchableOpacity
      className="bg-white rounded-xl mx-2 my-2 shadow-md"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
      }}
      onPress={() => router.push(`/(tabs)/book-details?id=${_id}`)}
    >
      <View className="flex-row p-4">
        <Image source={{ uri: "https://via.placeholder.com/100" }} className="w-20 h-30 rounded-lg" />
        <View className="flex-1 ml-4 justify-between">
          <View>
            <Text className="text-lg font-bold text-gray-800 mb-1" numberOfLines={2}>
              {title}
            </Text>
            <Text className="text-sm text-gray-600 mb-2">{details?.publisher}</Text>
          </View>
          <View className="flex-row items-center">
            <AntDesign name="star" size={16} color="#FFD700" />
            <Text className="text-sm font-bold text-yellow-500 ml-1">{parseFloat(rating.average).toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

