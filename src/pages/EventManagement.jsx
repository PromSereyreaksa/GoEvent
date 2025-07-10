"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  ArrowLeft,
  Menu,
  Users,
  X,
} from "lucide-react";
import { fetchEvents, deleteEvent, clearRefreshFlag, searchEvents } from "../redux/slices/eventSlice";
import { useVendorCheck } from "../components/SecurityMonitor";
import EventCard from "../components/Event/EventCard";
import ConfirmationModal from "../components/Event/ConfirmationModal";
import TeamManagement from "../components/Event/TeamManagement";
import { SidebarProvider } from "../components/homepage/SidebarProvider";
import AppSidebar from "../components/homepage/AppSidebar";

export default function EventManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { is_vendor } = useVendorCheck();

  const { events, loading, error, shouldRefreshEvents } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Actual search query that triggers API calls
  const [filterCategory, setFilterCategory] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Handle search from URL params (from global search)
  useEffect(() => {
    const searchQueryParam = searchParams.get("search");
    if (searchQueryParam) {
      setSearchTerm(searchQueryParam);
      setSearchQuery(searchQueryParam); // Trigger search immediately for URL params
    }
  }, [searchParams]);

  // Search effect - only triggers when searchQuery changes (on Enter)
  useEffect(() => {
    console.log('🔍 Search effect triggered, searchQuery:', searchQuery);
    
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      console.log('🔍 Performing backend event search for:', searchQuery);
      dispatch(searchEvents(searchQuery.trim()))
        .then((result) => {
          console.log('✅ Search completed:', result);
          setIsSearching(false);
        })
        .catch((error) => {
          console.error('❌ Search failed:', error);
          setIsSearching(false);
        });
    } else if (searchQuery.trim().length === 0) {
      // If search is cleared, fetch all events
      console.log('🔄 Search cleared, fetching all events');
      dispatch(fetchEvents());
    }
  }, [searchQuery, dispatch]);

  // Handle Enter key press for search
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log('🔍 Enter pressed, triggering search for:', searchTerm);
      setSearchQuery(searchTerm);
    }
  };

  // Handle search clear
  const handleSearchClear = () => {
    setSearchTerm("");
    setSearchQuery("");
  };

  useEffect(() => {
    // Only fetch events on initial load if there's no search query
    if (!searchQuery.trim()) {
      console.log('🔄 EventManagement: Fetching events (with backend team_members support)...')
      dispatch(fetchEvents());
    } else {
      console.log('⏸️ EventManagement: Skipping initial fetch, search query present:', searchQuery);
    }
  }, [dispatch]); // Removed searchQuery from dependencies to prevent conflicts

  // Debug: Log current user and events for troubleshooting
  useEffect(() => {
    console.log('🔍 EventManagement Debug:');
    console.log('👤 Current user:', { 
      is_vendor, 
      user_id: user?.id, 
      user_email: user?.email,
      user_role: user?.role,
      user_is_vendor: user?.is_vendor 
    });
    console.log('📋 Events loaded:', events.length);
    
    // Update selectedEvent if it exists and events have changed
    if (selectedEvent && events.length > 0) {
      const updatedEvent = events.find(e => e.id === selectedEvent.id);
      if (updatedEvent && updatedEvent !== selectedEvent) {
        console.log('🔄 EventManagement: Updating selectedEvent with new data:', {
          previousTeamMembers: selectedEvent.team_members?.length || 0,
          newTeamMembers: updatedEvent.team_members?.length || 0
        });
        setSelectedEvent(updatedEvent);
      }
    }
    
    if (events.length > 0) {
      console.log('📋 Events with team member access:');
      events.forEach((event, index) => {
        const teamMembers = event.team_members || event.teamMembers || [];
        console.log(`Event ${event.title}:`, {
          id: event.id,
          team_members: teamMembers,
          team_members_structure: teamMembers.map(tm => ({
            id: tm.id,
            user_id: tm.user_id,
            email: tm.email,
            first_name: tm.first_name,
            last_name: tm.last_name
          }))
        });
        
        const isUserTeamMember = teamMembers.some(tm => {
          const matches = tm.id === user?.id || 
                         tm.user_id === user?.id ||
                         tm.email === user?.email ||
                         (typeof tm === 'string' && tm === user?.email) ||
                         (typeof tm === 'number' && tm === user?.id);
          
          if (matches) {
            console.log(`✅ User IS team member of "${event.title}":`, tm);
          }
          return matches;
        });
        
        console.log(`User is team member of "${event.title}":`, isUserTeamMember);
        
        const isUserAdmin = event.admin?.id === user?.id || 
                           event.admin?.user_id === user?.id ||
                           event.admin?.email === user?.email ||
                           event.created_by === user?.id ||
                           event.createdBy === user?.id;
        
        console.log(`  ${index + 1}. "${event.title}":`, {
          id: event.id,
          admin: event.admin,
          team_members_count: teamMembers.length,
          team_members: teamMembers,
          user_is_admin: isUserAdmin,
          user_is_team_member: isUserTeamMember,
          user_has_access: isUserAdmin || isUserTeamMember,
          raw_event_data: {
            admin_structure: event.admin,
            team_members_structure: teamMembers
          }
        });
      });
      
      // Summary of access
      const accessibleEvents = events.filter(event => {
        const teamMembers = event.team_members || event.teamMembers || [];
        const isUserTeamMember = teamMembers.some(tm => 
          tm.id === user?.id || 
          tm.user_id === user?.id ||
          tm.email === user?.email ||
          (typeof tm === 'string' && tm === user?.email) ||
          (typeof tm === 'number' && tm === user?.id)
        );
        const isUserAdmin = event.admin?.id === user?.id || 
                           event.admin?.user_id === user?.id ||
                           event.admin?.email === user?.email ||
                           event.created_by === user?.id ||
                           event.createdBy === user?.id;
        return isUserAdmin || isUserTeamMember;
      });
      
      console.log(`🎯 Summary: User has access to ${accessibleEvents.length} out of ${events.length} events`);
      if (accessibleEvents.length !== events.length) {
        console.log('⚠️ Backend filtering may not be working correctly - frontend shows events user shouldn\'t have access to');
      }
      
    } else {
      console.log('❌ No events found for current user');
      console.log('🔍 This could mean:');
      console.log('  1. User is not a vendor and not added as team member to any events');
      console.log('  2. Backend filtering is working correctly');
      console.log('  3. There are no events in the system');
    }
    
    if (loading) console.log('🔄 Loading state:', loading);
    if (error) console.log('❌ Error state:', error);
    
    // Run detailed debug analysis
    if (events.length > 0 && user) {
      // Debug functionality removed
    }
  }, [events, user, is_vendor, selectedEvent]);

  // Add event refresh logic when team members are added
  useEffect(() => {
    if (shouldRefreshEvents) {
      console.log('🔄 Refreshing events due to team member changes...');
      dispatch(fetchEvents());
      // Clear the refresh flag
      dispatch(clearRefreshFlag());
    }
  }, [shouldRefreshEvents, dispatch]);

  const handleCreateEvent = () => {
    if (is_vendor) {
      navigate("/events/create");
    } else {
      alert(
        "Vendor access required to create events. Please upgrade your account to become a vendor."
      );
    }
  };

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

  const handleViewEvent = (event) => {
    navigate(`/events/${event.id}`);
  };

  const handleEditEvent = (eventId) => {
    if (is_vendor) {
      navigate(`/events/${eventId}/edit`);
    } else {
      alert("Vendor access required to edit events.");
    }
  };

  const handleDeleteEvent = (event) => {
    if (is_vendor) {
      setEventToDelete(event);
      setShowDeleteModal(true);
    } else {
      alert("Vendor access required to delete events.");
    }
  };

  const confirmDelete = async () => {
    if (eventToDelete) {
      await dispatch(deleteEvent(eventToDelete.id));
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  const handleManageTeam = (event) => {
    setSelectedEvent(event);
    setShowTeamManagement(true);
  };

  const filteredEvents = events.filter((event) => {
    // Only filter by category since search is now handled by backend
    const matchesCategory =
      filterCategory === "all" || event.category === filterCategory;
    return matchesCategory;
  });

  if (loading || isSearching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isSearching ? 'Searching events...' : 'Loading events...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
        {/* Main Content - full width with proper margins */}
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
                    Event Management
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    Manage and organize your events
                  </p>
                </div>
              </div>

              {/* Create Event Button - Only show for vendors */}
              <div className="w-full md:w-auto mt-4 md:mt-0 flex gap-2">
                {is_vendor ? (
                  <button
                    onClick={handleCreateEvent}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base min-h-[44px]"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="whitespace-nowrap">Create Event</span>
                  </button>
                ) : (
                  <div className="w-full md:w-auto bg-gray-100 text-gray-500 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg cursor-not-allowed text-sm sm:text-base min-h-[44px] flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="whitespace-nowrap">
                        Create Event (Vendor Only)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search events... (Press Enter to search)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full pl-9 sm:pl-10 pr-12 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
                {searchTerm && (
                  <button
                    onClick={handleSearchClear}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full sm:w-auto pl-9 sm:pl-10 pr-8 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm sm:text-base min-w-[160px]"
                >
                  <option value="all">All Categories</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate</option>
                  <option value="birthday">Birthday</option>
                  <option value="conference">Conference</option>
                </select>
              </div>
            </div>

            {/* Non-vendor message */}
            {!is_vendor && (
              <div className="mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
                  Upgrade to Vendor Account
                </h3>
                <p className="text-blue-800 text-xs sm:text-sm">
                  To create, edit, and manage events, you need a vendor account.
                  <button className="ml-2 text-blue-600 underline hover:text-blue-800">
                    Learn more about vendor benefits
                  </button>
                </p>
              </div>
            )}

            {/* Events Grid */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base max-w-md mx-auto">
                  {searchQuery || filterCategory !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : is_vendor
                    ? "Get started by creating your first event"
                    : "No events available at the moment"}
                </p>
                {is_vendor && !searchQuery && filterCategory === "all" && (
                  <button
                    onClick={handleCreateEvent}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base min-h-[44px]"
                  >
                    Create Your First Event
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onView={() => handleViewEvent(event)}
                  />
                ))}
              </div>
            )}
            {/* Team Management Modal */}
            {showTeamManagement && selectedEvent && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto mx-4">
                  <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                        Team Management
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 truncate">
                        {selectedEvent.title}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowTeamManagement(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1 ml-2"
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                  <div className="p-4 sm:p-6">
                    <TeamManagement
                      eventId={selectedEvent.id}
                      teamMembers={selectedEvent.team_members || selectedEvent.teamMembers || []}
                      canManage={
                        is_vendor ||
                        selectedEvent.createdBy === "current_user_id"
                      } // You'll need to implement proper user ID checking
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
              isOpen={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              onConfirm={confirmDelete}
              title="Delete Event"
              message={`Are you sure you want to delete "${eventToDelete?.title}"? This action cannot be undone.`}
              confirmText="Delete"
              confirmButtonClass="bg-red-600 hover:bg-red-700"
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
