import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { eventAPI } from "../../utils/api"
import { mockEvents } from "../../data/mockCollaborationData"

// Helper function to get team members - always use team_members field
const getTeamMembers = (event) => {
  return event.team_members || []
}

const setTeamMembers = (event, members) => {
  // Always use team_members field for consistency with backend
  event.team_members = members
}

// Async thunks for event operations
export const fetchEvents = createAsyncThunk("events/fetchEvents", async (_, { rejectWithValue }) => {
  try {
    console.log('🔄 Redux: Fetching events with team member data...')
    const events = await eventAPI.getEvents()
    console.log('✅ Redux: Events fetched successfully:', events.length, 'events')
    console.log('📋 Redux: Events with team members:', events.map(e => ({ 
      id: e.id, 
      title: e.title, 
      admin: e.admin?.email || e.admin?.id, 
      team_members_count: (e.team_members || []).length,
      team_members: (e.team_members || []).map(tm => tm.email || tm.id)
    })))
    return events
  } catch (error) {
    console.error('❌ Redux: Error fetching events:', error)
    
    // If it's a backend serializer error, provide helpful message
    if (error.message.includes('team_members') || error.message.includes('AssertionError')) {
      console.error('🔧 Redux: Backend serializer error detected - check team_members field definition')
      return rejectWithValue('Backend configuration error: Please check team_members field in EventsSerializer')
    }
    
    return rejectWithValue(error.message)
  }
})

export const fetchEventsLight = createAsyncThunk("events/fetchEventsLight", async (_, { rejectWithValue }) => {
  try {
    console.log('🔄 Redux: Fetching events light...')
    const events = await eventAPI.getEventsLight()
    console.log('✅ Redux: Events light fetched successfully:', events.length, 'events')
    return events
  } catch (error) {
    console.error('❌ Redux: Error fetching events light:', error)
    return rejectWithValue(error.message)
  }
})

export const fetchEventById = createAsyncThunk("events/fetchEventById", async (id, { rejectWithValue }) => {
  try {
    console.log('🔄 Redux: Fetching event by ID:', id)
    const event = await eventAPI.getEvent(id)
    console.log('✅ Redux: Event fetched successfully:', event.id, event.title)
    console.log('👥 Redux: Event team members:', (event.team_members || []).length)
    return event
  } catch (error) {
    console.error('❌ Redux: Error fetching event by ID:', error)
    return rejectWithValue(error.message)
  }
})

export const createEvent = createAsyncThunk("events/createEvent", async (eventData, { rejectWithValue }) => {
  try {
    console.log('🔄 Redux: Creating event with data:', eventData)
    const newEvent = await eventAPI.createEvent(eventData)
    console.log('✅ Redux: Event created successfully:', newEvent.id, newEvent.title)
    return newEvent
  } catch (error) {
    console.error('❌ Redux: Error creating event:', error)
    return rejectWithValue(error.message)
  }
})

export const updateEvent = createAsyncThunk("events/updateEvent", async ({ id, eventData }, { rejectWithValue }) => {
  try {
    console.log('🔄 Redux: Updating event:', id, 'with data:', eventData)
    const updatedEvent = await eventAPI.updateEvent(id, eventData)
    console.log('✅ Redux: Event updated successfully:', updatedEvent.id, updatedEvent.title)
    return updatedEvent
  } catch (error) {
    console.error('❌ Redux: Error updating event:', error)
    return rejectWithValue(error.message)
  }
})

export const deleteEvent = createAsyncThunk("events/deleteEvent", async (id, { rejectWithValue }) => {
  try {
    console.log('🔄 Redux: Deleting event:', id)
    await eventAPI.deleteEvent(id)
    console.log('✅ Redux: Event deleted successfully:', id)
    return id
  } catch (error) {
    console.error('❌ Redux: Error deleting event:', error)
    return rejectWithValue(error.message)
  }
})

