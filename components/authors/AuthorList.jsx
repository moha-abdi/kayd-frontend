import React from "react";
import { FlatList } from "react-native";
import AuthorItem from "./AuthorItem";

export default function AuthorList({ authors }) {
  return (
    <FlatList
      data={authors}
      renderItem={({ item }) => <AuthorItem {...item} />}
      keyExtractor={(item) => item._id}
      className="w-full"
    />
  );
}
