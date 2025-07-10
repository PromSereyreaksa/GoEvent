"use client";

import { useEffect, useState } from "react";
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
  ExternalLink,
  ChevronRight,
  Activity,
} from "lucide-react";
import { authAPI } from "../utils/api";
import { SidebarProvider } from "../components/homepage/SidebarProvider";
import AppSidebar from "../components/homepage/AppSidebar";
import { fetchEvents } from "../redux/slices/eventSlice";
import QuickEditModal from "../components/User/QuickEditModal";

export default function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    user,
    loading: authLoading,
    error: authError,
  } = useSelector((state) => state.auth);
  const { events } = useSelector((state) => state.events);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [quickEditModalOpen, setQuickEditModalOpen] = useState(false);
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

        const response = await authAPI.getProfile();
        setProfileData(response);

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

      const createdEvents = events.filter(
        (event) =>
          event.admin?.id === userId ||
          event.created_by === userId ||
          event.createdBy === userId
      );

      const teamEvents = events.filter((event) => {
        const teamMembers = event.team_members || event.teamMembers || [];
        return teamMembers.some(
          (member) =>
            member.id === userId ||
            member.user_id === userId ||
            member.email === user.email
        );
      });

      const activeEvents = events.filter(
        (event) =>
          event.is_published &&
          (event.admin?.id === userId ||
            event.created_by === userId ||
            event.createdBy === userId ||
            (event.team_members || event.teamMembers || []).some(
              (member) =>
                member.id === userId ||
                member.user_id === userId ||
                member.email === user.email
            ))
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

      const formData = new FormData();

      Object.keys(updates).forEach((key) => {
        if (updates[key] !== null && updates[key] !== undefined) {
          formData.append(key, updates[key]);
        }
      });

      const updatedProfile = await authAPI.updateProfile(formData);
      setProfileData(updatedProfile);

      setSuccessMessage("Profile updated successfully!");
      setQuickEditModalOpen(false);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading && !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-purple-200 border-b-purple-600 rounded-full animate-spin mx-auto"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all font-medium shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const userData = profileData || user;

  const statsCards = [
    {
      icon: <CalendarHeart className="w-6 h-6" />,
      title: "Events Created",
      value: userStats.eventsCreated.toString(),
      description: "Total events organized",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Events",
      value: userStats.teamEvents.toString(),
      description: "Events as team member",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Account Type",
      value: userData?.is_vendor ? "Vendor" : "User",
      description: "Current account status",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Active Events",
      value: userStats.activeEvents.toString(),
      description: "Currently active events",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex w-full">
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
                className="p-3 rounded-xl hover:bg-white/80 backdrop-blur-sm transition-all shadow-sm"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-3 rounded-xl hover:bg-white/80 backdrop-blur-sm transition-all shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  My Profile
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your account and personal information
                </p>
              </div>
            </div>

            {/* Hero Profile Section */}
            <div className="relative mb-8">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-700 rounded-3xl"></div>
              <div className="absolute inset-0 bg-blue-900/10 rounded-3xl"></div>

              {/* Content */}
              <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-2xl border border-blue-200">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-700">
                      <img
                        src={
                          userData.profile_picture ||
                          "/placeholder.svg?height=160&width=160"
                        }
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover bg-white"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-avatar.svg";
                        }}
                      />
                    </div>

                    {/* Status Badges */}
                    <div className="absolute -top-2 -right-2 flex flex-col gap-2">
                      {userData.is_vendor && (
                        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                          <Briefcase className="w-3 h-3" />
                          Vendor
                        </div>
                      )}
                      {userData.is_partner && (
                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                          <Shield className="w-3 h-3" />
                          Partner
                        </div>
                      )}
                    </div>

                    {/* Online Status */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-blue-500 border-4 border-white rounded-full shadow-lg"></div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                      {userData.first_name} {userData.last_name}
                    </h2>
                    <p className="text-lg text-gray-600 mb-4 flex items-center justify-center lg:justify-start gap-2">
                      <Mail className="w-4 h-4" />
                      {userData.email}
                    </p>

                    {/* Quick Info Tags */}
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
                      {userData.phone_number && (
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-gray-200">
                          <Phone className="w-4 h-4 text-blue-600" />
                          {userData.phone_number}
                        </div>
                      )}
                      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full text-sm font-medium">
                        <UserCheck className="w-4 h-4 text-blue-700" />
                        {userData.is_vendor ? "Vendor Account" : "User Account"}
                      </div>
                      <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full text-sm font-medium">
                        <Activity className="w-4 h-4 text-green-700" />
                        Active
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => setQuickEditModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-500 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <Edit3 className="w-5 h-5" />
                        Quick Edit Profile
                      </button>
                      <button
                        onClick={() => navigate("/settings?tab=profile")}
                        className="flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-xl hover:bg-white transition-all font-semibold shadow-lg border border-gray-200 hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <Settings className="w-5 h-5" />
                        Advanced Settings
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <div key={index} className="group relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity`}
                  ></div>
                  <div
                    className={`relative bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-white/50`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl text-white shadow-lg`}
                      >
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Personal Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 hover:from-gray-100 hover:to-blue-100 transition-all border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl text-white">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Full Name
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {userData.first_name} {userData.last_name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group bg-gradient-to-r from-gray-50 to-green-50 rounded-xl p-6 hover:from-gray-100 hover:to-green-100 transition-all border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Email
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {userData.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-6 hover:from-gray-100 hover:to-purple-100 transition-all border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Phone
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {userData.phone_number || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl p-6 hover:from-gray-100 hover:to-orange-100 transition-all border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl text-white">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Account Status
                      </p>
                      <div className="flex gap-2">
                        {userData.is_vendor && (
                          <span className="text-green-600 font-bold text-lg">
                            Vendor
                          </span>
                        )}
                        {userData.is_partner && (
                          <span className="text-purple-600 font-bold text-lg">
                            Partner
                          </span>
                        )}
                        {!userData.is_vendor && !userData.is_partner && (
                          <span className="text-blue-600 font-bold text-lg">
                            Regular User
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success message */}
              {successMessage && (
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-full">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-green-800 font-semibold">
                      {successMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* Error display */}
              {error && (
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500 rounded-full">
                      <ExternalLink className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-red-800 font-semibold">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Edit Modal */}
        <QuickEditModal
          isOpen={quickEditModalOpen}
          onClose={() => setQuickEditModalOpen(false)}
          userData={userData}
          onSave={handleUpdateProfile}
          loading={updateLoading}
        />
      </div>
    </SidebarProvider>
  );
}
