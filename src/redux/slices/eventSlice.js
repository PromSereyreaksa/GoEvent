import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { eventAPI } from "../../utils/api"
import { mockEvents } from "../../data/mockCollaborationData"

// Async thunks for event operations
export const fetchEvents = createAsyncThunk("events/fetchEvents", async (_, { rejectWithValue }) => {
  try {
    const events = await eventAPI.getEvents()
    return events
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const fetchEventsLight = createAsyncThunk("events/fetchEventsLight", async (_, { rejectWithValue }) => {
  try {
    const events = await eventAPI.getEventsLight()
    return events
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const fetchEventById = createAsyncThunk("events/fetchEventById", async (id, { rejectWithValue }) => {
  try {
    const event = await eventAPI.getEvent(id)
    return event
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const createEvent = createAsyncThunk("events/createEvent", async (eventData, { rejectWithValue }) => {
  try {
    const newEvent = await eventAPI.createEvent(eventData)
    return newEvent
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const updateEvent = createAsyncThunk("events/updateEvent", async ({ id, eventData }, { rejectWithValue }) => {
  try {
    const updatedEvent = await eventAPI.updateEvent(id, eventData)
    return updatedEvent
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const deleteEvent = createAsyncThunk("events/deleteEvent", async (id, { rejectWithValue }) => {
  try {
    await eventAPI.deleteEvent(id)
    return id
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

// Team management async thunks
export const addTeamMember = createAsyncThunk(
  "events/addTeamMember",
  async ({ eventId, memberData }, { rejectWithValue }) => {
    try {
      const result = await eventAPI.addTeamMember(eventId, memberData)
      return { eventId, member: result }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const removeTeamMember = createAsyncThunk(
  "events/removeTeamMember", 
  async ({ eventId, memberId }, { rejectWithValue }) => {
    try {
      await eventAPI.removeTeamMember(eventId, memberId)
      return { eventId, memberId }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const searchUsers = createAsyncThunk(
  "events/searchUsers",
  async (query, { rejectWithValue }) => {
    try {
      const users = await eventAPI.searchUsers(query)
      return users
    } catch (error) {
      return rejectWithValue(error.message)
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
      state.events.unshift(action.payload)
    },
    updateEventLocally: (state, action) => {
      const index = state.events.findIndex((event) => event.id === action.payload.id)
      if (index !== -1) {
        state.events[index] = action.payload
      }
    },
    removeEventLocally: (state, action) => {
      state.events = state.events.filter((event) => event.id !== action.payload)
    },
    // Team member local updates
    addTeamMemberLocally: (state, action) => {
      const { eventId, member } = action.payload
      const event = state.events.find(e => e.id === eventId)
      if (event) {
        if (!event.team_members) event.team_members = []
        event.team_members.push(member)
      }
      if (state.currentEvent && state.currentEvent.id === eventId) {
        if (!state.currentEvent.team_members) state.currentEvent.team_members = []
        state.currentEvent.team_members.push(member)
      }
    },
    removeTeamMemberLocally: (state, action) => {
      const { eventId, memberId } = action.payload
      const event = state.events.find(e => e.id === eventId)
      if (event?.team_members) {
        event.team_members = event.team_members.filter(m => m.id !== memberId)
      }
      if (state.currentEvent?.id === eventId && state.currentEvent.team_members) {
        state.currentEvent.team_members = state.currentEvent.team_members.filter(m => m.id !== memberId)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
        state.pagination.total = action.payload.length
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch light events (optimized)
      .addCase(fetchEventsLight.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventsLight.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
        state.pagination.total = action.payload.length
      })
      .addCase(fetchEventsLight.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch event by ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false
        state.currentEvent = action.payload
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events.unshift(action.payload)
        state.currentEvent = action.payload
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false
        const index = state.events.findIndex((event) => event.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = action.payload
        }
        state.currentEvent = action.payload
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events = state.events.filter((event) => event.id !== action.payload)
        if (state.currentEvent && state.currentEvent.id === action.payload) {
          state.currentEvent = null
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Add team member
      .addCase(addTeamMember.pending, (state) => {
        state.teamMemberLoading = true
        state.error = null
      })
      .addCase(addTeamMember.fulfilled, (state, action) => {
        state.teamMemberLoading = false
        const { eventId, member } = action.payload
        const event = state.events.find(e => e.id === eventId)
        if (event) {
          if (!event.team_members) event.team_members = []
          event.team_members.push(member)
        }
        if (state.currentEvent && state.currentEvent.id === eventId) {
          if (!state.currentEvent.team_members) state.currentEvent.team_members = []
          state.currentEvent.team_members.push(member)
        }
      })
      .addCase(addTeamMember.rejected, (state, action) => {
        state.teamMemberLoading = false
        state.error = action.payload
      })
      // Remove team member
      .addCase(removeTeamMember.pending, (state) => {
        state.teamMemberLoading = true
        state.error = null
      })
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        state.teamMemberLoading = false
        const { eventId, memberId } = action.payload
        const event = state.events.find(e => e.id === eventId)
        if (event?.team_members) {
          event.team_members = event.team_members.filter(m => m.id !== memberId)
        }
        if (state.currentEvent?.id === eventId && state.currentEvent.team_members) {
          state.currentEvent.team_members = state.currentEvent.team_members.filter(m => m.id !== memberId)
        }
      })
      .addCase(removeTeamMember.rejected, (state, action) => {
        state.teamMemberLoading = false
        state.error = action.payload
      })
      // Search users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.searchResults = action.payload
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  clearError,
  clearCurrentEvent,
  clearSearchResults,
  setFilters,
  clearFilters,
  setPagination,
  addEventLocally,
  updateEventLocally,
  removeEventLocally,
  addTeamMemberLocally,
  removeTeamMemberLocally,
} = eventSlice.actions

export default eventSlice.reducer
