import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchBookDetails, addToReadingList, updateReadingProgress } from "../../../services/api";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorMessage from "../../../components/common/ErrorMessage";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { AntDesign, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function BookDetails() {
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBookDetails();
  }, [id]);

  const loadBookDetails = async () => {
    try {
      setLoading(true);
      console.log("fetching with id:", id);
      const fetchedBook = await fetchBookDetails(id);
      setBook(fetchedBook);
    } catch (error) {
      console.error(error);
      setError("Failed to load book details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToReadingList = async () => {
    try {
      await addToReadingList(id);
      alert("Book added to reading list!");
    } catch (error) {
      setError("Failed to add book to reading list. Please try again.");
    }
  };

  const handleUpdateProgress = async () => {
    try {
      await updateReadingProgress(id, {
        currentPage: 50,
        totalPages: book.details.pageCount,
      });
      alert("Reading progress updated!");
    } catch (error) {
      setError("Failed to update reading progress. Please try again.");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!book) return <ErrorMessage message="Book not found" />;

  return (
    <ScrollView className="flex-1 bg-indigo-50">
      <View className="relative">
        <Image
          source={{ uri: book.coverImage || "https://via.placeholder.com/400x600" }}
          className="w-full h-96"
          style={styles.coverImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(165, 180, 252, 1)']}
          style={styles.gradient}
        />
        <BlurView intensity={80} tint="dark" style={styles.blurView}>
          <Text className="text-3xl font-bold text-white text-center" style={styles.titleText}>{book.title}</Text>
          <Text className="text-xl text-indigo-200 text-center mt-2">
            {book.details.publisher}
          </Text>
        </BlurView>
      </View>

      <View className="px-6 pt-6 pb-12">
        <View className="flex-row justify-center items-center space-x-3 mb-8 bg-white rounded-full py-3 px-6 shadow-md">
          <AntDesign name="star" size={28} color="#FFA500" />
          <Text className="text-2xl font-semibold text-indigo-800">
            {parseFloat(book.rating.average).toFixed(1)}
          </Text>
          <Text className="text-indigo-600">({book.rating.count} reviews)</Text>
        </View>

        <View className="bg-white rounded-3xl p-6 shadow-lg mb-8">
          <InfoSection icon="book-open" title="ISBN" content={book.ISBN} />
          <InfoSection icon="tag" title="Categories" content={book.category.join(", ")} />
          <InfoSection icon="info" title="Description" content={book.details.description} />
          <InfoSection icon="briefcase" title="Publisher" content={book.details.publisher} />
          <InfoSection icon="calendar" title="Published Year" content={book.details.publishedYear.toString()} />
          <InfoSection icon="file-text" title="Page Count" content={book.details.pageCount.toString()} />
          <InfoSection icon="globe" title="Language" content={book.details.language} />
        </View>

        <View className="space-y-4">
          <TouchableOpacity
            onPress={handleAddToReadingList}
            style={[styles.button, styles.addButton]}
            className="rounded-full py-4 mb-4"
          >
            <Text className="text-white font-bold text-center text-lg">Add to Reading List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleUpdateProgress}
            style={[styles.button, styles.updateButton]}
            className="rounded-full py-4"
          >
            <Text className="text-white font-bold text-center text-lg">Update Progress</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function InfoSection({ icon, title, content }) {
  return (
    <View className="mb-4 flex-row items-start">
      <View className="bg-indigo-100 rounded-full p-2 mr-4">
        <Feather name={icon} size={20} color="#4F46E5" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-semibold text-indigo-800 mb-1">{title}</Text>
        <Text className="text-indigo-600">{content}</Text>
      </View>
    </View>
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
  titleText: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  button: {
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButton: {
    backgroundColor: '#4F46E5',
  },
  updateButton: {
    backgroundColor: '#10B981',
  },
});
