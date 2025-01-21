import React from "react";
import { FlatList } from "react-native";
import BookItem from "./BookItem";

export default function BookList({ books }) {
  return (
    <FlatList
      data={books}
      renderItem={({ item }) => <BookItem {...item} />}
      keyExtractor={(item) => item._id}
      className="w-full"
    />
  );
}
