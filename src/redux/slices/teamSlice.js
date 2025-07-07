import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { teamAPI } from "../../utils/api"

// Async thunks for team operations
export const fetchTeamMembers = createAsyncThunk(
  "team/fetchTeamMembers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await teamAPI.getMembers()
      return response
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch team members")
    }
  }
)

export const inviteTeamMember = createAsyncThunk(
  "team/inviteTeamMember",
  async (inviteData, { rejectWithValue }) => {
    try {
      // TODO: Implement real API call when backend endpoint is ready
      // const response = await teamAPI.invite(inviteData)
      
      // For now, simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful response
      const newMember = {
        id: Date.now(),
        name: inviteData.email.split('@')[0],
        email: inviteData.email,
        role: inviteData.role,
        avatar: null,
        status: "pending",
        joinedAt: new Date().toISOString().split('T')[0],
        lastActive: "Never",
        events: inviteData.eventId ? [`Event ${inviteData.eventId}`] : [],
        permissions: getRolePermissions(inviteData.role),
        invitedAt: new Date().toISOString(),
      }
      
      return newMember
    } catch (error) {
      return rejectWithValue(error.message || "Failed to invite team member")
    }
  }
)

export const updateTeamMemberRole = createAsyncThunk(
  "team/updateTeamMemberRole",
  async ({ memberId, newRole }, { rejectWithValue }) => {
    try {
      // TODO: Implement real API call when backend endpoint is ready
      // const response = await teamAPI.updateRole(memberId, newRole)
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return { memberId, newRole, permissions: getRolePermissions(newRole) }
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update team member role")
    }
  }
)

export const removeTeamMember = createAsyncThunk(
  "team/removeTeamMember",
  async (memberId, { rejectWithValue }) => {
    try {
      // TODO: Implement real API call when backend endpoint is ready
      // await teamAPI.remove(memberId)
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return memberId
    } catch (error) {
      return rejectWithValue(error.message || "Failed to remove team member")
    }
  }
)

// Helper function to get role permissions
const getRolePermissions = (role) => {
  switch (role) {
    case "admin":
      return ["create", "edit", "delete", "invite", "manage"]
    case "editor":
      return ["create", "edit"]
    case "viewer":
      return ["view"]
    default:
      return ["view"]
  }
}

const teamSlice = createSlice({
  name: "team",
  initialState: {
    members: [
      // Initial mock data - will be replaced by API data
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "admin",
        avatar: null,
        status: "active",
        joinedAt: "2024-01-15",
        lastActive: "2 hours ago",
        events: ["Annual Conference", "Product Launch"],
        permissions: ["create", "edit", "delete", "invite"],
      },
      {
        id: 2,
        name: "Mike Chen",
        email: "mike@example.com",
        role: "editor",
        avatar: null,
        status: "active",
        joinedAt: "2024-02-10",
        lastActive: "1 day ago",
        events: ["Product Launch", "Team Meeting"],
        permissions: ["create", "edit"],
      },
      {
        id: 3,
        name: "Emily Davis",
        email: "emily@example.com",
        role: "viewer",
        avatar: null,
        status: "pending",
        joinedAt: "2024-03-05",
        lastActive: "Never",
        events: ["Annual Conference"],
        permissions: ["view"],
      },
    ],
    loading: false,
    error: null,
    inviteLoading: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateMemberStatus: (state, action) => {
      const { memberId, status } = action.payload
      const member = state.members.find(m => m.id === memberId)
      if (member) {
        member.status = status
        member.lastActive = status === 'active' ? 'Just now' : member.lastActive
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch team members
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false
        state.members = action.payload
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Invite team member
      .addCase(inviteTeamMember.pending, (state) => {
        state.inviteLoading = true
        state.error = null
      })
      .addCase(inviteTeamMember.fulfilled, (state, action) => {
        state.inviteLoading = false
        state.members.push(action.payload)
      })
      .addCase(inviteTeamMember.rejected, (state, action) => {
        state.inviteLoading = false
        state.error = action.payload
      })
      
      // Update team member role
      .addCase(updateTeamMemberRole.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateTeamMemberRole.fulfilled, (state, action) => {
        state.loading = false
        const { memberId, newRole, permissions } = action.payload
        const member = state.members.find(m => m.id === memberId)
        if (member) {
          member.role = newRole
          member.permissions = permissions
        }
      })
      .addCase(updateTeamMemberRole.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Remove team member
      .addCase(removeTeamMember.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        state.loading = false
        state.members = state.members.filter(m => m.id !== action.payload)
      })
      .addCase(removeTeamMember.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, updateMemberStatus } = teamSlice.actions
export default teamSlice.reducer
