import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.103:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (phone, password) => {
  const response = await api.post("/auth/login", { phone, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const fetchBooks = async () => {
  const response = await api.get("/books");
  return response.data;
};

export const fetchCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const fetchAuthors = async () => {
  const response = await api.get("/authors");
  return response.data;
};

export const fetchBookDetails = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const fetchAuthorDetails = async (id) => {
  const response = await api.get(`/authors/${id}`);
  return response.data;
};

export const fetchUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData)
  return response.data
}

export const changePassword = async (userId, passwordData) => {
  const response = await api.put(`/users/${userId}/change-password`, passwordData)
  return response.data
}

export const deleteUserAccount = async (userId) => {
  const response = await api.delete(`/users/${userId}`)
  return response.data
}

export const fetchUserData = async (token) => {
  const response = await api.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchRecentBooks = async () => {
  const response = await api.get("/books/recent");
  return response.data;
};

export const fetchReadingProgress = async () => {
  const response = await api.get("/reading-progress/current");
  return response.data;
};
