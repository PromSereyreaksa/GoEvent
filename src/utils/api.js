const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

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
const transformEventToBackend = (eventData, isEdit = false) => {
  // Required fields for creation
  const transformed = {
    title: eventData.title,
    description: eventData.description || "",
    date: eventData.date,
    start_time: eventData.startTime,
    end_time: eventData.endTime,
    venue_name: eventData.venueName || eventData.venue_name || eventData.venue || "",
    category: eventData.category || "wedding",
  }

  // Additional fields only for editing
  if (isEdit) {
    Object.assign(transformed, {
      google_map_embed_link: eventData.googleMapLink || eventData.google_map_embed_link || "",
      youtube_embed_link: eventData.youtubeLink || eventData.youtube_embed_link || "",
      video_message_embed_link: eventData.videoMessageLink || eventData.video_message_embed_link || "",
      
      // New media and design fields (editing only)
      invitation_background_music: eventData.invitationBackgroundMusic || null,
      logo_kh: eventData.logoKh || null,
      logo_en: eventData.logoEn || null,
      loading_screen: eventData.loadingScreen || null,
      event_banner: eventData.eventBanner || eventData.event_banner || eventData.image || null,
      transition_video: eventData.transitionVideo || null,
      
      // Package and template selection (editing only)
      package_plan: eventData.packagePlan || null,
      invitation_template: eventData.invitationTemplate || null,
      
      // Team management (editing only)
      team_members: eventData.teamMembers || eventData.team_members || [],
    })

    // Transform host data (editing only)
    if (eventData.hosts && eventData.hosts.length > 0) {
      transformed.hosts = eventData.hosts.map((host) => ({
        host_names: host.names || [{
          language: 'en',
          host_name: host.name || '',
          parent_a_name: host.parentNames?.[0] || '',
          parent_b_name: host.parentNames?.[1] || ''
        }]
      }))
    }

    // Transform agenda data (editing only)
    if (eventData.agenda && eventData.agenda.length > 0) {
      transformed.agenda = eventData.agenda.map((day) => ({
        date: day.date,
        agenda_details: day.activities?.filter(activity => activity.time && activity.activity).map((activity, index) => ({
          language: 'en',
          agenda_detail: activity.activity,
          time_text: activity.time,
          order: index + 1
        })) || []
      }))
    }

    // Transform sponsors data (editing only)
    if (eventData.sponsors && eventData.sponsors.length > 0) {
      transformed.sponsors = eventData.sponsors.map((sponsor) => ({
        name: sponsor.name || "",
        logo: sponsor.logo || null,
      }))
    }
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
    venue: backendData.venue_name, // Add compatibility field
    venueName: backendData.venue_name,
    venue_name: backendData.venue_name, // Keep original format
    category: backendData.category,
    
    // Media and links
    googleMapLink: backendData.google_map_embed_link,
    youtubeLink: backendData.youtube_embed_link,
    videoMessageLink: backendData.video_message_embed_link,
    
    // New media and design fields
    invitationBackgroundMusic: backendData.invitation_background_music,
    logoKh: backendData.logo_kh,
    logoEn: backendData.logo_en,
    loadingScreen: backendData.loading_screen,
    eventBanner: backendData.event_banner,
    event_banner: backendData.event_banner, // Keep original format
    image: backendData.event_banner, // Compatibility field
    transitionVideo: backendData.transition_video,
    
    // Package and template
    packagePlan: backendData.package_plan,
    invitationTemplate: backendData.invitation_template,
    
    // Team management
    admin: backendData.admin,
    teamMembers: backendData.team_members || [],
    team_members: backendData.team_members || [], // Add both formats for compatibility
    
    // Event content
    hosts: backendData.hosts || [],
    agenda: backendData.agenda || [],
    sponsors: backendData.sponsors || [],
    
    // Metadata
    createdAt: backendData.created_at,
    updatedAt: backendData.updated_at,
    is_published: backendData.is_published || false,
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

// Clear cache on page load for development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  cache.clear()
  console.log('🧹 Cache cleared for development (updated for backend team_members support)')
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
    const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
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
  // Get event types from backend API
  getEventTypes: async () => {
    const cacheKey = "category"
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    try {
      const response = await fetch(`${API_BASE_URL}/events/`)
      const data = await handleResponse(response)
      
      setCachedData(cacheKey, data)
      return data
    } catch (error) {
      console.warn('Failed to fetch event types from API, using fallback data:', error)
      // Fallback to static data if API fails
      const fallbackData = [
        { value: 'wedding', label: 'Wedding' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'housewarming', label: 'Housewarming' },
  { value: 'Conferences', label: 'Conferences' },
  { value: 'concert', label: 'Concert' },
  { value: 'seminars', label: 'Seminars' },
  { value: 'retreat', label: 'Retreat' },
  { value: 'other', label: 'Other' }
      ]
      setCachedData(cacheKey, fallbackData)
      return fallbackData
    }
  },

  // Get all events - now includes team_members from backend
  getEvents: async () => {
    console.log('🌐 API: Starting getEvents...')
    const cacheKey = "events_all"
    const cached = getCachedData(cacheKey)
    if (cached) {
      console.log('💾 API: Returning cached events:', cached.length)
      return cached
    }

    try {
      console.log('🌐 API: Fetching events with team member data...')
      const response = await authenticatedFetch("/events/")
      const data = await handleResponse(response)
      console.log('✅ API: Events fetched:', data.length, 'events')
      
      const transformedData = data.map((event, index) => {
        const transformed = transformEventFromBackend(event)
        console.log(`📋 API: Event ${index + 1} - "${transformed.title}":`, {
          id: transformed.id,
          admin: transformed.admin,
          team_members: transformed.team_members || transformed.teamMembers || []
        })
        return transformed
      })

      setCachedData(cacheKey, transformedData)
      console.log('✅ API: All events transformed and cached')
      return transformedData
    } catch (error) {
      console.error("❌ API: Error fetching events:", error)
      
      // Check if it's a server error related to team_members field
      if (error.message.includes('team_members') || error.message.includes('500')) {
        console.warn("⚠️ API: Backend serializer issue detected. Falling back to light events...")
        try {
          // Fallback to light events if there's a serializer issue
          const fallbackResponse = await authenticatedFetch("/events/?fields=id,title,date,venue_name,category,is_publish")
          const fallbackData = await handleResponse(fallbackResponse)
          console.log('✅ API: Fallback events fetched:', fallbackData.length, 'events')
          
          const fallbackTransformed = fallbackData.map(transformEventFromBackend)
          setCachedData(cacheKey, fallbackTransformed)
          return fallbackTransformed
        } catch (fallbackError) {
          console.error("❌ API: Fallback also failed:", fallbackError)
          throw new Error("Both main and fallback event fetching failed")
        }
      }
      
      throw error
    }
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
    const transformedData = transformEventToBackend(eventData, false) // false = creation mode

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
    const transformedData = transformEventToBackend(eventData, true) // true = edit mode
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

  // Get events with minimal data for list view (optimized)
  getEventsLight: async () => {
    const cacheKey = "events_light"
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await authenticatedFetch("/events/?fields=id,title,date,start_time,venue_name,category,guest_count,created_by,is_published")
    const data = await handleResponse(response)
    
    // Transform only the necessary fields for list view
    const transformedData = data.map(backendData => ({
      id: backendData.id,
      title: backendData.title,
      date: backendData.date,
      startTime: backendData.start_time,
      venueName: backendData.venue_name,
      category: backendData.category,
      guest_count: backendData.guest_count || 0,
      createdBy: backendData.created_by,
      is_published: backendData.is_published || false,
    }))

    setCachedData(cacheKey, transformedData)
    return transformedData
  },

  // Team Management for Events - Direct API approach
  addTeamMember: async (eventId, memberData) => {
    console.log('Adding team member to event:', { eventId, memberData });
    
    try {
      // Use dedicated team member endpoint first
      const response = await authenticatedFetch(`/events/${eventId}/team-members/`, {
        method: "POST",
        body: JSON.stringify({
          user_id: memberData.id,
          role: memberData.role || 'member',
          permissions: memberData.permissions || ['view']
        })
      });
      
      if (response.ok) {
        const data = await handleResponse(response);
        console.log('Team member added via dedicated endpoint:', data);
        return data;
      }
    } catch (error) {
      console.warn('Dedicated endpoint failed, trying alternative approach:', error);
    }
    
    try {
      // Fallback: Add team member via site_setting endpoint
      const response = await authenticatedFetch(`/site_setting/team-members/`, {
        method: "POST",
        body: JSON.stringify({
          user_id: memberData.id,
          event_id: eventId,
          first_name: memberData.first_name,
          last_name: memberData.last_name,
          email: memberData.email,
          role: memberData.role || 'member',
          added_at: new Date().toISOString()
        })
      });
      
      const data = await handleResponse(response);
      console.log('Team member added via site_setting endpoint:', data);
      
      // Clear cache to force refresh
      cache.delete("events_all");
      cache.delete(`event_${eventId}`);
      
      return data;
    } catch (error) {
      console.error('All team member endpoints failed:', error);
      throw new Error(`Failed to add team member: ${error.message}`);
    }
  },

  // Remove team member from event
  removeTeamMember: async (eventId, memberId) => {
    try {
      // Try dedicated event team member endpoint first
      const response = await authenticatedFetch(`/events/${eventId}/team-members/${memberId}/`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        // Clear cache to force refresh
        cache.delete("events_all");
        cache.delete(`event_${eventId}`);
        return { success: true, userId: memberId };
      }
    } catch (error) {
      console.warn('Dedicated endpoint failed, trying alternative approach:', error);
    }
    
    try {
      // Fallback: Remove via site_setting endpoint
      const response = await authenticatedFetch(`/site_setting/team-members/${memberId}/`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        throw new Error(`Failed to remove team member: ${response.status}`);
      }
      
      // Clear cache to force refresh
      cache.delete("events_all");
      cache.delete(`event_${eventId}`);
      
      return { success: true, userId: memberId };
    } catch (error) {
      throw new Error(`Failed to remove team member: ${error.message}`);
    }
  },

  // Get team members for an event - Updated to handle different endpoint structures
  getTeamMembers: async (eventId) => {
    try {
      // First try the event-specific endpoint
      const response = await authenticatedFetch(`/events/${eventId}/team-members/`)
      const data = await handleResponse(response)
      return data
    } catch (error) {
      console.error('Event-specific team members endpoint failed:', error)
      // Fallback: get general team members and filter by event
      try {
        const response = await authenticatedFetch(`/site_setting/team-members/`)
        const data = await handleResponse(response)
        // Filter by eventId if the data structure supports it
        return data.filter(member => member.event_id === eventId) || []
      } catch (fallbackError) {
        console.error('Fallback team members endpoint failed:', fallbackError)
        throw new Error("Failed to fetch team members")
      }
    }
  },

  // Alternative method to work with site_setting team members
  addTeamMemberToSite: async (memberData) => {
    try {
      const response = await authenticatedFetch(`/site_setting/team-members/`, {
        method: "POST",
        body: JSON.stringify(memberData)
      })
      return await handleResponse(response)
    } catch (error) {
      throw new Error("Failed to add team member to site")
    }
  },

  // Search users by email for team collaboration
  searchUsers: async (query) => {
    try {
      // Use the specific search endpoint with query parameter
      const response = await authenticatedFetch(`/site_setting/search/?q=${encodeURIComponent(query)}`);
      const data = await handleResponse(response);
      
      // Handle different response formats
      if (Array.isArray(data)) {
        return data;
      } else if (data && typeof data === 'object') {
        // Single user response
        return [data];
      } else {
        return [];
      }
    } catch (error) {
      console.log('User search failed:', error);
      
      // Try alternative endpoint with email parameter
      try {
        const response = await authenticatedFetch(`/site_setting/search/?email=${encodeURIComponent(query)}`);
        const data = await handleResponse(response);
        return Array.isArray(data) ? data : [data];
      } catch (fallbackError) {
        console.log('Fallback search also failed:', fallbackError);
        // If user not found or other error, return empty array
        if (error.message.includes('User with this email does not exist') || 
            error.message.includes('not found')) {
          return [];
        }
        throw error;
      }
    }
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
  getPlans: async () => {
    const cacheKey = "pricing_plans"
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await fetch(`${API_BASE_URL}/site_setting/pricing-plans/`)
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
  getMembers: async () => {
    const cacheKey = "team_members"
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await fetch(`${API_BASE_URL}/site_setting/team-members/`)
    const data = await handleResponse(response)

    setCachedData(cacheKey, data)
    return data
  },

  getById: async (id) => {
    const cacheKey = `team_member_${id}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await fetch(`${API_BASE_URL}/site_setting/team-members/${id}/`)
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
