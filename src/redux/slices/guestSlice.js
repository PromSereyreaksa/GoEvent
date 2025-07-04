import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/api"

// Async thunks
export const fetchGuests = createAsyncThunk("guests/fetchGuests", async (eventId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/events/${eventId}/guests/`)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch guests")
  }
})

export const inviteGuest = createAsyncThunk(
  "guests/inviteGuest",
  async ({ eventId, guestData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/events/${eventId}/guests/`, guestData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to invite guest")
    }
  },
)

export const updateGuestStatus = createAsyncThunk(
  "guests/updateGuestStatus",
  async ({ guestId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/guests/${guestId}/`, { status })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update guest status")
    }
  },
)

const guestSlice = createSlice({
  name: "guests",
  initialState: {
    guests: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch guests
      .addCase(fetchGuests.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGuests.fulfilled, (state, action) => {
        state.loading = false
        state.guests = action.payload
      })
      .addCase(fetchGuests.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Invite guest
      .addCase(inviteGuest.fulfilled, (state, action) => {
        state.guests.push(action.payload)
      })
      // Update guest status
      .addCase(updateGuestStatus.fulfilled, (state, action) => {
        const index = state.guests.findIndex((guest) => guest.id === action.payload.id)
        if (index !== -1) {
          state.guests[index] = action.payload
        }
      })
  },
})

export const { clearError } = guestSlice.actions
export default guestSlice.reducer
