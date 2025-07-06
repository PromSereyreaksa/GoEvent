const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

// Helper function to get auth token
const getAuthToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token")
  )
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.message || errorData.detail || `HTTP error! status: ${response.status}`
    throw new Error(errorMessage)
  }
  return response.json()
}

// Helper function to make authenticated requests
const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken()

  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  // Handle token refresh if needed
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token")
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        })

        if (refreshResponse.ok) {
          const { access } = await refreshResponse.json()
          localStorage.setItem("token", access)
          localStorage.setItem("access_token", access)

          // Retry original request with new token
          return fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
              ...options.headers,
            },
          })
        }
      } catch (error) {
        console.error("Token refresh failed:", error)
      }
    }
    throw new Error("Authentication failed")
  }

  return response
}

// Transform frontend event data to backend format
const transformEventToBackend = (eventData) => {
  const transformed = {
    title: eventData.title,
    description: eventData.description || "",
    date: eventData.date,
    start_time: eventData.startTime,
    end_time: eventData.endTime,
    venue_name: eventData.venueName || "",
    google_map_embed_link: eventData.googleMapLink || "",
    youtube_embed_link: eventData.youtubeLink || "",
    video_message_embed_link: eventData.videoMessageLink || "",
    category: eventData.category || "wedding",
    package_plan: eventData.packagePlan || null,
    invitation_template: eventData.invitationTemplate || null,
    team_members: eventData.teamMembers || [],
  }

  // Transform host data
  if (eventData.hosts && eventData.hosts.length > 0) {
    transformed.host = eventData.hosts.map((host) => ({
      avatar: host.avatar || null,
      host_names: host.names || [],
    }))
  }

  // Transform agenda data
  if (eventData.agenda && eventData.agenda.length > 0) {
    transformed.agenda = eventData.agenda.map((agendaItem) => ({
      date: agendaItem.date,
      agenda_detail: agendaItem.details || [],
    }))
  }

  // Transform sponsors data
  if (eventData.sponsors && eventData.sponsors.length > 0) {
    transformed.event_sponsors = eventData.sponsors.map((sponsor) => ({
      name: sponsor.name || "",
      logo: sponsor.logo || null,
    }))
  }

  return transformed
}

// Transform backend event data to frontend format
const transformEventFromBackend = (backendData) => {
  return {
    id: backendData.id,
    title: backendData.title,
    description: backendData.description,
    date: backendData.date,
    startTime: backendData.start_time,
    endTime: backendData.end_time,
    venueName: backendData.venue_name,
    googleMapLink: backendData.google_map_embed_link,
    youtubeLink: backendData.youtube_embed_link,
    videoMessageLink: backendData.video_message_embed_link,
    category: backendData.category,
    packagePlan: backendData.package_plan,
    invitationTemplate: backendData.invitation_template,
    teamMembers: backendData.team_members || [],
    hosts: backendData.host || [],
    agenda: backendData.agenda || [],
    sponsors: backendData.event_sponsors || [],
    createdAt: backendData.created_at,
    updatedAt: backendData.updated_at,
  }
}

// Simple cache implementation
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

const getCachedData = (key) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  cache.delete(key)
  return null
}

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() })
}

// Create API object for default export
const api = {
  get: async (url) => {
    const response = await authenticatedFetch(url)
    return handleResponse(response)
  },
  post: async (url, data) => {
    const response = await authenticatedFetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
  put: async (url, data) => {
    const response = await authenticatedFetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
  patch: async (url, data) => {
    const response = await authenticatedFetch(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
  delete: async (url) => {
    const response = await authenticatedFetch(url, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error(`Failed to delete: ${response.status}`)
    }
    return true
  },
}

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    const data = await handleResponse(response)

    // Store tokens with consistent naming
    localStorage.setItem("token", data.access)
    localStorage.setItem("access_token", data.access)
    localStorage.setItem("refresh_token", data.refresh)
    localStorage.setItem("user", JSON.stringify(data.user))

    return data
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    return handleResponse(response)
  },

  logout: async () => {
    const refreshToken = localStorage.getItem("refresh_token")
    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ refresh: refreshToken }),
        })
      } catch (error) {
        console.error("Logout API call failed:", error)
      }
    }

    // Clear local storage regardless of API call success
    localStorage.removeItem("token")
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("access_token")
    sessionStorage.removeItem("refresh_token")
    sessionStorage.removeItem("user")
  },

  getProfile: async () => {
    const response = await authenticatedFetch("/auth/profile/")
    return handleResponse(response)
  },

  updateProfile: async (profileData) => {
    const response = await authenticatedFetch("/auth/profile/", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
    return handleResponse(response)
  },

  changePassword: async (passwordData) => {
    const response = await authenticatedFetch("/auth/change-password/", {
      method: "POST",
      body: JSON.stringify(passwordData),
    })
    return handleResponse(response)
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    const data = await handleResponse(response)
    localStorage.setItem("token", data.access)
    localStorage.setItem("access_token", data.access)
    return data
  },
}

