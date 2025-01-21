import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { fetchAuthorDetails, fetchBookDetails } from "../../../services/api";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorMessage from "../../../components/common/ErrorMessage";

export default function AuthorDetails() {
  const { id } = useLocalSearchParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAuthorDetails();
  }, [id]);

  const loadAuthorDetails = async () => {
    try {
      setLoading(true);
      const fetchedAuthor = await fetchAuthorDetails(id);

      // Fetch details for each book asynchronously
      const booksWithDetails = await Promise.all(
        fetchedAuthor.books.map(async (bookId) => {
          try {
            return await fetchBookDetails(bookId);
          } catch (error) {
            console.error(`Failed to fetch book details for ${bookId}:`, error);
            return null; // Handle individual book fetch failure
          }
        })
      );

      // Filter out any null entries from failed fetches
      fetchedAuthor.books = booksWithDetails.filter((book) => book !== null);
      setAuthor(fetchedAuthor);
    } catch (error) {
      setError("Failed to load author details. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleSocialLink = async (url) => {
    if (url) {
      try {
        await Linking.openURL(url);
      } catch (error) {
        console.error('Error opening URL:', error);
      }
    }
  };

  const renderBookItem = (book) => (
    <Link
      key={book._id}
      href={`/(tabs)/book-details?id=${book._id}`}
      asChild
    >
      <TouchableOpacity className="mr-4">
        <Image
          source={{ uri: book.coverImage || "https://via.placeholder.com/150x225" }}
          className="w-32 h-48 rounded-xl mb-2"
        />
        <Text className="text-sm font-medium text-gray-900 w-32" numberOfLines={2}>
          {book.title}
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={14} color="#4F46E5" />
          <Text className="text-xs text-gray-500 ml-1">
            {book.rating?.average} ({book.rating?.count})
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!author) return <ErrorMessage message="Author not found" />;

  return (
    <ScrollView className="flex-1 bg-indigo-50">
      <View className="relative">
        <Image
          source={{ uri: author.avatar || "https://i.pravatar.cc/400" }}
          className="w-full h-96"
          style={styles.coverImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(165, 180, 252, 1)']}
          style={styles.gradient}
        />
        <BlurView intensity={80} tint="dark" style={styles.blurView}>
          <Text className="text-3xl font-bold text-white text-center" style={styles.nameText}>
            {author.name.penName}
          </Text>
          <Text className="text-xl text-indigo-200 text-center mt-2">
            {author.name.firstName} {author.name.lastName}
          </Text>
        </BlurView>
      </View>

      <View className="px-6 pt-6 pb-12">
        <View className="flex-row justify-center items-center space-x-3 mb-8 bg-white rounded-full py-3 px-6 shadow-md">
          <View className="flex-row items-center">
            <Ionicons name="book-outline" size={24} color="#4F46E5" />
            <Text className="text-lg text-indigo-600 ml-2">{author.books.length} Books</Text>
          </View>
          <View className="w-[1px] h-6 bg-indigo-200" />
        </View>

        <View className="bg-white rounded-3xl p-6 shadow-lg mb-8">
          <View className="mb-6">
            <Text className="text-xl font-semibold text-indigo-900 mb-3">Biography</Text>
            <Text className="text-indigo-700 leading-6">{author.biography}</Text>
          </View>

          {(author.socialLinks?.website || author.socialLinks?.twitter) && (
            <View>
              <Text className="text-xl font-semibold text-indigo-900 mb-3">Social Links</Text>
              {author.socialLinks.website && (
                <TouchableOpacity
                  className="flex-row items-center mb-2"
                  onPress={() => handleSocialLink(author.socialLinks.website)}
                >
                  <Ionicons name="globe-outline" size={20} color="#4F46E5" />
                  <Text className="text-indigo-600 ml-2 underline">Website</Text>
                </TouchableOpacity>
              )}
              {author.socialLinks.twitter && (
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => handleSocialLink(author.socialLinks.twitter)}
                >
                  <Ionicons name="logo-twitter" size={20} color="#4F46E5" />
                  <Text className="text-indigo-600 ml-2 underline">Twitter</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View>
          <Text className="text-xl font-semibold text-indigo-900 mb-4">
            Books by {author.name.penName}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          >
            {author.books.map(renderBookItem)}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  coverImage: {
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  blurView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  nameText: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  }
});

export const screenOptions = {
  tabBarStyle: { display: "none" }, // Hides the bottom tabs
};