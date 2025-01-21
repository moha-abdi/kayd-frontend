import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Text, Image } from "react-native";
import { Link, router } from "expo-router";
import { ChevronRight, BookOpen, Users } from "lucide-react-native";
import { useAuth } from "../../contexts/AuthContext";
import { fetchRecentBooks, fetchReadingProgress } from "../../services/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { user } = useAuth();
  const [recentBooks, setRecentBooks] = useState([]);
  const [readingProgress, setReadingProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [books, progress] = await Promise.all([
        fetchRecentBooks(),
      ]);

      if (!books) {
        setError("No books found.");
        return;
      }
      setRecentBooks(books.filter((book) => book && book.title)); // Filter out any null or undefined books
      setReadingProgress(progress && progress.book ? progress : null);
    } catch (error) {
      console.error("Error loading home data:", error);
      setError("Failed to load home data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-6">
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-3xl font-bold text-gray-800">
              Welcome back,
            </Text>
            <Text className="text-xl text-gray-600 mt-1">
              {user?.username || "Reader"}
            </Text>
          </View>
          <Image
            source={{ uri: user?.avatar || "https://via.placeholder.com/100" }}
            className="w-16 h-16 rounded-full"
          />
        </View>

        {readingProgress && readingProgress.book ? (
          <View className="bg-white p-6 rounded-2xl shadow-md mb-8">
            <Text className="text-xl font-semibold mb-3 text-gray-800">
              Currently Reading
            </Text>
            <Text className="text-gray-600 mb-3 text-lg">
              {readingProgress.book.title}
            </Text>
            <View className="bg-gray-200 h-2 rounded-full mb-3">
              <View
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${readingProgress.progress}%` }}
              />
            </View>
            <Text className="text-right text-sm text-gray-500">
              {readingProgress.currentPage} / {readingProgress.totalPages} pages
            </Text>
          </View>
        ) : null}

        <View className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-gray-800">
              Recent Books
            </Text>
            <Link href="/(tabs)/books" asChild>
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-blue-500 mr-1 text-base">See all</Text>
                <ChevronRight size={20} color="#3b82f6" />
              </TouchableOpacity>
            </Link>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentBooks.map(
              (book) =>
                book && (
                  <Link
                    key={book._id}
                    href={`/(tabs)/book-details?id=${book._id}`}
                    asChild
                  >
                    <TouchableOpacity className="mr-6">
                      <Image
                        source={{
                          uri:
                            book.coverImage ||
                            "https://via.placeholder.com/150",
                        }}
                        className="w-32 h-48 rounded-lg mb-2"
                      />
                      <Text
                        className="font-semibold text-gray-800 mt-2"
                        numberOfLines={1}
                      >
                        {book.title}
                      </Text>
                      <Text className="text-gray-500 text-sm" numberOfLines={1}>
                        {book.details && book.details.publisher
                          ? book.details.publisher
                          : "Unknown Publisher"}
                      </Text>
                    </TouchableOpacity>
                  </Link>
                ),
            )}
          </ScrollView>
        </View>

        <View className="bg-white p-6 rounded-2xl shadow-md">
          <Text className="text-xl font-semibold mb-4 text-gray-800">
            Quick Actions
          </Text>
          <View className="flex-row justify-between">
            <TouchableOpacity onPress={()=>{router.push('/(tabs)/books')}} className="bg-blue-500 p-4 rounded-xl flex-1 items-center mr-4">
              <BookOpen color="white" size={28} />
              <Text className="text-white mt-2 text-base">Start Reading</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {router.push('/(tabs)/authors')}} className="bg-green-500 p-4 rounded-xl flex-1 items-center">
              <Users color="white" size={28} />
              <Text className="text-white mt-2 text-base">Find Authors</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
