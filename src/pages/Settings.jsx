"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu, ArrowLeft, Bell, Shield, Palette, Save } from "lucide-react";
import AppSidebar from "../components/homepage/AppSidebar";
import { SidebarProvider } from "../components/homepage/SidebarProvider";

export default function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");
  const [loading, setLoading] = useState(false);
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

    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSave = async (section) => {
    setLoading(true);
    try {
      // Here you would make API calls to save the settings
      console.log(`Saving ${section} settings:`, formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(
        `${
          section.charAt(0).toUpperCase() + section.slice(1)
        } settings saved successfully!`
      );
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Palette },
  ];

  const renderNotificationSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Notification Preferences
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Email Notifications
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Receive notifications via email
              </p>
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
              <p className="text-sm font-medium text-gray-900">
                Push Notifications
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Receive push notifications
              </p>
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
              <p className="text-sm text-gray-600 mt-1">
                Notifications about your events
              </p>
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
              <p className="text-sm font-medium text-gray-900">
                Guest Activities
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Notifications about guest responses
              </p>
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
              <p className="text-sm text-gray-600 mt-1">
                Promotional emails and updates
              </p>
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
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 font-medium"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Privacy Settings
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Profile Visibility
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Make your profile visible to other users
              </p>
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
              <p className="text-sm text-gray-600 mt-1">
                Display email on your public profile
              </p>
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
              <p className="text-sm text-gray-600 mt-1">
                Display phone number on your public profile
              </p>
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
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 font-medium"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          App Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Theme
            </label>
            <select
              name="preferences.theme"
              value={formData.preferences.theme}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-gray-400 transition-colors"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <select
              name="preferences.language"
              value={formData.preferences.language}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-gray-400 transition-colors"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Timezone
            </label>
            <select
              name="preferences.timezone"
              value={formData.preferences.timezone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-gray-400 transition-colors"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date Format
            </label>
            <select
              name="preferences.dateFormat"
              value={formData.preferences.dateFormat}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-gray-400 transition-colors"
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
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 font-medium"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "notifications":
        return renderNotificationSettings();
      case "privacy":
        return renderPrivacySettings();
      case "preferences":
        return renderPreferences();
      default:
        return renderNotificationSettings();
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] w-full">
        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />

        {/* Main Content - with proper margin for sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out ${
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => {
                    // Go back to the previous page if possible, otherwise fallback to dashboard
                    if (window.history.length > 2) {
                      window.history.back();
                    } else {
                      navigate("/dashboard");
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">
                    Settings
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    Manage your account preferences
                  </p>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <nav className="flex space-x-8 px-6">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
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
                      );
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
  );
}
