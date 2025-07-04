import axios from "axios"
import { store } from "../redux/store"
import { logout } from "../redux/slices/authSlice"
import process from "process"


const API_BASE_URL =import.meta.env.REACT_APP_API_URL || "https://snwv9cpm-8000.asse.devtunnels.ms/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.auth.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error

    if (response?.status === 401) {
      // Token expired or invalid
      store.dispatch(logout())
      window.location.href = "/sign-in"
    }

    // Handle network errors
    if (!response) {
      error.message = "Network error. Please check your connection."
    }

    return Promise.reject(error)
  },
)

export default api
