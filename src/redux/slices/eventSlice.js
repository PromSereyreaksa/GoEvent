import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { eventAPI } from "../../utils/api"

// Async thunks for event operations
export const fetchEvents = createAsyncThunk("events/fetchEvents", async (_, { rejectWithValue }) => {
  try {
    const events = await eventAPI.getEvents()
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

export const fetchEventsByCategory = createAsyncThunk(
  "events/fetchEventsByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const events = await eventAPI.getEventsByCategory(category)
      return events
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    currentEvent: null,
    loading: false,
    error: null,
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
      // Fetch events by category
      .addCase(fetchEventsByCategory.fulfilled, (state, action) => {
        state.events = action.payload
        state.filters.category = action.meta.arg
      })
  },
})

export const {
  clearError,
  clearCurrentEvent,
  setFilters,
  clearFilters,
  setPagination,
  addEventLocally,
  updateEventLocally,
  removeEventLocally,
} = eventSlice.actions

export default eventSlice.reducer