// Event API
export const eventAPI = {
  // Renamed from getAll to getEvents
  getEvents: async () => {
    const cacheKey = "events_all"
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await authenticatedFetch("/events/")
    const data = await handleResponse(response)
    const transformedData = data.map(transformEventFromBackend)

    setCachedData(cacheKey, transformedData)
    return transformedData
  },

  // Renamed from getById to getEvent
  getEvent: async (id) => {
    const cacheKey = `event_${id}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await authenticatedFetch(`/events/${id}/`)
    const data = await handleResponse(response)
    const transformedData = transformEventFromBackend(data)

    setCachedData(cacheKey, transformedData)
    return transformedData
  },

  // Renamed from create to createEvent
  createEvent: async (eventData) => {
    const transformedData = transformEventToBackend(eventData)

    // Debug log to see what we're sending
    console.log("Sending event data:", transformedData)

    const response = await authenticatedFetch("/events/", {
      method: "POST",
      body: JSON.stringify(transformedData),
    })

    const data = await handleResponse(response)

    // Clear cache
    cache.delete("events_all")

    return transformEventFromBackend(data)
  },

  // Renamed from update to updateEvent
  updateEvent: async (id, eventData) => {
    const transformedData = transformEventToBackend(eventData)
    const response = await authenticatedFetch(`/events/${id}/`, {
      method: "PUT",
      body: JSON.stringify(transformedData),
    })

    const data = await handleResponse(response)

    // Clear cache
    cache.delete("events_all")
    cache.delete(`event_${id}`)

    return transformEventFromBackend(data)
  },

  // Renamed from delete to deleteEvent
  deleteEvent: async (id) => {
    const response = await authenticatedFetch(`/events/${id}/`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.status}`)
    }

    // Clear cache
    cache.delete("events_all")
    cache.delete(`event_${id}`)

    return true
  },

  getEventsByCategory: async (category) => {
    const cacheKey = `events_category_${category}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await authenticatedFetch(`/events/?category=${category}`)
    const data = await handleResponse(response)
    const transformedData = data.map(transformEventFromBackend)

    setCachedData(cacheKey, transformedData)
    return transformedData
  },

  // Keep backward compatibility aliases
  getAll: async () => {
    return eventAPI.getEvents()
  },

  getById: async (id) => {
    return eventAPI.getEvent(id)
  },

  create: async (eventData) => {
    return eventAPI.createEvent(eventData)
  },

  update: async (id, eventData) => {
    return eventAPI.updateEvent(id, eventData)
  },

  delete: async (id) => {
    return eventAPI.deleteEvent(id)
  },

  getByCategory: async (category) => {
    return eventAPI.getEventsByCategory(category)
  },
}

// Pricing API
export const pricingAPI = {
  getAll: async () => {
    const cacheKey = "pricing_plans"
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await fetch(`${API_BASE_URL}/pricing/`)
    const data = await handleResponse(response)

    setCachedData(cacheKey, data)
    return data
  },

  getById: async (id) => {
    const cacheKey = `pricing_plan_${id}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await fetch(`${API_BASE_URL}/pricing/${id}/`)
    const data = await handleResponse(response)

    setCachedData(cacheKey, data)
    return data
  },
}

// Team API
export const teamAPI = {
  getAll: async () => {
    const cacheKey = "team_members"
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await authenticatedFetch("/team/")
    const data = await handleResponse(response)

    setCachedData(cacheKey, data)
    return data
  },

  getById: async (id) => {
    const cacheKey = `team_member_${id}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await authenticatedFetch(`/team/${id}/`)
    const data = await handleResponse(response)

    setCachedData(cacheKey, data)
    return data
  },
}

// Site API
export const siteAPI = {
  getSettings: async () => {
    const cacheKey = "site_settings"
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await fetch(`${API_BASE_URL}/site/settings/`)
    const data = await handleResponse(response)

    setCachedData(cacheKey, data)
    return data
  },

  getCategories: async () => {
    const cacheKey = "event_categories"
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await fetch(`${API_BASE_URL}/categories/`)
    const data = await handleResponse(response)

    setCachedData(cacheKey, data)
    return data
  },

  getInvitationTemplates: async () => {
    const cacheKey = "invitation_templates"
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await authenticatedFetch("/invitation-templates/")
    const data = await handleResponse(response)

    setCachedData(cacheKey, data)
    return data
  },
}

// Blog API
export const blogAPI = {
  getAll: async () => {
    const cacheKey = "blog_posts"
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await fetch(`${API_BASE_URL}/blog/`)
    const data = await handleResponse(response)

    setCachedData(cacheKey, data)
    return data
  },

  getById: async (id) => {
    const cacheKey = `blog_post_${id}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await fetch(`${API_BASE_URL}/blog/${id}/`)
    const data = await handleResponse(response)

    setCachedData(cacheKey, data)
    return data
  },

  getBySlug: async (slug) => {
    const cacheKey = `blog_post_slug_${slug}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await fetch(`${API_BASE_URL}/blog/slug/${slug}/`)
    const data = await handleResponse(response)

    setCachedData(cacheKey, data)
    return data
  },
}

// Guest API
export const guestAPI = {
  getByEvent: async (eventId) => {
    const cacheKey = `guests_event_${eventId}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await authenticatedFetch(`/events/${eventId}/guests/`)
    const data = await handleResponse(response)

    setCachedData(cacheKey, data)
    return data
  },

  create: async (eventId, guestData) => {
    const response = await authenticatedFetch(`/events/${eventId}/guests/`, {
      method: "POST",
      body: JSON.stringify(guestData),
    })

    const data = await handleResponse(response)

    // Clear cache
    cache.delete(`guests_event_${eventId}`)

    return data
  },

  update: async (eventId, guestId, guestData) => {
    const response = await authenticatedFetch(`/events/${eventId}/guests/${guestId}/`, {
      method: "PUT",
      body: JSON.stringify(guestData),
    })

    const data = await handleResponse(response)

    // Clear cache
    cache.delete(`guests_event_${eventId}`)

    return data
  },

  delete: async (eventId, guestId) => {
    const response = await authenticatedFetch(`/events/${eventId}/guests/${guestId}/`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Failed to delete guest: ${response.status}`)
    }

    // Clear cache
    cache.delete(`guests_event_${eventId}`)

    return true
  },
}

// Export the authenticatedFetch function for use in other parts of the app
export { authenticatedFetch }

// Default export for backward compatibility
export default api
