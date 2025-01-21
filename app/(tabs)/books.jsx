import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Platform,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl
} from "react-native";
import { fetchBooks, fetchCategories } from "../../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [fetchedBooks, fetchedCategories] = await Promise.all([
        fetchBooks(),
        fetchCategories()
      ]);

      // Convert categories array to lookup object
      const categoriesLookup = fetchedCategories.reduce((acc, cat) => {
        acc[cat._id] = cat.name;
        return acc;
      }, {});

      setBooks(fetchedBooks);
      setCategories(categoriesLookup);
    } catch (error) {
      setError("Failed to load books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.details.publisher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryName = (categoryId) => {
    return categories[categoryId] || categoryId;
  };

  const renderBookItem = ({ item: book }) => (
    <Link href={`/(tabs)/book-details?id=${book._id}`} asChild>
      <TouchableOpacity
        className="flex-row py-3 bg-white"
        activeOpacity={Platform.OS === 'ios' ? 0.6 : 0.8}
      >
        <Image
          source={{ uri: book.coverImage || "https://via.placeholder.com/120x180" }}
          className="w-[60px] h-[90px] rounded-md"
        />
        <View className="flex-1 ml-3 justify-between">
          <Text className="text-[17px] font-medium text-gray-900 mb-1" numberOfLines={2}>
            {book.title}
          </Text>
          <Text className="text-[15px] text-gray-500 mb-1" numberOfLines={1}>
            {book.details.publisher}
          </Text>
          <View className="flex-row items-center mb-1">
            <Ionicons
              name="star"
              size={16}
              color="#FFD700"
            />
            <Text className="ml-1 text-sm text-gray-500">
              {book.rating.average} ({book.rating.count})
            </Text>
          </View>
          <View className="flex-row flex-wrap">
            {book.category.slice(0, 2).map((catId, index) => (
              <View
                key={index}
                className="bg-indigo-100 rounded-full px-2 py-1 mr-2 mb-1"
              >
                <Text className="text-xs text-indigo-600">
                  {getCategoryName(catId)}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#4F46E5"
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
          Books
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
          placeholder="Search books"
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={filteredBooks}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        className="px-4"
        ItemSeparatorComponent={() => (
          <View className="h-[0.5px] bg-indigo-600" />
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
    marginLeft: 20,
    marginRight: 10
  }
});