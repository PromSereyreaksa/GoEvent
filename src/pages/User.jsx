"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Edit3,
  Settings,
  Star,
  Trophy,
  Users,
  CalendarHeart,
  ArrowLeft,
  Shield,
  Briefcase,
  UserCheck,
  Menu,
  X,
  Loader2,
  Camera,
  Eye,
  EyeOff,
  Save,
  Lock,
} from "lucide-react";
import { authAPI, eventAPI } from "../utils/api";
import { SidebarProvider } from "../components/homepage/SidebarProvider";
import AppSidebar from "../components/homepage/AppSidebar";
import { fetchEvents } from "../redux/slices/eventSlice";

// Edit Profile Modal Component
function EditProfileModal({ isOpen, onClose, userData, onSave, loading }) {
  const [formData, setFormData] = useState({
    first_name: userData?.first_name || "",
    last_name: userData?.last_name || "",
    email: userData?.email || "",
    phone_number: userData?.phone_number || "",
    profile_picture: userData?.profile_picture || "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  
  const [errors, setErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(userData?.profile_picture || "");
  const [passwordError, setPasswordError] = useState("");

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        profile_picture: userData.profile_picture || "",
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setImagePreview(userData.profile_picture || "");
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profile_picture: "Image size must be less than 5MB"
        }));
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          profile_picture: "Please select a valid image file"
        }));
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous errors
      setErrors(prev => ({
        ...prev,
        profile_picture: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (formData.phone_number && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Please enter a valid phone number";
    }
    
    if (changePassword) {
      if (!formData.current_password) {
        newErrors.current_password = "Current password is required";
      }
      
      if (!formData.new_password) {
        newErrors.new_password = "New password is required";
      } else if (formData.new_password.length < 8) {
        newErrors.new_password = "Password must be at least 8 characters";
      }
      
      if (formData.new_password !== formData.confirm_password) {
        newErrors.confirm_password = "Passwords do not match";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const updateData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone_number: formData.phone_number,
      // Preserve vendor status fields to prevent them from being changed
      is_vendor: userData?.is_vendor || false,
      is_partner: userData?.is_partner || false,
    };
    
    // Add password fields if changing password
    if (changePassword) {
      updateData.current_password = formData.current_password;
      updateData.new_password = formData.new_password;
    }
    
    // Add image file if selected
    if (imageFile) {
      updateData.profile_picture = imageFile;
    }
    
    await onSave(updateData, changePassword);
  };

  const handleClose = () => {
    setFormData({
      first_name: userData?.first_name || "",
      last_name: userData?.last_name || "",
      email: userData?.email || "",
      phone_number: userData?.phone_number || "",
      profile_picture: userData?.profile_picture || "",
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
    setErrors({});
    setChangePassword(false);
    setImageFile(null);
    setImagePreview(userData?.profile_picture || "");
    setPasswordError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Profile Picture */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={userData.profile_picture || "https://via.placeholder.com/150"}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Choose a new profile picture. Max size: 5MB
                </p>
                {errors.profile_picture && (
                  <p className="text-red-600 text-sm mt-1">{errors.profile_picture}</p>
                )}
              </div>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.first_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your first name"
              />
              {errors.first_name && (
                <p className="text-red-600 text-sm mt-1">{errors.first_name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.last_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your last name"
              />
              {errors.last_name && (
                <p className="text-red-600 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone_number ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your phone number"
            />
            {errors.phone_number && (
              <p className="text-red-600 text-sm mt-1">{errors.phone_number}</p>
            )}
          </div>

          {/* Password Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Change Password
              </label>
              <button
                type="button"
                onClick={() => setChangePassword(!changePassword)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  changePassword
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {changePassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {changePassword && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{passwordError}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="current_password"
                      value={formData.current_password}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
                        errors.current_password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.current_password && (
                    <p className="text-red-600 text-sm mt-1">{errors.current_password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
                        errors.new_password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.new_password && (
                    <p className="text-red-600 text-sm mt-1">{errors.new_password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${
                        errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-red-600 text-sm mt-1">{errors.confirm_password}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { events } = useSelector((state) => state.events);
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [userStats, setUserStats] = useState({
    eventsCreated: 0,
    teamEvents: 0,
    activeEvents: 0,
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch fresh profile data from API
        const response = await authAPI.getProfile();
        setProfileData(response);
        
        // Also fetch events to calculate stats
        dispatch(fetchEvents());
        
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
      setError("No user data available");
    }
  }, [user, dispatch]);

  // Calculate user stats when events are loaded
  useEffect(() => {
    if (events && user) {
      const userId = user.id;
      
      // Count events where user is the creator/admin
      const createdEvents = events.filter(event => 
        event.admin?.id === userId || 
        event.created_by === userId ||
        event.createdBy === userId
      );
      
      // Count events where user is a team member
      const teamEvents = events.filter(event => {
        const teamMembers = event.team_members || event.teamMembers || [];
        return teamMembers.some(member => 
          member.id === userId || 
          member.user_id === userId ||
          member.email === user.email
        );
      });
      
      // Count active events (published events)
      const activeEvents = events.filter(event => 
        event.is_published && (
          event.admin?.id === userId || 
          event.created_by === userId ||
          event.createdBy === userId ||
          (event.team_members || event.teamMembers || []).some(member => 
            member.id === userId || member.user_id === userId || member.email === user.email
          )
        )
      );

      setUserStats({
        eventsCreated: createdEvents.length,
        teamEvents: teamEvents.length,
        activeEvents: activeEvents.length,
      });
    }
  }, [events, user]);

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

  // Handle profile update
  const handleUpdateProfile = async (updates, hasPasswordChange = false) => {
    try {
      setUpdateLoading(true);
      setError(null);
      
      // Separate password fields from profile fields
      const { current_password, new_password, ...profileFields } = updates;
      
      // Handle password change if requested
      if (current_password && new_password) {
        try {
          await authAPI.changePassword({
            current_password: current_password,
            new_password: new_password
          });
          
          // Password changed successfully
          setSuccessMessage("Password changed successfully!");
        } catch (passwordError) {
          console.error("Error changing password:", passwordError);
          // Check for specific error messages
          let errorMessage = "Failed to change password.";
          if (passwordError.message) {
            if (passwordError.message.includes("401") || passwordError.message.includes("incorrect") || passwordError.message.includes("wrong")) {
              errorMessage = "Current password is incorrect. Please try again.";
            } else if (passwordError.message.includes("weak") || passwordError.message.includes("strong")) {
              errorMessage = "New password is too weak. Please use a stronger password.";
            } else {
              errorMessage = passwordError.message;
            }
          }
          setError(errorMessage);
          setUpdateLoading(false);
          return; // Stop here if password change fails
        }
      }
      
      // Handle profile update if there are profile fields to update
      if (Object.keys(profileFields).length > 0) {
        // Create FormData for file upload
        const formData = new FormData();
        
        // Add all profile fields to FormData
        Object.keys(profileFields).forEach(key => {
          if (profileFields[key] !== null && profileFields[key] !== undefined) {
            formData.append(key, profileFields[key]);
          }
        });
        
        const updatedProfile = await authAPI.updateProfile(formData);
        setProfileData(updatedProfile);
        
        // Show appropriate success message
        if (current_password && new_password) {
          setSuccessMessage("Profile and password updated successfully!");
        } else {
          setSuccessMessage("Profile updated successfully!");
        }
      }
      
      // If password was changed successfully, we need to clear the password fields
      // in the modal by resetting the form
      if (hasPasswordChange && current_password && new_password) {
        // Force a re-render of the modal with cleared password fields
        setEditModalOpen(false);
        // Small delay to ensure modal closes before clearing success message
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      } else {
        setEditModalOpen(false);
        setTimeout(() => setSuccessMessage(""), 5000); // Clear after 5 seconds
      }
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading && !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Use profileData if available, fallback to Redux user data
  const userData = profileData || user;

  const statsCards = [
    {
      icon: <CalendarHeart className="w-6 h-6" />,
      title: "Events Created",
      value: userStats.eventsCreated.toString(),
      description: "Total events organized",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Events",
      value: userStats.teamEvents.toString(),
      description: "Events as team member",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Account Type",
      value: userData?.is_vendor ? "Vendor" : "User",
      description: "Current account status",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Active Events",
      value: userStats.activeEvents.toString(),
      description: "Currently active events",
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
        
        <div
          className={`flex-1 transition-all duration-300 ease-in-out min-h-screen w-full ${
            sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          }`}
        >
          <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6">
            {/* Mobile Menu */}
            <div className="flex items-center gap-4 mb-6 lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  User Profile
                </h1>
                <p className="text-gray-600">Manage your account settings and information</p>
              </div>
            </div>

            {/* Profile Header Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg mb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Profile Image */}
                <div className="relative">
                  <img
                    src={userData.profile_picture || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-100"
                  />
                  <button 
                    onClick={() => setEditModalOpen(true)}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  
                  {/* Status Badges */}
                  <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                    {userData.is_vendor && (
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        Vendor
                      </div>
                    )}
                    {userData.is_partner && (
                      <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Partner
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {userData.first_name} {userData.last_name}
                  </h2>
                  <p className="text-gray-600 mb-4">{userData.email}</p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
                    {userData.phone_number && (
                      <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
                        <Phone className="w-4 h-4" />
                        {userData.phone_number}
                      </div>
                    )}
                    <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full text-sm text-blue-700">
                      <UserCheck className="w-4 h-4" />
                      {userData.is_vendor ? "Vendor Account" : "User Account"}
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => setEditModalOpen(true)}
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button 
                      onClick={() => navigate("/settings")}
                      className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{stat.description}</p>
                </div>
              ))}
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Full Name</p>
                    <p className="text-gray-900 font-semibold">
                      {userData.first_name} {userData.last_name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="text-gray-900 font-semibold">{userData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Phone</p>
                    <p className="text-gray-900 font-semibold">{userData.phone_number || "Not provided"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <UserCheck className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Account Status</p>
                    <div className="flex gap-2">
                      {userData.is_vendor && <span className="text-green-600 font-semibold text-sm">Vendor</span>}
                      {userData.is_partner && <span className="text-purple-600 font-semibold text-sm">Partner</span>}
                      {!userData.is_vendor && !userData.is_partner && (
                        <span className="text-blue-600 font-semibold text-sm">Regular User</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {userData.bio && (
                <div className="mt-6 p-4 rounded-xl bg-gray-50">
                  <p className="text-sm text-gray-500 font-medium mb-2">Bio</p>
                  <p className="text-gray-900">{userData.bio}</p>
                </div>
              )}
              
              {/* Success message */}
              {successMessage && (
                <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-800 text-sm font-medium">{successMessage}</p>
                  </div>
                </div>
              )}
              
              {/* Loading indicator for updates */}
              {updateLoading && (
                <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <p className="text-blue-800 text-sm">Updating profile...</p>
                  </div>
                </div>
              )}
              
              {/* Error display */}
              {error && (
                <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          userData={userData}
          onSave={handleUpdateProfile}
          loading={updateLoading}
        />
      </div>
    </SidebarProvider>
  );
}