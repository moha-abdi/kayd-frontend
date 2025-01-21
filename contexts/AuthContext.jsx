import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login, register, logout, fetchUserData } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const userData = await fetchUserData(token);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setError("Failed to load user data. Please log in again.");
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (phone, password) => {
    try {
      setLoading(true);
      setError(null);
      const { token, user } = await login(phone, password);
      await AsyncStorage.setItem("userToken", token);
      console.info("Logged in user:", user);
      setUser(user);
      return user;
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const { token, user } = await register(userData);
      await AsyncStorage.setItem("userToken", token);
      setUser(user);
      return user;
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      setLoading(true);
      setError(null);
      await logout();
      await AsyncStorage.removeItem("userToken");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      setError("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginUser,
        registerUser,
        logoutUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
