import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Platform,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  RefreshControl,
  StyleSheet
} from "react-native";
import { fetchAuthors } from "../../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      const fetchedAuthors = await fetchAuthors();
      setAuthors(fetchedAuthors);
    } catch (error) {
      setError("Failed to load authors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAuthors();
    setRefreshing(false);
  };

  const filteredAuthors = authors.filter(author =>
    author?.name?.penName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author?.biography?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAuthorItem = ({ item: author }) => (
    <Link href={`/(tabs)/author-details?id=${author._id}`} asChild>
      <TouchableOpacity
        className="flex-row py-3 bg-white"
        activeOpacity={Platform.OS === 'ios' ? 0.6 : 0.8}
      >
        <Image
          source={{ uri: author.avatar || "https://i.pravatar.cc/120" }}
          className="ml-2 w-16 h-16 rounded-full"
        />
        <View className="flex-1 ml-3 justify-center">
          <Text className="text-[17px] font-medium text-gray-900 mb-1" numberOfLines={1}>
            {author?.name?.penName}
          </Text>
          <Text className="text-[15px] text-gray-500 mb-1" numberOfLines={2}>
            {author.biography}
          </Text>
          <View className="flex-row items-center">
            <View className="flex-row items-center">
              <Ionicons
                name="book-outline"
                size={16}
                color="#4F46E5"
              />
              <Text className="ml-1 text-sm text-gray-500">
                {author.bookCount} books
              </Text>
            </View>

          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#C7C7CC"
          style={styles.chevron}
        />
      </TouchableOpacity>
    </Link>
  );

  if (loading && !refreshing) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4 bg-gray-50">
        <Text className="text-[34px] font-bold text-gray-900">
          Authors
        </Text>
      </View>

      <View className="flex-row items-center mx-4 my-2 px-3 h-9 bg-gray-200 rounded-lg">
        <Ionicons
          name="search"
          size={20}
          color="#6B7280"
          className="mr-2"
        />
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholder="Search authors"
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filteredAuthors}
        renderItem={renderAuthorItem}
        keyExtractor={(item) => item._id}
        className="px-4"
        ItemSeparatorComponent={() => (
          <View className="h-[0.5px] bg-gray-200" />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4F46E5"
          />
        }
      />
    </SafeAreaView>
  );
}

// Minimal StyleSheet for items that can't be handled by NativeWind
const styles = StyleSheet.create({
  chevron: {
    alignSelf: 'center',
    marginLeft: 8,
  }
});