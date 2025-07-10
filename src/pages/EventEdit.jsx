"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Menu, AlertCircle } from "lucide-react"
import AppSidebar from "../components/layout/AppSidebar"
import NotificationsDropdown from "../components/shared/NotificationsDropdown"
import { EventForm } from "../components/Event/EventForm"
import { fetchEventById, updateEvent, clearError, clearCurrentEvent } from "../redux/slices/eventSlice"
import { animationStyles } from "../components/Event/animations"

export default function EventEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { currentEvent, loading, error } = useSelector((state) => state.events)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    category: "wedding",
    customCategory: "",
    googleMapLink: "",
    youtubeUrl: "",
    videoMessageUrl: "",
    image: "",
    agenda: [
      {
        id: Date.now(),
        date: "",
        title: "",
        activities: [{ id: Date.now() + 1, time: "", activity: "" }],
      },
    ],
    hosts: [{ id: Date.now(), name: "", parentNames: ["", ""] }],
    sponsors: [],
  })

  const isVendor = user?.is_vendor || user?.role === "vendor"

  // Redirect non-vendors immediately
  useEffect(() => {
    if (!isVendor) {
      navigate("/events", { replace: true })
    }
  }, [isVendor, navigate])

  console.log("EventEdit render:", {
    eventId: id,
    loading,
    hasCurrentEvent: !!currentEvent,
    formDataTitle: formData.title,
  })

  // Fetch the event to edit
  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id))
    }

    return () => {
      dispatch(clearCurrentEvent())
    }
  }, [id, dispatch])

  // Populate form data when event is loaded
  useEffect(() => {
    if (currentEvent) {
      setFormData({
        title: currentEvent.title || currentEvent.name || "",
        description: currentEvent.description || currentEvent.details || "",
        date: currentEvent.date || "",
        startTime: currentEvent.startTime || "",
        endTime: currentEvent.endTime || "",
        venue: currentEvent.venue || "",
        category: currentEvent.category || "wedding",
        customCategory: currentEvent.customCategory || "",
        googleMapLink: currentEvent.googleMapLink || "",
        youtubeUrl: currentEvent.youtubeUrl || "",
        videoMessageUrl: currentEvent.videoMessageUrl || "",
        image: currentEvent.image || "",
        agenda:
          currentEvent.agenda && currentEvent.agenda.length > 0
            ? currentEvent.agenda
            : [
                {
                  id: Date.now(),
                  date: currentEvent.date || "",
                  title: "",
                  activities: [
                    {
                      id: Date.now() + 1,
                      time: currentEvent.startTime || "",
                      activity: "",
                    },
                  ],
                },
              ],
        hosts:
          currentEvent.hosts && currentEvent.hosts.length > 0
            ? currentEvent.hosts
            : [{ id: Date.now(), name: "", parentNames: ["", ""] }],
        sponsors: currentEvent.sponsors || [],
      })
    }
  }, [currentEvent])

  // Hide header and footer
  useEffect(() => {
    const header = document.querySelector("header")
    const footer = document.querySelector("footer")

    if (header) header.style.display = "none"
    if (footer) footer.style.display = "none"

    return () => {
      if (header) header.style.display = "block"
      if (footer) footer.style.display = "block"
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0]
    if (file) {
      // Add file size check (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Please choose a smaller image (max 5MB).')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: event.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Validation function with detailed debugging
  const validateForm = () => {
    console.log('Current formData:', formData)
    console.log('Title value:', formData.title)
    console.log('Title type:', typeof formData.title)
    console.log('Title length:', formData.title?.length)
    
    const requiredFields = ['title', 'date', 'venue', 'category']
    const missingFields = requiredFields.filter(field => {
      const value = formData[field]
      const isEmpty = !value || value.toString().trim() === ''
      console.log(`Field ${field}:`, value, 'isEmpty:', isEmpty)
      return isEmpty
    })
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      console.error('Full form data:', JSON.stringify(formData, null, 2))
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`)
      return false
    }
    
    // Validate date format
    if (formData.date && !isValidDate(formData.date)) {
      alert('Please enter a valid date')
      return false
    }

    // Validate time format if provided
    if (formData.startTime && !isValidTime(formData.startTime)) {
      alert('Please enter a valid start time')
      return false
    }

    if (formData.endTime && !isValidTime(formData.endTime)) {
      alert('Please enter a valid end time')
      return false
    }
    
    return true
  }

  const isValidDate = (dateString) => {
    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date)
  }

  const isValidTime = (timeString) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(timeString)
  }

  // Clean up form data before sending - match Django model structure
  const cleanFormData = (data) => {
    // Clean up agenda data
    const cleanedAgenda = data.agenda
      .filter(day => day.date && day.title)
      .map(day => ({
        date: day.date,
        agenda_details: day.activities
          .filter(activity => activity.time && activity.activity)
          .map((activity, index) => ({
            language: 'en',
            agenda_detail: activity.activity,
            time_text: activity.time,
            order: index + 1
          }))
      }))

    // Clean up hosts data
    const cleanedHosts = data.hosts
      .filter(host => host.name)
      .map(host => ({
        host_names: [{
          language: 'en',
          host_name: host.name,
          parent_a_name: host.parentNames[0] || '',
          parent_b_name: host.parentNames[1] || ''
        }]
      }))

    // Clean up sponsors data
    const cleanedSponsors = data.sponsors
      .filter(sponsor => sponsor && sponsor.name)
      .map(sponsor => ({
        name: sponsor.name,
        logo: sponsor.logo || null
      }))

    return {
      title: data.title,
      description: data.description || '',
      date: data.date || null,
      start_time: data.startTime || null,
      end_time: data.endTime || null,
      venue_name: data.venue || '',
      category: data.category === 'other' ? data.customCategory : data.category,
      google_map_embed_link: data.googleMapLink || '',
      youtube_embed_link: data.youtubeUrl || '',
      video_message_embed_link: data.videoMessageUrl || '',
      event_banner: data.image || null,
      agenda: cleanedAgenda,
      hosts: cleanedHosts,
      sponsors: cleanedSponsors
    }
  }

  const handleSave = async () => {
    try {
      console.log("Raw form data:", formData)
      
      // Validate form
      if (!validateForm()) {
        return
      }
      
      // Clean and format data
      const cleanedData = cleanFormData(formData)
      console.log("Cleaned data being sent:", cleanedData)
      
      await dispatch(updateEvent({ id: Number.parseInt(id), eventData: cleanedData })).unwrap()
      navigate("/events", { replace: true })
    } catch (err) {
      console.error("Error updating event:", err)
      console.error("Error response:", err.response?.data)
      
      // Show more specific error message
      if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`)
      } else if (err.message) {
        alert(`Error: ${err.message}`)
      } else {
        alert('An error occurred while updating the event. Please try again.')
      }
    }
  }

  const handleCancel = () => {
    // Go back to the previous page if possible, otherwise fallback to events list
    if (window.history.length > 2) {
      window.history.back();
    } else {
      navigate("/events", { replace: true });
    }
  }

  const handleClearError = () => {
    dispatch(clearError())
  }

  // Form handlers for complex nested data
  const handleAgendaChange = (agendaIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.map((day, index) => (index === agendaIndex ? { ...day, [field]: value } : day)),
    }))
  }

  const handleActivityChange = (agendaIndex, activityIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.map((day, dayIndex) =>
        dayIndex === agendaIndex
          ? {
              ...day,
              activities: day.activities.map((activity, actIndex) =>
                actIndex === activityIndex ? { ...activity, [field]: value } : activity,
              ),
            }
          : day,
      ),
    }))
  }

  const handleHostChange = (hostIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      hosts: prev.hosts.map((host, index) => (index === hostIndex ? { ...host, [field]: value } : host)),
    }))
  }

  const handleParentNameChange = (hostIndex, parentIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      hosts: prev.hosts.map((host, hIndex) =>
        hIndex === hostIndex
          ? {
              ...host,
              parentNames: host.parentNames.map((name, pIndex) => (pIndex === parentIndex ? value : name)),
            }
          : host,
      ),
    }))
  }

  const addAgendaDay = () => {
    setFormData((prev) => ({
      ...prev,
      agenda: [
        ...prev.agenda,
        {
          id: Date.now(),
          date: "",
          title: "",
          activities: [{ id: Date.now() + 1, time: "", activity: "" }],
        },
      ],
    }))
  }

  const removeAgendaDay = (agendaIndex) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.filter((_, index) => index !== agendaIndex),
    }))
  }

  const addActivity = (agendaIndex) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.map((day, index) =>
        index === agendaIndex
          ? {
              ...day,
              activities: [...day.activities, { id: Date.now(), time: "", activity: "" }],
            }
          : day,
      ),
    }))
  }

  const removeActivity = (agendaIndex, activityIndex) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.map((day, dayIndex) =>
        dayIndex === agendaIndex
          ? {
              ...day,
              activities: day.activities.filter((_, actIndex) => actIndex !== activityIndex),
            }
          : day,
      ),
    }))
  }

  const addHost = () => {
    setFormData((prev) => ({
      ...prev,
      hosts: [...prev.hosts, { id: Date.now(), name: "", parentNames: ["", ""] }],
    }))
  }

  const removeHost = (hostIndex) => {
    setFormData((prev) => ({
      ...prev,
      hosts: prev.hosts.filter((_, index) => index !== hostIndex),
    }))
  }

  const addParentName = (hostIndex) => {
    setFormData((prev) => ({
      ...prev,
      hosts: prev.hosts.map((host, index) =>
        index === hostIndex ? { ...host, parentNames: [...host.parentNames, ""] } : host,
      ),
    }))
  }

  const removeParentName = (hostIndex, parentIndex) => {
    setFormData((prev) => ({
      ...prev,
      hosts: prev.hosts.map((host, hIndex) =>
        hIndex === hostIndex
          ? {
              ...host,
              parentNames: host.parentNames.filter((_, pIndex) => pIndex !== parentIndex),
            }
          : host,
      ),
    }))
  }

  // Loading state
  if (loading && !currentEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans'] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !currentEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans'] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Failed to Load Event</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                // Go back to the previous page if possible, otherwise fallback to events list
                if (window.history.length > 2) {
                  window.history.back();
                } else {
                  navigate("/events");
                }
              }}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Events
            </button>
            <button
              onClick={() => dispatch(fetchEventById(id))}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="relative max-w-md">
                <h1 className="text-xl font-bold text-gray-900">Edit Event</h1>
                <p className="text-sm text-gray-600">
                  {currentEvent?.title || currentEvent?.name
                    ? `Editing: ${currentEvent.title || currentEvent.name}`
                    : "Update event details"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationsDropdown />
              <div className="text-sm text-gray-500">{loading ? "Saving..." : ""}</div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xs">!</span>
                  </div>
                  <p className="text-red-800 font-medium">Error</p>
                </div>
                <button
                  onClick={handleClearError}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Dismiss
                </button>
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
            isEdit={true}
            loading={loading}
            error={error}
            // Extended props for complex form handling
            onAgendaChange={handleAgendaChange}
            onActivityChange={handleActivityChange}
            onHostChange={handleHostChange}
            onParentNameChange={handleParentNameChange}
            addAgendaDay={addAgendaDay}
            removeAgendaDay={removeAgendaDay}
            addActivity={addActivity}
            removeActivity={removeActivity}
            addHost={addHost}
            removeHost={removeHost}
            addParentName={addParentName}
            removeParentName={removeParentName}
          />
        </div>
      </div>
    </div>
  )
}