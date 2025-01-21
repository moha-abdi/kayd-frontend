import React, { useState, useEffect } from "react"
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { User, Mail, Phone, Book, BookOpen, Lock, AlertTriangle } from "lucide-react-native"
import { useAuth } from "../../contexts/AuthContext"
import { fetchUserProfile, updateUserProfile, deleteUserAccount, changePassword } from "../../services/api"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import ErrorMessage from "../../components/common/ErrorMessage"

export default function Profile() {
  const { user, logoutUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      const fetchedProfile = await fetchUserProfile(user._id)
      setProfile(fetchedProfile)
      setUsername(fetchedProfile.username)
      setPhone(fetchedProfile.phone || "")
    } catch (error) {
      Alert.alert("Error", "Failed to load user profile. Please try again.")
    } finally {
      setError(null)
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)
      await updateUserProfile(user._id, { username, phone })
      setIsEditing(false)
      loadUserProfile()
      Alert.alert("Success", "Profile updated successfully.")
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password do not match.")
      return
    }

    try {
      setIsChangingPassword(true)
      await changePassword(user._id, { currentPassword, newPassword })
      Alert.alert("Success", "Password changed successfully.")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setError(null)
    } catch (error) {
      Alert.alert("Error", "Failed to change password. Please try again.")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setIsDeletingAccount(true)
      await deleteUserAccount(user._id)
      Alert.alert("Success", "Account deleted successfully.")
      await logoutUser()
    } catch (error) {
      setError("Failed to delete account. Please try again.")
    } finally {
      setIsDeletingAccount(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.")
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!profile) return <ErrorMessage message="Profile not found" />

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-3xl font-bold text-gray-900 mb-6">{isEditing ? "Edit Profile" : "Profile"}</Text>

          <View className="bg-white rounded-lg p-6 shadow-md mb-6">
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <User size={20} color="#4F46E5" />
                <Text className="text-sm font-medium text-gray-700 ml-2">Username</Text>
              </View>
              {isEditing ? (
                <TextInput
                  className="border border-gray-300 rounded-md p-3 text-gray-900"
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter your username"
                />
              ) : (
                <Text className="text-lg text-gray-900">{profile.username}</Text>
              )}
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <Phone size={20} color="#4F46E5" />
                <Text className="text-sm font-medium text-gray-700 ml-2">Phone</Text>
              </View>
              {isEditing ? (
                <TextInput
                  className="border border-gray-300 rounded-md p-3 text-gray-900"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="Enter your phone number"
                />
              ) : (
                <Text className="text-lg text-gray-900">{profile.phone || "Not set"}</Text>
              )}
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <BookOpen size={20} color="#4F46E5" />
                <Text className="text-sm font-medium text-gray-700 ml-2">Reading Stats</Text>
              </View>
              <Text className="text-lg text-gray-900">
                {profile.booksRead || 0} Books Read • {profile.currentlyReading || 0} Currently Reading
              </Text>
            </View>

            {isEditing && (
              <TouchableOpacity
                onPress={handleSaveProfile}
                className="bg-indigo-600 rounded-md py-3 mt-4 flex-row justify-center items-center"
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white font-semibold text-center">Save Changes</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)} className="bg-indigo-600 rounded-md py-3 mb-6">
              <Text className="text-white font-semibold text-center">Edit Profile</Text>
            </TouchableOpacity>
          )}

          <View className="bg-white rounded-lg p-6 shadow-md mb-6">
            <Text className="text-xl font-semibold text-gray-900 mb-4">Change Password</Text>
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <Lock size={20} color="#4F46E5" />
                <Text className="text-sm font-medium text-gray-700 ml-2">Current Password</Text>
              </View>
              <TextInput
                className="border border-gray-300 rounded-md p-3 text-gray-900"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="Enter current password"
              />
            </View>
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <Lock size={20} color="#4F46E5" />
                <Text className="text-sm font-medium text-gray-700 ml-2">New Password</Text>
              </View>
              <TextInput
                className="border border-gray-300 rounded-md p-3 text-gray-900"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="Enter new password"
              />
            </View>
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <Lock size={20} color="#4F46E5" />
                <Text className="text-sm font-medium text-gray-700 ml-2">Confirm New Password</Text>
              </View>
              <TextInput
                className="border border-gray-300 rounded-md p-3 text-gray-900"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirm new password"
              />
            </View>
            <TouchableOpacity
              onPress={handleChangePassword}
              className="bg-indigo-600 rounded-md py-3 flex-row justify-center items-center"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-semibold text-center">Change Password</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-lg p-6 shadow-md mb-6">
            <Text className="text-xl font-semibold text-red-600 mb-4">Danger Zone</Text>
            <View className="flex-row items-center mb-4">
              <AlertTriangle size={20} color="#DC2626" />
              <Text className="text-sm text-red-600 ml-2">Deleting your account is permanent</Text>
            </View>
            <TouchableOpacity
              onPress={handleDeleteAccount}
              className="bg-red-600 rounded-md py-3 flex-row justify-center items-center"
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-semibold text-center">Delete Account</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleLogout} className="bg-gray-200 rounded-md py-3 mb-8">
            <Text className="text-gray-800 font-semibold text-center">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