// Team management async thunks
export const addTeamMember = createAsyncThunk(
  "events/addTeamMember",
  async ({ eventId, memberData }, { rejectWithValue }) => {
    try {
      console.log('🔄 Redux: Adding team member to event:', eventId, 'with data:', memberData)
      
      const result = await eventAPI.addTeamMember(eventId, memberData)
      console.log('✅ Redux: Add team member API result:', result)
      
      // Always fetch the complete updated event from backend to ensure consistency
      const updatedEvent = await eventAPI.getEvent(eventId)
      console.log('🔄 Redux: Fetched updated event from backend:', {
        id: updatedEvent.id,
        title: updatedEvent.title,
        team_members_count: (updatedEvent.team_members || []).length
      })
      
      return { 
        eventId, 
        member: result, 
        updatedEvent: updatedEvent
      }
    } catch (error) {
      console.error('❌ Redux: Add team member failed:', error)
      console.error('❌ Redux: Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const removeTeamMember = createAsyncThunk(
  "events/removeTeamMember", 
  async ({ eventId, memberId }, { rejectWithValue }) => {
    try {
      console.log('🔄 Redux: Removing team member:', memberId, 'from event:', eventId)
      await eventAPI.removeTeamMember(eventId, memberId)
      console.log('✅ Redux: Team member removed successfully')
      
      // Always fetch the complete updated event from backend to ensure consistency
      const updatedEvent = await eventAPI.getEvent(eventId)
      console.log('🔄 Redux: Fetched updated event after removal:', {
        id: updatedEvent.id,
        title: updatedEvent.title,
        team_members_count: (updatedEvent.team_members || []).length
      })
      
      return { eventId, memberId, updatedEvent }
    } catch (error) {
      console.error('❌ Redux: Remove team member failed:', error)
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// Bulk add team members - more efficient for adding multiple users
export const addTeamMembers = createAsyncThunk(
  "events/addTeamMembers",
  async ({ eventId, memberDataList }, { rejectWithValue }) => {
    try {
      console.log('🔄 Redux: Adding multiple team members to event:', eventId, 'count:', memberDataList.length)
      
      // If your backend supports bulk add, use it. Otherwise, add one by one
      const results = []
      for (const memberData of memberDataList) {
        const result = await eventAPI.addTeamMember(eventId, memberData)
        results.push(result)
      }
      
      // Fetch updated event once after all additions
      const updatedEvent = await eventAPI.getEvent(eventId)
      console.log('✅ Redux: Bulk add completed, updated event:', {
        id: updatedEvent.id,
        team_members_count: (updatedEvent.team_members || []).length
      })
      
      return { eventId, results, updatedEvent }
    } catch (error) {
      console.error('❌ Redux: Bulk add team members failed:', error)
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const searchUsers = createAsyncThunk(
  "events/searchUsers",
  async (query, { rejectWithValue }) => {
    try {
      console.log('🔍 Redux: Searching users with query:', query)
      const users = await eventAPI.searchUsers(query)
      console.log('✅ Redux: User search results:', users.length, 'users')
      return users
    } catch (error) {
      console.error('❌ Redux: User search failed:', error)
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const searchEvents = createAsyncThunk(
  "events/searchEvents",
  async (query, { rejectWithValue }) => {
    try {
      console.log('🔍 Redux: Searching events with query:', query)
      const events = await eventAPI.searchEvents(query)
      console.log('✅ Redux: Event search results received:', events.length, 'events')
      return events
    } catch (error) {
      console.error('❌ Redux: Event search failed:', error)
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: mockEvents, // Start with mock data for demonstration
    currentEvent: null,
    loading: false,
    error: null,
    searchResults: [], // For user search results
    teamMemberLoading: false,
    shouldRefreshEvents: false, // Flag to trigger events refresh
    filters: {
      category: null,
      search: "",
      dateRange: null,
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null
    },
    clearSearchResults: (state) => {
      state.searchResults = []
    },
    clearRefreshFlag: (state) => {
      state.shouldRefreshEvents = false
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        category: null,
        search: "",
        dateRange: null,
      }
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    // Local state updates for optimistic UI
    addEventLocally: (state, action) => {
      console.log('🔄 Redux: Adding event locally:', action.payload)
      state.events.unshift(action.payload)
    },
    updateEventLocally: (state, action) => {
      console.log('🔄 Redux: Updating event locally:', action.payload.id)
      const index = state.events.findIndex((event) => event.id === action.payload.id)
      if (index !== -1) {
        state.events[index] = { ...state.events[index], ...action.payload }
        console.log('✅ Redux: Event updated locally at index:', index)
      } else {
        console.warn('⚠️ Redux: Event not found for local update:', action.payload.id)
      }
    },
    removeEventLocally: (state, action) => {
      console.log('🔄 Redux: Removing event locally:', action.payload)
      const initialLength = state.events.length
      state.events = state.events.filter((event) => event.id !== action.payload)
      console.log('✅ Redux: Event removed locally, events count:', initialLength, '->', state.events.length)
    },
    // Optimistic team member updates
    addTeamMemberOptimistic: (state, action) => {
      const { eventId, member } = action.payload
      console.log('🔄 Redux: Optimistic add team member:', eventId, member)
      
      // Update in events array
      const eventIndex = state.events.findIndex(e => e.id === eventId)
      if (eventIndex !== -1) {
        const currentMembers = getTeamMembers(state.events[eventIndex])
        const memberExists = currentMembers.some(m => m.id === member.id)
        if (!memberExists) {
          setTeamMembers(state.events[eventIndex], [...currentMembers, member])
        }
      }
      
      // Update current event
      if (state.currentEvent?.id === eventId) {
        const currentMembers = getTeamMembers(state.currentEvent)
        const memberExists = currentMembers.some(m => m.id === member.id)
        if (!memberExists) {
          setTeamMembers(state.currentEvent, [...currentMembers, member])
        }
      }
    },
    removeTeamMemberOptimistic: (state, action) => {
      const { eventId, memberId } = action.payload
      console.log('🔄 Redux: Optimistic remove team member:', eventId, memberId)
      
      // Update in events array
      const eventIndex = state.events.findIndex(e => e.id === eventId)
      if (eventIndex !== -1) {
        const currentMembers = getTeamMembers(state.events[eventIndex])
        setTeamMembers(state.events[eventIndex], currentMembers.filter(m => m.id !== memberId))
      }
      
      // Update current event
      if (state.currentEvent?.id === eventId) {
        const currentMembers = getTeamMembers(state.currentEvent)
        setTeamMembers(state.currentEvent, currentMembers.filter(m => m.id !== memberId))
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all events
      .addCase(fetchEvents.pending, (state) => {
        console.log('⏳ Redux: Fetch events pending...')
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        console.log('✅ Redux: Fetch events fulfilled with:', action.payload.length, 'events')
        state.loading = false
        state.events = action.payload
        state.pagination.total = action.payload.length
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        console.log('❌ Redux: Fetch events rejected:', action.payload)
        state.loading = false
        state.error = action.payload
      })
      // Fetch light events (optimized)
      .addCase(fetchEventsLight.pending, (state) => {
        console.log('⏳ Redux: Fetch events light pending...')
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventsLight.fulfilled, (state, action) => {
        console.log('✅ Redux: Fetch events light fulfilled with:', action.payload.length, 'events')
        state.loading = false
        state.events = action.payload
        state.pagination.total = action.payload.length
      })
      .addCase(fetchEventsLight.rejected, (state, action) => {
        console.log('❌ Redux: Fetch events light rejected:', action.payload)
        state.loading = false
        state.error = action.payload
      })
      // Fetch event by ID
      .addCase(fetchEventById.pending, (state) => {
        console.log('⏳ Redux: Fetch event by ID pending...')
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        console.log('✅ Redux: Fetch event by ID fulfilled:', action.payload.id)
        state.loading = false
        state.currentEvent = action.payload
        
        // Also update the event in the events array if it exists
        const eventIndex = state.events.findIndex(e => e.id === action.payload.id)
        if (eventIndex !== -1) {
          state.events[eventIndex] = action.payload
        }
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        console.log('❌ Redux: Fetch event by ID rejected:', action.payload)
        state.loading = false
        state.error = action.payload
      })
      // Create event
      .addCase(createEvent.pending, (state) => {
        console.log('⏳ Redux: Create event pending...')
        state.loading = true
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        console.log('✅ Redux: Create event fulfilled:', action.payload.id)
        state.loading = false
        state.events.unshift(action.payload)
        state.currentEvent = action.payload
      })
      .addCase(createEvent.rejected, (state, action) => {
        console.log('❌ Redux: Create event rejected:', action.payload)
        state.loading = false
        state.error = action.payload
      })
      // Update event
      .addCase(updateEvent.pending, (state) => {
        console.log('⏳ Redux: Update event pending...')
        state.loading = true
        state.error = null
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        console.log('✅ Redux: Update event fulfilled:', action.payload.id)
        state.loading = false
        const index = state.events.findIndex((event) => event.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = action.payload
        }
        state.currentEvent = action.payload
      })
      .addCase(updateEvent.rejected, (state, action) => {
        console.log('❌ Redux: Update event rejected:', action.payload)
        state.loading = false
        state.error = action.payload
      })
      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        console.log('⏳ Redux: Delete event pending...')
        state.loading = true
        state.error = null
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        console.log('✅ Redux: Delete event fulfilled:', action.payload)
        state.loading = false
        state.events = state.events.filter((event) => event.id !== action.payload)
        if (state.currentEvent && state.currentEvent.id === action.payload) {
          state.currentEvent = null
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        console.log('❌ Redux: Delete event rejected:', action.payload)
        state.loading = false
        state.error = action.payload
      })
      // Add team member
      .addCase(addTeamMember.pending, (state) => {
        console.log('⏳ Redux: Add team member pending...')
        state.teamMemberLoading = true
        state.error = null
      })
      .addCase(addTeamMember.fulfilled, (state, action) => {
        console.log('✅ Redux: Add team member fulfilled')
        state.teamMemberLoading = false
        const { eventId, updatedEvent } = action.payload
        
        console.log('🔄 Redux: Processing addTeamMember.fulfilled with backend data')
        console.log('🎯 Redux: Event ID:', eventId)
        console.log('👥 Redux: Team members from backend:', getTeamMembers(updatedEvent).length)
        
        // Update the event in the events array with the fresh data from backend
        const eventIndex = state.events.findIndex(e => e.id == eventId)
        if (eventIndex !== -1) {
          console.log('🔄 Redux: Replacing event at index:', eventIndex, 'with backend data')
          state.events[eventIndex] = updatedEvent
        } else {
          console.log('➕ Redux: Event not found in array, adding it')
          state.events.push(updatedEvent)
        }
        
        // Update currentEvent if it matches
        if (state.currentEvent && state.currentEvent.id == eventId) {
          console.log('🔄 Redux: Updating current event with backend data')
          state.currentEvent = updatedEvent
        }
        
        // Clear the refresh flag since we just updated with fresh data
        state.shouldRefreshEvents = false
      })
      .addCase(addTeamMember.rejected, (state, action) => {
        console.log('❌ Redux: Add team member rejected:', action.payload)
        state.teamMemberLoading = false
        state.error = action.payload
      })
      // Bulk add team members
      .addCase(addTeamMembers.pending, (state) => {
        console.log('⏳ Redux: Bulk add team members pending...')
        state.teamMemberLoading = true
        state.error = null
      })
      .addCase(addTeamMembers.fulfilled, (state, action) => {
        console.log('✅ Redux: Bulk add team members fulfilled')
        state.teamMemberLoading = false
        const { eventId, updatedEvent } = action.payload
        
        // Update the event in the events array with the fresh data from backend
        const eventIndex = state.events.findIndex(e => e.id == eventId)
        if (eventIndex !== -1) {
          state.events[eventIndex] = updatedEvent
        } else {
          state.events.push(updatedEvent)
        }
        
        // Update currentEvent if it matches
        if (state.currentEvent && state.currentEvent.id == eventId) {
          state.currentEvent = updatedEvent
        }
        
        state.shouldRefreshEvents = false
      })
      .addCase(addTeamMembers.rejected, (state, action) => {
        console.log('❌ Redux: Bulk add team members rejected:', action.payload)
        state.teamMemberLoading = false
        state.error = action.payload
      })
      // Remove team member
      .addCase(removeTeamMember.pending, (state) => {
        console.log('⏳ Redux: Remove team member pending...')
        state.teamMemberLoading = true
        state.error = null
      })
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        console.log('✅ Redux: Remove team member fulfilled')
        state.teamMemberLoading = false
        const { eventId, updatedEvent } = action.payload
        
        console.log('🔄 Redux: Processing removeTeamMember.fulfilled with backend data')
        console.log('🎯 Redux: Event ID:', eventId)
        console.log('👥 Redux: Team members after removal:', getTeamMembers(updatedEvent).length)
        
        // Update the event in the events array with fresh data from backend
        const eventIndex = state.events.findIndex(e => e.id == eventId)
        if (eventIndex !== -1) {
          console.log('🔄 Redux: Replacing event at index:', eventIndex, 'with backend data')
          state.events[eventIndex] = updatedEvent
        }
        
        // Update currentEvent if it matches
        if (state.currentEvent?.id == eventId) {
          console.log('🔄 Redux: Updating current event with backend data')
          state.currentEvent = updatedEvent
        }
      })
      .addCase(removeTeamMember.rejected, (state, action) => {
        console.log('❌ Redux: Remove team member rejected:', action.payload)
        state.teamMemberLoading = false
        state.error = action.payload
      })
      // Search users
      .addCase(searchUsers.pending, (state) => {
        console.log('⏳ Redux: Search users pending...')
        state.loading = true
        state.error = null
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        console.log('✅ Redux: Search users fulfilled with:', action.payload.length, 'users')
        state.loading = false
        state.searchResults = action.payload
      })
      .addCase(searchUsers.rejected, (state, action) => {
        console.log('❌ Redux: Search users rejected:', action.payload)
        state.loading = false
        state.error = action.payload
      })
      // Search events
      .addCase(searchEvents.pending, (state) => {
        console.log('⏳ Redux: Search events pending...')
        state.loading = true
        state.error = null
      })
      .addCase(searchEvents.fulfilled, (state, action) => {
        console.log('✅ Redux: Search events fulfilled with:', action.payload?.length, 'events')
        state.loading = false
        state.events = action.payload
        state.pagination.total = action.payload.length
      })
      .addCase(searchEvents.rejected, (state, action) => {
        console.log('❌ Redux: Search events rejected with error:', action.payload)
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  clearError,
  clearCurrentEvent,
  clearSearchResults,
  clearRefreshFlag,
  setFilters,
  clearFilters,
  setPagination,
  addEventLocally,
  updateEventLocally,
  removeEventLocally,
  addTeamMemberOptimistic,
  removeTeamMemberOptimistic,
} = eventSlice.actions

export default eventSlice.reducer

// Selectors for better data access
export const selectEvents = (state) => state.events.events
export const selectCurrentEvent = (state) => state.events.currentEvent
export const selectCurrentEventTeamMembers = (state) => 
  getTeamMembers(state.events.currentEvent || {})
export const selectTeamMemberLoading = (state) => state.events.teamMemberLoading
export const selectSearchResults = (state) => state.events.searchResults
export const selectEventsLoading = (state) => state.events.loading
export const selectEventsError = (state) => state.events.error

// Debug helper function to check API response
export const debugAddTeamMember = async (eventId, memberData) => {
  console.log('🔧 DEBUG: Testing addTeamMember API call directly')
  console.log('🎯 DEBUG: Event ID:', eventId, 'Member data:', memberData)
  
  try {
    // Step 1: Add member
    const addResult = await eventAPI.addTeamMember(eventId, memberData)
    console.log('✅ DEBUG: Add result:', addResult)
    
    // Step 2: Fetch updated event
    const updatedEvent = await eventAPI.getEvent(eventId)
    console.log('📋 DEBUG: Updated event:', {
      id: updatedEvent.id,
      title: updatedEvent.title,
      team_members: updatedEvent.team_members,
      team_members_count: (updatedEvent.team_members || []).length
    })
    
    // Step 3: Check if member is in the array
    const memberExists = updatedEvent.team_members?.find(m => 
      m.id === memberData.id || m.email === memberData.email
    )
    console.log('🔍 DEBUG: Member found in updated event:', memberExists ? 'YES' : 'NO')
    
    return { addResult, updatedEvent, memberExists }
  } catch (error) {
    console.error('❌ DEBUG: Error in direct API test:', error)
    return { error }
  }
}