import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Async thunk to fetch notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue, getState }) => {
    try {
      // TODO: Implement real API call when backend endpoint is ready
      // const response = await notificationAPI.getNotifications()
      
      // For now, generate notifications based on current state
      const state = getState()
      const { events = [] } = state.events || {}
      const { guests = [] } = state.guests || {}
      const { members = [] } = state.team || {}
      
      const notifications = []
      let id = 1

      // Add team invitation notifications
      const pendingMembers = members.filter(member => member.status === 'pending')
      pendingMembers.forEach(member => {
        notifications.push({
          id: id++,
          title: "Team Invitation Sent",
          message: `Invitation sent to ${member.name}`,
          time: member.invitedAt ? getTimeAgo(new Date(member.invitedAt)) : "Recently",
          type: "team_invite",
          read: false,
          icon: "Users",
          data: { memberId: member.id, memberEmail: member.email }
        })
      })

      // Add guest notifications
      const recentGuests = [...guests]
        .filter(guest => guest.invitedAt || guest.status === 'confirmed')
        .sort((a, b) => new Date(b.invitedAt || b.updatedAt) - new Date(a.invitedAt || a.updatedAt))
        .slice(0, 3)

      recentGuests.forEach(guest => {
        if (guest.status === 'confirmed') {
          notifications.push({
            id: id++,
            title: "RSVP Confirmed",
            message: `${guest.name} confirmed attendance`,
            time: guest.updatedAt ? getTimeAgo(new Date(guest.updatedAt)) : "Recently",
            type: "rsvp_confirmed",
            read: false,
            icon: "CheckCircle",
            data: { guestId: guest.id, guestName: guest.name }
          })
        } else if (guest.invitedAt) {
          notifications.push({
            id: id++,
            title: "Guest Invited",
            message: `${guest.name} has been invited`,
            time: getTimeAgo(new Date(guest.invitedAt)),
            type: "guest_invite",
            read: Math.random() > 0.7, // Some notifications are read
            icon: "Mail",
            data: { guestId: guest.id, guestName: guest.name }
          })
        }
      })

      // Add event reminders
      const upcomingEvents = events
        .filter(event => {
          if (!event.date) return false
          const eventDate = new Date(event.date)
          const now = new Date()
          const diffTime = eventDate - now
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          return diffDays > 0 && diffDays <= 7
        })
        .slice(0, 2)

      upcomingEvents.forEach(event => {
        const eventDate = new Date(event.date)
        const diffDays = Math.ceil((eventDate - new Date()) / (1000 * 60 * 60 * 24))
        
        notifications.push({
          id: id++,
          title: "Event Reminder",
          message: `${event.title} is ${diffDays === 1 ? 'tomorrow' : `in ${diffDays} days`}`,
          time: `${diffDays} day${diffDays === 1 ? '' : 's'} to go`,
          type: "event_reminder",
          read: false,
          icon: "Calendar",
          data: { eventId: event.id, eventTitle: event.title }
        })
      })

      // Add welcome message if no notifications
      if (notifications.length === 0) {
        notifications.push({
          id: id++,
          title: "Welcome to GoEvent!",
          message: "Start by creating your first event",
          time: "Now",
          type: "welcome",
          read: false,
          icon: "Settings",
          data: {}
        })
      }

      return notifications.slice(0, 10) // Limit to 10 notifications
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch notifications")
    }
  }
)

// Helper function to get relative time
const getTimeAgo = (date) => {
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  const diffMinutes = Math.ceil(diffTime / (1000 * 60))

  if (diffDays > 1) return `${diffDays} days ago`
  if (diffHours > 1) return `${diffHours} hours ago`
  if (diffMinutes > 1) return `${diffMinutes} minutes ago`
  return "Just now"
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    unreadCount: 0,
  },
  reducers: {
    markAsRead: (state, action) => {
      const notificationId = action.payload
      const notification = state.notifications.find(n => n.id === notificationId)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true
      })
      state.unreadCount = 0
    },
    addNotification: (state, action) => {
      const newNotification = {
        id: Date.now(),
        ...action.payload,
        read: false,
        time: "Just now"
      }
      state.notifications.unshift(newNotification)
      state.unreadCount += 1
      
      // Keep only last 10 notifications
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10)
      }
    },
    removeNotification: (state, action) => {
      const notificationId = action.payload
      const notification = state.notifications.find(n => n.id === notificationId)
      if (notification && !notification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
      state.notifications = state.notifications.filter(n => n.id !== notificationId)
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload
        state.unreadCount = action.payload.filter(n => !n.read).length
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { 
  markAsRead, 
  markAllAsRead, 
  addNotification, 
  removeNotification, 
  clearError 
} = notificationsSlice.actions

export default notificationsSlice.reducer
