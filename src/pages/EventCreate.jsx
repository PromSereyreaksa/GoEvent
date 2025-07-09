"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Menu, ArrowLeft } from "lucide-react"
import AppSidebar from "../components/homepage/AppSidebar"
import NotificationsDropdown from "../components/homepage/NotificationsDropdown"
import { EventForm } from "../components/Event/EventForm"
import { createEvent, clearError } from "../redux/slices/eventSlice"
import { animationStyles } from "../components/Event/animations"

export default function EventCreate() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { loading, error } = useSelector((state) => state.events)

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
  })

  const isVendor = user?.is_vendor || user?.role === "vendor"

  useEffect(() => {
    if (!isVendor) {
      navigate("/events", { replace: true })
    }
  }, [isVendor, navigate])

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

  // Clean up form data before sending - only required fields for creation
  const cleanFormData = (data) => {
    console.log('cleanFormData received:', data);
    console.log('data.category:', data.category);
    console.log('data.customCategory:', data.customCategory);
    
    // Handle custom category
    let finalCategory = data.category;
    if (data.category === 'other' && data.customCategory) {
      finalCategory = data.customCategory;
    }
    
    console.log('finalCategory:', finalCategory);

    return {
      title: data.title,
      description: data.description || '',
      date: data.date || null,
      startTime: data.startTime || null,
      endTime: data.endTime || null,
      venueName: data.venue || '',
      category: finalCategory,
    }
  }
  

  const handleSave = async () => {
    try {
      console.log("Raw form data:", formData)
      console.log("Original category:", formData.category)
      
      // Validate form
      if (!validateForm()) {
        return
      }
      
      // Clean and format data
      const cleanedData = cleanFormData(formData)
      console.log("Cleaned data being sent:", cleanedData)
      console.log("Backend category:", cleanedData.category)
      
      // Additional validation for backend compatibility
      if (!cleanedData.title || !cleanedData.date || !cleanedData.venueName || !cleanedData.category) {
        alert('Missing required fields after data cleaning. Please check all required fields.')
        return
      }
      
      // Ensure date is in correct format (YYYY-MM-DD)
      if (cleanedData.date) {
        const dateObj = new Date(cleanedData.date)
        cleanedData.date = dateObj.toISOString().split('T')[0]
      }
      
      // Ensure times are in HH:MM format if provided
      if (cleanedData.start_time && !cleanedData.start_time.match(/^\d{2}:\d{2}$/)) {
        cleanedData.start_time = null
      }
      if (cleanedData.end_time && !cleanedData.end_time.match(/^\d{2}:\d{2}$/)) {
        cleanedData.end_time = null
      }
      
      // Remove null/undefined values to avoid backend issues
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === null || cleanedData[key] === undefined || cleanedData[key] === '') {
          if (['agenda', 'hosts', 'sponsors'].includes(key)) {
            cleanedData[key] = []
          } else if (!['title', 'date', 'venue_name', 'category'].includes(key)) {
            delete cleanedData[key]
          }
        }
      })
      
      console.log("Final cleaned data:", cleanedData)
      
      await dispatch(createEvent(cleanedData)).unwrap()
      navigate("/events", { replace: true })
    } catch (err) {
      console.error("Error creating event:", err)
      console.error("Error response:", err.response?.data)
      console.error("Error status:", err.response?.status)
      console.error("Full error object:", err)
      
      // More detailed error handling for 400 errors
      if (err.response?.status === 400) {
        const errorData = err.response.data
        if (typeof errorData === 'object') {
          const errorMessages = []
          Object.keys(errorData).forEach(field => {
            if (Array.isArray(errorData[field])) {
              errorMessages.push(`${field}: ${errorData[field].join(', ')}`)
            } else {
              errorMessages.push(`${field}: ${errorData[field]}`)
            }
          })
          alert(`Validation Error:\n${errorMessages.join('\n')}`)
        } else {
          alert(`Bad Request: ${errorData || 'Invalid data format'}`)
        }
      } else if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`)
      } else if (err.response?.data?.detail) {
        alert(`Error: ${err.response.data.detail}`)
      } else if (err.response?.data) {
        alert(`Error: ${JSON.stringify(err.response.data)}`)
      } else if (err.message) {
        alert(`Error: ${err.message}`)
      } else {
        alert('An error occurred while creating the event. Please try again.')
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

              {/* Back Button */}
              <button
                onClick={() => {
                  // Go back to the previous page if possible, otherwise fallback to events list
                  if (window.history.length > 2) {
                    window.history.back();
                  } else {
                    navigate("/events");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Events
              </button>

              <div className="relative max-w-md">
                <h1 className="text-xl font-bold text-gray-900">Create Event</h1>
                <p className="text-sm text-gray-600">Fill in the details to create a new event</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationsDropdown />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full">
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
            isEdit={false}
            loading={loading}
            error={error}
          />
          </div>
        </div>
      </div>
    </div>
  )
}