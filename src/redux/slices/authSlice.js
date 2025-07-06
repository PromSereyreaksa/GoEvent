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
      const accessToken =
        localStorage.getItem("access_token") || sessionStorage.getItem("access_token") || localStorage.getItem("token")
      const refreshToken = localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token")
      const userStr = localStorage.getItem("user") || sessionStorage.getItem("user")

      console.log("initializeAuth - Storage check:", {
        accessToken: !!accessToken,
        refreshToken: !!refreshToken,
        userStr: !!userStr,
        userData: userStr ? JSON.parse(userStr) : null,
      })

      if (accessToken && userStr) {
        try {
          const user = JSON.parse(userStr)
          state.user = user
          state.token = accessToken
          state.refreshToken = refreshToken
          state.isAuthenticated = true

          console.log("initializeAuth - User loaded:", {
            userId: user.id,
            isVendor: user.is_vendor,
            email: user.email,
          })
        } catch (error) {
          console.error("Error parsing user data:", error)
          // Clear invalid data
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          localStorage.removeItem("token")
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
      console.log("loginSuccess - Payload:", action.payload)

      const { user, access, access_token, refresh, refresh_token } = action.payload

      // Handle different token field names from backend
      const token = access || access_token
      const refreshTokenValue = refresh || refresh_token

      state.user = user
      state.token = token
      state.refreshToken = refreshTokenValue
      state.isAuthenticated = true
      state.loading = false
      state.error = null

      // Store in localStorage with consistent naming
      localStorage.setItem("token", token)
      localStorage.setItem("access_token", token)
      if (refreshTokenValue) {
        localStorage.setItem("refresh_token", refreshTokenValue)
      }
      localStorage.setItem("user", JSON.stringify(user))

      console.log("loginSuccess - User stored:", {
        userId: user.id,
        isVendor: user.is_vendor,
        email: user.email,
      })
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
      // Update storage to persist the changes
      const storage = localStorage.getItem("access_token") ? localStorage : sessionStorage
      storage.setItem("user", JSON.stringify(state.user))
    },
  },
})

export const { initializeAuth, loginStart, loginSuccess, loginFailure, logout, clearError, updateUser } =
  authSlice.actions

export default authSlice.reducer
