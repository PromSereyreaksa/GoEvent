"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { EventInformation } from "../components/Event/EventInformation";
import { sampleEvents } from "../components/Event/data";
import { animationStyles } from "../components/Event/animations";
import { eventAPI } from "../utils/api";
import AppSidebar from "../components/homepage/AppSidebar";
import { SidebarProvider } from "../components/homepage/SidebarProvider";

export default function EventView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simplified logic to find the event by ID, comparing as strings
        const sampleEvent = sampleEvents.find((e) => e.id.toString() === id);
        
        if (sampleEvent) {
          setEvent(sampleEvent);
        } else {
          const data = await eventAPI.getEvent(id);
          setEvent(data);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    } else {
      setError("No event ID provided");
      setLoading(false);
    }
  }, [id]);

  const handleBack = () => {
    // Go back to the previous page if possible, otherwise fallback to events list
    if (window.history.length > 2) {
      window.history.back();
    } else {
      navigate("/events");
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans']">
          <AppSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isCollapsed={sidebarCollapsed}
            setIsCollapsed={setSidebarCollapsed}
          />
          <div className={`transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Event Details</h1>
              </div>
            </div>
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading event...</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (error || !event) {
    return (
      <SidebarProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans']">
          <AppSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isCollapsed={sidebarCollapsed}
            setIsCollapsed={setSidebarCollapsed}
          />
          <div className={`transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Event Not Found</h1>
              </div>
            </div>
            <div className="flex items-center justify-center min-h-[50vh] text-center">
              <div>
                <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
                <p className="text-gray-600 mb-6">{error || "The event you're looking for doesn't exist."}</p>
                <button onClick={handleBack} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Back to Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans']">
        <style>{animationStyles}</style>
        
        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />

        <div className={`transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
          {/* Top Navigation Bar */}
          <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Event Details</h1>
            </div>
          </div>

          {/* Event Content */}
          <div className="min-h-screen">
            <div className="w-full h-full">
              <EventInformation
                event={event}
                onBack={handleBack}
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
