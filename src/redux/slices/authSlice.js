import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  initialized: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      // Check for existing tokens in storage
      const accessToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token")
      const refreshToken = localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token")
      const userStr = localStorage.getItem("user") || sessionStorage.getItem("user")

      if (accessToken && userStr) {
        try {
          const user = JSON.parse(userStr)
          state.user = user
          state.token = accessToken
          state.refreshToken = refreshToken
          state.isAuthenticated = true
        } catch (error) {
          console.error("Error parsing user data:", error)
          // Clear invalid data
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          localStorage.removeItem("user")
          sessionStorage.removeItem("access_token")
          sessionStorage.removeItem("refresh_token")
          sessionStorage.removeItem("user")
        }
      }

      state.initialized = true
    },
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      const { user, access_token, refresh_token } = action.payload
      state.user = user
      state.token = access_token
      state.refreshToken = refresh_token
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.refreshToken = null
    },
    logout: (state) => {
      // Clear Redux state
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null

      // Clear storage
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("token")   
      localStorage.removeItem("user")
      sessionStorage.removeItem("access_token")
      sessionStorage.removeItem("refresh_token")
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("user")
    },
    clearError: (state) => {
      state.error = null
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      // Update storage
      const storage = localStorage.getItem("access_token") ? localStorage : sessionStorage
      storage.setItem("user", JSON.stringify(state.user))
    },
  },
})

export const { initializeAuth, loginStart, loginSuccess, loginFailure, logout, clearError, updateUser } =
  authSlice.actions

export default authSlice.reducer
