"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Menu, X, Edit, Trash2, UserPlus } from "lucide-react";
import { EventInformation } from "../components/Event/EventInformation";
import { sampleEvents } from "../components/Event/data";
import { animationStyles } from "../components/Event/animations";
import { eventAPI } from "../utils/api";
import AppSidebar from "../components/layout/AppSidebar";
import { SidebarProvider } from "../components/shared/SidebarProvider";
import { useVendorCheck } from "../components/SecurityMonitor";
import TeamManagement from "../components/Event/TeamManagement";
import ConfirmationModal from "../components/Event/ConfirmationModal";
import { useDispatch } from "react-redux";
import { deleteEvent } from "../redux/slices/eventSlice";

export default function EventView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { is_vendor } = useVendorCheck();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Permission checks
  const canEdit = is_vendor;
  const canDelete = is_vendor;
  const canManageTeam = is_vendor || event?.createdBy === "current_user_id";

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

  const handleEdit = () => {
    if (is_vendor) {
      navigate(`/events/${id}/edit`);
    } else {
      alert("Vendor access required to edit events.");
    }
  };

  const handleDelete = () => {
    if (is_vendor) {
      setShowDeleteModal(true);
    } else {
      alert("Vendor access required to delete events.");
    }
  };

  const confirmDelete = async () => {
    if (event) {
      await dispatch(deleteEvent(event.id));
      setShowDeleteModal(false);
      navigate("/events");
    }
  };

  const handleManageTeam = () => {
    setShowTeamManagement(true);
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
          {/* Sticky Top Navigation Bar with Actions */}
          <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-6 lg:px-8 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Event Details</h1>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {canManageTeam && (
                  <button
                    onClick={handleManageTeam}
                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Team Members</span>
                  </button>
                )}
                
                {canEdit && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                )}
                
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                )}
              </div>
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

        {/* Full Page Team Management Modal */}
        {showTeamManagement && event && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
                <p className="text-gray-600">{event.title}</p>
              </div>
              <button
                onClick={() => setShowTeamManagement(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <TeamManagement
                eventId={event.id}
                teamMembers={event.team_members || []}
                canManage={is_vendor || event.createdBy === "current_user_id"}
                eventTitle={event.title}
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Delete Event"
          message={`Are you sure you want to delete "${event?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      </div>
    </SidebarProvider>
  );
}
