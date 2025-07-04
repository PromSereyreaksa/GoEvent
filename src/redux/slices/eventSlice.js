import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/api"

// Async thunks
export const fetchEvents = createAsyncThunk("events/fetchEvents", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/events/")
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch events")
  }
})

export const createEvent = createAsyncThunk("events/createEvent", async (eventData, { rejectWithValue }) => {
  try {
    const response = await api.post("/events/", eventData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to create event")
  }
})

export const updateEvent = createAsyncThunk("events/updateEvent", async ({ id, eventData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/events/${id}/`, eventData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to update event")
  }
})

export const deleteEvent = createAsyncThunk("events/deleteEvent", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/events/${id}/`)
    return id
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to delete event")
  }
})

const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    currentEvent: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
      })
      .addCase(fetchEvents.rejected, (state, action) => {
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
        state.events.push(action.payload)
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update event
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((event) => event.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = action.payload
        }
        if (state.currentEvent?.id === action.payload.id) {
          state.currentEvent = action.payload
        }
      })
      // Delete event
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((event) => event.id !== action.payload)
        if (state.currentEvent?.id === action.payload) {
          state.currentEvent = null
        }
      })
  },
})

export const { clearError, setCurrentEvent } = eventSlice.actions
export default eventSlice.reducer
