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
const transformEventToBackend = (eventData) => {
  const transformed = {
    title: eventData.title,
    description: eventData.description || "",
    date: eventData.date,
    start_time: eventData.startTime,
    end_time: eventData.endTime,
    venue_name: eventData.venueName || eventData.venue_name || "",
    google_map_embed_link: eventData.googleMapLink || eventData.google_map_embed_link || "",
    youtube_embed_link: eventData.youtubeLink || eventData.youtube_embed_link || "",
    video_message_embed_link: eventData.videoMessageLink || eventData.video_message_embed_link || "",
    category: eventData.category || "wedding",
    original_category: eventData.original_category || null, // Preserve original category
    package_plan: eventData.packagePlan || null,
    invitation_template: eventData.invitationTemplate || null,
    team_members: eventData.teamMembers || eventData.team_members || [],
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
  // Ensure team_members are properly structured to match API documentation
  const teamMembers = (backendData.team_members || []).map(member => ({
    id: member.id || member.user_id,
    email: member.email,
    first_name: member.first_name || '',
    last_name: member.last_name || '',
    bio: member.bio || '',
    profile_picture: member.profile_picture || null,
    is_vendor: member.is_vendor || false,
    is_partner: member.is_partner || false,
    phone_number: member.phone_number || null,
    // Keep legacy fields for compatibility
    user_id: member.user_id || member.id,
    role: member.role || 'member',
    added_at: member.added_at,
    added_by: member.added_by
  }));

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
    googleMapLink: backendData.google_map_embed_link,
    youtubeLink: backendData.youtube_embed_link,
    videoMessageLink: backendData.video_message_embed_link,
    category: backendData.category,
    original_category: backendData.original_category, // Preserve original category from backend
    eventType: backendData.original_category || backendData.category, // Add eventType field for display
    event_banner: backendData.event_banner, // Add event banner field
    image: backendData.event_banner, // Compatibility field
    packagePlan: backendData.package_plan,
    invitationTemplate: backendData.invitation_template,
    teamMembers: teamMembers, // Use normalized team members
    team_members: teamMembers, // Add both formats for compatibility
    hosts: backendData.host || [],
    agenda: backendData.agenda || [],
    sponsors: backendData.event_sponsors || [],
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

  // Renamed from getAll to getEvents
  getEvents: async () => {
    const cacheKey = "events_all"
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const response = await authenticatedFetch("/events/")
    const data = await handleResponse(response)
    const transformedData = data.map(transformEventFromBackend)

    // Get current user to filter events for non-vendors
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
    const currentUserId = currentUser.id
    const isVendor = currentUser.is_vendor

    // If not a vendor, filter to only show events where user is a team member
    let filteredData = transformedData
    if (!isVendor && currentUserId) {
      filteredData = transformedData.filter(event => {
        // Check if user is in team members array
        const isTeamMember = (event.team_members || []).some(member => 
          member.id === currentUserId || member.user_id === currentUserId
        )
        return isTeamMember
      })
      console.log(`📊 Filtered ${filteredData.length} events out of ${transformedData.length} total events for team member ${currentUserId}`)
    }

    setCachedData(cacheKey, filteredData)
    return filteredData
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
      method: "PATCH",
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

  // Search events by query
  searchEvents: async (query) => {
    console.log('🔍 API: searchEvents called with query:', query);
    
    if (!query || query.trim().length < 2) {
      console.log('⚠️ API: Query too short, returning all events');
      // Return all events if query is too short
      return eventAPI.getEvents()
    }
    
    try {
      const searchUrl = `/events/?search=${encodeURIComponent(query.trim())}`;
      console.log('🌐 API: Making request to:', searchUrl);
      
      // First, let's see what events exist without search
      console.log('🔍 API: Checking all events first...');
      const allEvents = await eventAPI.getEvents();
      console.log('📊 API: Total events in system:', allEvents.length);
      console.log('📊 API: Event titles:', allEvents.map(e => e.title));
      
      const response = await authenticatedFetch(searchUrl);
      console.log('📡 API: Response status:', response.status);
      
      const data = await handleResponse(response);
      console.log('📦 API: Raw response data:', data);
      console.log('📦 API: Data type:', typeof data, 'Array?', Array.isArray(data));
      
      // Transform the data using the same transformation as getEvents
      const transformedData = Array.isArray(data) ? data : (data.results || []);
      console.log('🔄 API: Data to transform:', transformedData.length, 'items');
      
      const finalResults = transformedData.map(transformEventFromBackend);
      console.log('✅ API: Final search results:', finalResults.length, 'events');
      console.log('📋 API: Results summary:', finalResults.map(e => ({ id: e.id, title: e.title })));
      
      // Compare search results with all events
      if (finalResults.length === 0 && allEvents.length > 0) {
        console.log('⚠️ API: Search returned no results but events exist. This might be a backend search issue.');
        console.log('💡 API: Try searching for one of these titles:', allEvents.slice(0, 3).map(e => e.title));
      }
      
      return finalResults;
    } catch (error) {
      console.error('❌ API: Event search failed:', error);
      console.error('❌ API: Error details:', error.message, error.stack);
      throw error;
    }
  },

  

  // Team Management for Events - Updated to work with event object updates
  addTeamMember: async (eventId, memberData) => {
    console.log('🚀 Adding team member to event:', { eventId, memberData });
    
    try {
      // Step 1: Fetch the current event data
      console.log('📥 Fetching current event data...');
      const currentEvent = await eventAPI.getEvent(eventId);
      console.log('📋 Current event team_members:', currentEvent.team_members);
      
      // Step 2: Prepare the new team member object with the correct API structure
      const newTeamMember = {
        id: memberData.id,
        email: memberData.email,
        first_name: memberData.first_name,
        last_name: memberData.last_name,
        bio: memberData.bio || "",
        profile_picture: memberData.profile_picture || null,
        is_vendor: memberData.is_vendor || false,
        is_partner: memberData.is_partner || false,
        phone_number: memberData.phone_number || null
      };
      
      console.log('👤 New team member object:', newTeamMember);
      
      // Step 3: Check if user is already a team member
      const existingTeamMembers = currentEvent.team_members || [];
      const isAlreadyMember = existingTeamMembers.some(member => member.id === memberData.id);
      
      if (isAlreadyMember) {
        throw new Error('User is already a team member');
      }
      
      // Step 4: Add new member to team members array
      const updatedTeamMembers = [...existingTeamMembers, newTeamMember];
      console.log('🔄 Updated team members array:', updatedTeamMembers);
      
      // Step 5: Prepare the event update data
     const updatedTeamMemberIds = updatedTeamMembers.map(member => member.id);

const eventUpdateData = {
  ...currentEvent,
  team_members: updatedTeamMemberIds
};
      
      console.log('📝 Sending event update with team_members:', { 
        eventId, 
        team_members: eventUpdateData.team_members,
        totalMembers: eventUpdateData.team_members.length 
      });
      
      // Step 6: Update the event using existing updateEvent method
      const updatedEvent = await eventAPI.updateEvent(eventId, eventUpdateData);
      
      // Clear all related caches to ensure fresh data
      cache.delete("events_all");
      cache.delete(`event_${eventId}`);
      console.log('🗑️ Cleared cache for events_all and event_' + eventId);
      
      console.log('✅ Event updated successfully!');
      console.log('📊 Updated event team_members count:', updatedEvent.team_members?.length || 0);
      console.log('👥 All team members in updated event:', updatedEvent.team_members);
      
      // Verify the new member is in the response
      console.log('🔍 Searching for new member with ID:', memberData.id, 'type:', typeof memberData.id);
      console.log('🔍 All member IDs in response:', updatedEvent.team_members?.map(m => ({ id: m.id, type: typeof m.id, email: m.email })));
      
      const newMemberInResponse = updatedEvent.team_members?.find(member => {
        const memberIdMatch = member.id === memberData.id || member.id == memberData.id;
        const emailMatch = member.email === memberData.email;
        console.log(`🔍 Checking member ${member.id} (${member.email}): ID match: ${memberIdMatch}, Email match: ${emailMatch}`);
        return memberIdMatch || emailMatch;
      });
      
      if (newMemberInResponse) {
        console.log('✅ New member found in response:', newMemberInResponse);
      } else {
        console.log('❌ New member NOT found in response!');
        console.log('🔍 Looking for member with ID:', memberData.id, 'and email:', memberData.email);
        console.log('🔍 Available members:');
        updatedEvent.team_members?.forEach((member, index) => {
          console.log(`  ${index}: ID=${member.id} (${typeof member.id}), Email=${member.email}`);
        });
        
        // Let's try to find by email as fallback
        const memberByEmail = updatedEvent.team_members?.find(m => m.email === memberData.email);
        if (memberByEmail) {
          console.log('✅ Found member by email:', memberByEmail);
          console.log('💡 The member was added but with a different ID than expected');
        }
      }
      
      // Return the actual member from the response or fallback to newTeamMember
      const memberToReturn = newMemberInResponse || updatedEvent.team_members?.find(m => m.email === memberData.email) || newTeamMember;
      console.log('🎉 Team member added successfully. Returning:', memberToReturn);
      
      // Force refresh the event to get the latest data
      console.log('🔄 Force refreshing event data to verify team member was added...');
      const refreshedEvent = await eventAPI.refreshEvent(eventId);
      console.log('📊 Refreshed event team_members count:', refreshedEvent.team_members?.length || 0);
      
      return memberToReturn;
      
    } catch (error) {
      console.error('❌ Failed to add team member:', error);
      throw new Error(`Failed to add team member: ${error.message}`);
    }
  },

  // Remove team member from event
  removeTeamMember: async (eventId, memberId) => {
    try {
      // For many-to-many, we typically delete by user ID, not the relationship ID
      const response = await authenticatedFetch(`/events/${eventId}/team-members/${memberId}/`, {
        method: "DELETE"
      })
      
      if (!response.ok) {
        throw new Error(`Failed to remove team member: ${response.status}`)
      }
      
      return { success: true, userId: memberId }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to remove team member"
      )
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

  // Search users for team collaboration
  searchUsers: async (query) => {
    console.log('🔍 API: searchUsers called with query:', query);
    
    if (!query || query.trim().length < 2) {
      console.log('⚠️ API: Query too short');
      return [];
    }
    
    try {
      // Try the main search endpoint first
      const searchUrl = `/site_setting/search/?email=${encodeURIComponent(query.trim())}`;
      console.log('🌐 API: Making user search request to:', searchUrl);
      
      const response = await authenticatedFetch(searchUrl);
      console.log('📡 API: User search response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Search failed with status ${response.status}`);
      }
      
      const data = await handleResponse(response);
      console.log('📦 API: User search raw data:', data);
      
      // Handle different response formats
      let users = [];
      if (Array.isArray(data)) {
        users = data;
      } else if (data.results && Array.isArray(data.results)) {
        users = data.results;
      } else if (data.data && Array.isArray(data.data)) {
        users = data.data;
      } else if (data && typeof data === 'object' && data.id) {
        // Single user object returned - wrap it in an array
        console.log('📝 API: Single user object detected, converting to array');
        users = [data];
      } else {
        console.log('⚠️ API: Unexpected data format:', typeof data, Object.keys(data));
        users = [];
      }
      
      console.log('✅ API: Found users:', users.length, 'users');
      if (users.length > 0) {
        console.log('📋 API: User details:', users.map(u => ({ 
          id: u.id, 
          email: u.email, 
          name: `${u.first_name || ''} ${u.last_name || ''}`.trim() 
        })));
      }
      
      return users;
    } catch (error) {
      console.error('❌ API: User search failed:', error);
      console.error('❌ API: Error details:', error.message);
      
      // Try a simpler endpoint as fallback
      try {
        console.log('🔄 API: Trying fallback endpoint...');
        const fallbackUrl = `/site_setting/?search=${encodeURIComponent(query.trim())}`;
        console.log('🌐 API: Fallback URL:', fallbackUrl);
        
        const response = await authenticatedFetch(fallbackUrl);
        const data = await handleResponse(response);
        
        console.log('📦 API: Fallback data:', data);
        const users = data.results || data.data || data || [];
        
        console.log('✅ API: Fallback found users:', users.length, 'users');
        return users;
      } catch (fallbackError) {
        console.error('❌ API: Fallback also failed:', fallbackError);
        return [];
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

  // Force refresh event data (bypass cache)
  refreshEvent: async (eventId) => {
    console.log('🔄 Force refreshing event data for:', eventId);
    // Clear cache first
    cache.delete(`event_${eventId}`);
    cache.delete("events_all");
    
    // Fetch fresh data
    const response = await authenticatedFetch(`/events/${eventId}/`)
    const data = await handleResponse(response)
    const transformedData = transformEventFromBackend(data)
    
    // Update cache with fresh data
    setCachedData(`event_${eventId}`, transformedData)
    
    console.log('✅ Event refreshed, team_members count:', transformedData.team_members?.length || 0);
    return transformedData
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
