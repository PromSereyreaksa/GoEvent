"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  Menu,
  ArrowLeft,
  Bell,
  Shield,
  Palette,
  Save,
  User,
  Camera,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  AlertCircle,
} from "lucide-react"
import AppSidebar from "../components/homepage/AppSidebar"
import { SidebarProvider } from "../components/homepage/SidebarProvider"
import { authAPI } from "../utils/api"

export default function Settings() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [searchParams] = useSearchParams()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState("")

  // Profile form data
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    profile_picture: user?.profile_picture || "",
  })

  // Password form data
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(user?.profile_picture || "")

  // Other settings
  const [formData, setFormData] = useState({
    notifications: {
      email: true,
      push: true,
      marketing: false,
      events: true,
      guests: true,
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
    },
    preferences: {
      theme: "light",
      language: "en",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
    },
  })

  // Hide header when component mounts
  useEffect(() => {
    const header = document.querySelector("header")
    if (header) {
      header.style.display = "none"
    }

    return () => {
      if (header) {
        header.style.display = "block"
      }
    }
  }, [])

  // Update tab from URL params
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.includes(".")) {
      const [section, field] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === "checkbox" ? checked : value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }

      setImageFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)

      setError("")
    }
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      const formData = new FormData()

      Object.keys(profileData).forEach((key) => {
        if (profileData[key] !== null && profileData[key] !== undefined) {
          formData.append(key, profileData[key])
        }
      })

      if (imageFile) {
        formData.append("profile_picture", imageFile)
      }

      const updatedProfile = await authAPI.updateProfile(formData)
      setSuccessMessage("Profile updated successfully!")

      // Update local state
      setProfileData(updatedProfile)
      setImageFile(null)

      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (error) {
      console.error("Error updating profile:", error)
      setError(error.message || "Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError("New passwords do not match")
      return
    }

    if (passwordData.new_password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      await authAPI.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      })

      setSuccessMessage("Password changed successfully!")
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      })

      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (error) {
      console.error("Error changing password:", error)
      let errorMessage = "Failed to change password."
      if (error.message) {
        if (error.message.includes("401") || error.message.includes("incorrect")) {
          errorMessage = "Current password is incorrect."
        } else {
          errorMessage = error.message
        }
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (section) => {
    setLoading(true)
    try {
      console.log(`Saving ${section} settings:`, formData)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccessMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`)
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (error) {
      console.error("Error saving settings:", error)
      setError("Failed to save settings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: "profile", label: "Profile & Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Palette },
  ]

  const renderProfileSettings = () => (
    <div className="space-y-8">
      {/* Profile Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>

        {/* Profile Picture */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={imagePreview || profileData.profile_picture || "https://via.placeholder.com/150"}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">Choose a new profile picture. Max size: 5MB</p>
              <p className="text-xs text-gray-500">Recommended: Square image, at least 200x200 pixels</p>
            </div>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              name="first_name"
              value={profileData.first_name}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              name="last_name"
              value={profileData.last_name}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleProfileChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            value={profileData.phone_number}
            onChange={handleProfileChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Password Change */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>

        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password *</label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password *</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={
              loading || !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password
            }
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Changing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Change Password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600 mt-1">Receive notifications via email</p>
            </div>
            <input
              type="checkbox"
              name="notifications.email"
              checked={formData.notifications.email}
              onChange={handleInputChange}
              className="toggle"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-600 mt-1">Receive push notifications</p>
            </div>
            <input
              type="checkbox"
              name="notifications.push"
              checked={formData.notifications.push}
              onChange={handleInputChange}
              className="toggle"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">Event Updates</p>
              <p className="text-sm text-gray-600 mt-1">Notifications about your events</p>
            </div>
            <input
              type="checkbox"
              name="notifications.events"
              checked={formData.notifications.events}
              onChange={handleInputChange}
              className="toggle"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">Guest Activities</p>
              <p className="text-sm text-gray-600 mt-1">Notifications about guest responses</p>
            </div>
            <input
              type="checkbox"
              name="notifications.guests"
              checked={formData.notifications.guests}
              onChange={handleInputChange}
              className="toggle"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">Marketing</p>
              <p className="text-sm text-gray-600 mt-1">Promotional emails and updates</p>
            </div>
            <input
              type="checkbox"
              name="notifications.marketing"
              checked={formData.notifications.marketing}
              onChange={handleInputChange}
              className="toggle"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={() => handleSave("notifications")}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )

  const renderPrivacySettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Privacy Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">Profile Visibility</p>
              <p className="text-sm text-gray-600 mt-1">Make your profile visible to other users</p>
            </div>
            <input
              type="checkbox"
              name="privacy.profileVisible"
              checked={formData.privacy.profileVisible}
              onChange={handleInputChange}
              className="toggle"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">Show Email</p>
              <p className="text-sm text-gray-600 mt-1">Display email on your public profile</p>
            </div>
            <input
              type="checkbox"
              name="privacy.showEmail"
              checked={formData.privacy.showEmail}
              onChange={handleInputChange}
              className="toggle"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">Show Phone</p>
              <p className="text-sm text-gray-600 mt-1">Display phone number on your public profile</p>
            </div>
            <input
              type="checkbox"
              name="privacy.showPhone"
              checked={formData.privacy.showPhone}
              onChange={handleInputChange}
              className="toggle"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={() => handleSave("privacy")}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )

  const renderPreferences = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">App Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Theme</label>
            <select
              name="preferences.theme"
              value={formData.preferences.theme}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select
              name="preferences.language"
              value={formData.preferences.language}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Timezone</label>
            <select
              name="preferences.timezone"
              value={formData.preferences.timezone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Date Format</label>
            <select
              name="preferences.dateFormat"
              value={formData.preferences.dateFormat}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={() => handleSave("preferences")}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileSettings()
      case "notifications":
        return renderNotificationSettings()
      case "privacy":
        return renderPrivacySettings()
      case "preferences":
        return renderPreferences()
      default:
        return renderProfileSettings()
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] w-full">
        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />

        <div className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
          <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6">
            {/* Mobile Menu */}
            <div className="flex items-center gap-4 mb-6 lg:hidden">
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => {
                    if (window.history.length > 2) {
                      window.history.back()
                    } else {
                      navigate("/dashboard")
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">Settings</h1>
                  <p className="text-sm sm:text-base text-gray-600">Manage your account preferences and security</p>
                </div>
              </div>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-800 text-sm font-medium">{successMessage}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Page Content */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <nav className="flex space-x-8 px-6">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-all duration-200 flex items-center gap-2 ${
                            activeTab === tab.id
                              ? "border-blue-500 text-blue-600 bg-blue-50/50"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                      )
                    })}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6 bg-white">{renderTabContent()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .toggle {
          appearance: none;
          width: 44px;
          height: 24px;
          background: #e5e7eb;
          border-radius: 12px;
          position: relative;
          cursor: pointer;
          transition: background 0.2s;
        }

        .toggle:checked {
          background: #3b82f6;
        }

        .toggle::before {
          content: "";
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          top: 2px;
          left: 2px;
          transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .toggle:checked::before {
          transform: translateX(20px);
        }
      `}</style>
    </SidebarProvider>
  )
}
