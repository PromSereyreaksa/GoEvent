"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  ArrowLeft,
  User,
  Save,
  Eye,
  EyeOff,
  Camera,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Award,
  Edit3,
} from "lucide-react";
import AppSidebar from "../components/homepage/AppSidebar";
import { SidebarProvider } from "../components/homepage/SidebarProvider";
import NotificationsDropdown from "../components/homepage/NotificationsDropdown";
import UserProfileDropdown from "../components/homepage/UserProfileDropdown";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: user?.company || "",
    location: user?.location || "",
    bio: user?.bio || "",
    website: user?.website || "",
    jobTitle: user?.job_title || "",
    joinDate: user?.created_at || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    avatar: user?.avatar || null,
  });

  // Hide header when component mounts
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "none";
    }

    return () => {
      if (header) {
        header.style.display = "block";
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Here you would make API calls to save the profile
      console.log("Saving profile:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      company: user?.company || "",
      location: user?.location || "",
      bio: user?.bio || "",
      website: user?.website || "",
      jobTitle: user?.job_title || "",
      joinDate: user?.created_at || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      avatar: user?.avatar || null,
    });
    setEditMode(false);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle profile picture upload
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          avatar: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    const first =
      formData.firstName?.charAt(0) || user?.first_name?.charAt(0) || "";
    const last =
      formData.lastName?.charAt(0) || user?.last_name?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans']">
        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="lg:ml-64 transition-all duration-300">
          {/* Top Navigation Bar */}
          <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </button>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </button>

                <div>
                  <h1 className="text-xl font-bold text-gray-900">Profile</h1>
                  <p className="text-sm text-gray-600">
                    Manage your personal information
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <NotificationsDropdown />
                <UserProfileDropdown user={user} />
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Profile Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <div className="px-6 pb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
                    {/* Profile Picture */}
                    <div className="relative">
                      <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg">
                        {formData.avatar ? (
                          <img
                            src={formData.avatar}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                            {getInitials()}
                          </div>
                        )}
                      </div>
                      {editMode && (
                        <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50">
                          <Camera className="w-5 h-5 text-gray-600" />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                          />
                        </label>
                      )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {formData.firstName} {formData.lastName}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {formData.jobTitle || "Event Organizer"}
                      </p>
                      <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {formData.company || "Not specified"}
                      </p>
                      <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {formData.location || "Not specified"}
                      </p>
                    </div>

                    {/* Edit Button */}
                    <div className="flex gap-2">
                      {editMode ? (
                        <>
                          <button
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            {loading ? "Saving..." : "Save Changes"}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setEditMode(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Personal Information */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title
                        </label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    {/* Password Change Section */}
                    {editMode && (
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4">
                          Change Password
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type={showPassword ? "text" : "password"}
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type={showPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                  {/* Account Info */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Account Info
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Member Since
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(formData.joinDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Account Type
                          </p>
                          <p className="text-sm text-gray-500">
                            {user?.is_vendor ? "Vendor" : "Standard"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            User ID
                          </p>
                          <p className="text-sm text-gray-500">
                            #{user?.id || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate("/settings")}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Settings & Preferences
                      </button>
                      <button
                        onClick={() => navigate("/events")}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        My Events
                      </button>
                      <button
                        onClick={() => navigate("/guests")}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Guest Management
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
