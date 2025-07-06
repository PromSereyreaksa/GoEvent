"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, Lock } from "lucide-react";
import AppSidebar from "../components/homepage/AppSidebar";
import { NotificationsDropdown } from "../components/Event/NotificationsDropdown";
import { EventForm } from "../components/Event/EventForm";
import { useVendorCheck } from "../components/SecurityMonitor";
import { notifications } from "../components/Event/data";
import { animationStyles } from "../components/Event/animations";
import { eventAPI } from "../utils/api";

export default function EventCreate() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isVendor } = useVendorCheck();

  // Redirect non-vendors immediately
  if (!isVendor) {
    navigate("/events", { replace: true });
    return null;
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    eventType: "wedding",
    customEventType: "",
    name: "",
    details: "",
    agenda: [
      {
        id: Date.now(),
        date: "",
        title: "",
        activities: [{ id: Date.now() + 1, time: "", activity: "" }],
      },
    ],
    venue: "",
    hosts: [
      { id: Date.now(), name: "", parentNames: [""] },
      { id: Date.now() + 1, name: "", parentNames: [""] },
    ],
    date: "",
    startTime: "",
    endTime: "",
    youtubeUrl: "",
    googleMapLink: "",
    image: "",
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleFileUpload = useCallback((e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      await eventAPI.createEvent(formData);
      navigate("/events", { replace: true });
    } catch (err) {
      console.error("Error creating event:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/events", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans']">
      <style>{animationStyles}</style>

      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
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

              <div className="relative max-w-md">
                <h1 className="text-xl font-bold text-gray-900">
                  Create Event
                </h1>
                <p className="text-sm text-gray-600">
                  Fill in the details to create a new event
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationsDropdown notifications={notifications} />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xs">!</span>
                </div>
                <p className="text-red-800 font-medium">Error</p>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          <EventForm
            formData={formData}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onSave={handleSave}
            onCancel={handleCancel}
            isEdit={false}
          />
        </div>
      </div>
    </div>
  );
}
