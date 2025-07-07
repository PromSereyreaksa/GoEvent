"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Plus, Search, Filter, Calendar, ArrowLeft, Menu } from "lucide-react"
import { fetchEvents, deleteEvent } from "../redux/slices/eventSlice"
import { useVendorCheck } from "../components/SecurityMonitor"
import EventCard from "../components/Event/EventCard"
import ConfirmationModal from "../components/Event/ConfirmationModal"
import { SidebarProvider } from "../components/homepage/SidebarProvider"
import AppSidebar from "../components/homepage/AppSidebar"

export default function EventManagement() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { is_vendor } = useVendorCheck()

  const { events, loading, error } = useSelector((state) => state.events)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Handle search from URL params (from global search)
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    dispatch(fetchEvents())
  }, [dispatch])

  const handleCreateEvent = () => {
    if (is_vendor) {
      navigate("/events/create")
    } else {
      alert("Vendor access required to create events. Please upgrade your account to become a vendor.")
    }
  }

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

  const handleEditEvent = (eventId) => {
    if (is_vendor) {
      navigate(`/events/${eventId}/edit`)
    } else {
      alert("Vendor access required to edit events.")
    }
  }

  const handleDeleteEvent = (event) => {
    if (is_vendor) {
      setEventToDelete(event)
      setShowDeleteModal(true)
    } else {
      alert("Vendor access required to delete events.")
    }
  }

  const confirmDelete = async () => {
    if (eventToDelete) {
      await dispatch(deleteEvent(eventToDelete.id))
      setShowDeleteModal(false)
      setEventToDelete(null)
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || event.category === filterCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content - with proper margin for sidebar */}
        <div className="lg:ml-64 transition-all duration-300 min-h-screen">
          <div className="w-full px-6 py-6">
            {/* Header with Back Navigation and Mobile Menu */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => {
                  // Go back to the previous page if possible, otherwise fallback to dashboard
                  if (window.history.length > 2) {
                    window.history.back();
                  } else {
                    navigate("/dashboard");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Management</h1>
            <p className="text-gray-600">Manage and organize your events</p>
          </div>

          {/* Create Event Button - Only show for vendors */}
          {is_vendor ? (
            <button
              onClick={handleCreateEvent}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          ) : (
            <div className="bg-gray-100 text-gray-500 px-6 py-3 rounded-lg cursor-not-allowed">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Event (Vendor Only)
              </div>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
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
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Upgrade to Vendor Account</h3>
            <p className="text-blue-800 text-sm">
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
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : is_vendor
                  ? "Get started by creating your first event"
                  : "No events available at the moment"}
            </p>
            {is_vendor && !searchTerm && filterCategory === "all" && (
              <button
                onClick={handleCreateEvent}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Event
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={() => handleEditEvent(event.id)}
                onDelete={() => handleDeleteEvent(event)}
                onView={() => navigate(`/events/${event.id}`)}
                canEdit={is_vendor}
                canDelete={is_vendor}
              />
            ))}
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
  )
}
