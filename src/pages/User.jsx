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
} from "lucide-react";
import { authAPI, eventAPI } from "../utils/api";
import { SidebarProvider } from "../components/homepage/SidebarProvider";
import AppSidebar from "../components/homepage/AppSidebar";
import { fetchEvents } from "../redux/slices/eventSlice";

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
  const handleUpdateProfile = async (updates) => {
    try {
      setLoading(true);
      const updatedProfile = await authAPI.updateProfile(updates);
      setProfileData(updatedProfile);
      
      // Update Redux store if needed
      // You might want to add an action to update user in authSlice
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
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
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
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
                      onClick={() => navigate("/settings")}
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
              
              {/* Loading indicator for updates */}
              {loading && (
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
      </div>
    </SidebarProvider>
  );
}
