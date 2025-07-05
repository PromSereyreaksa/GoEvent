import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://192.168.226.237:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Check both token storage methods for compatibility
    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token") ||
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      // Token expired or invalid - clear all auth data
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem("user");

      // Redirect to sign-in page if not already there
      if (window.location.pathname !== "/sign-in") {
        window.location.href = "/sign-in";
      }
    }

    // Handle network errors
    if (!response) {
      error.message = "Network error. Please check your connection.";
    }

    return Promise.reject(error);
  }
);

// API service functions
export const pricingAPI = {
  // Get all pricing plans
  getPlans: async () => {
    try {
      const response = await api.get("/site_setting/pricing-plans/");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch pricing plans"
      );
    }
  },

  // Get specific pricing plan
  getPlan: async (id) => {
    try {
      const response = await api.get(`/site_setting/pricing-plans/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch pricing plan"
      );
    }
  },
};

export const teamAPI = {
  // Get all team members
  getMembers: async () => {
    try {
      const response = await api.get("/site_setting/team-members/");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch team members"
      );
    }
  },

  // Get specific team member
  getMember: async (id) => {
    try {
      const response = await api.get(`/site_setting/team-members/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch team member"
      );
    }
  },
};

export const eventAPI = {
  // Get all events
  getEvents: async () => {
    try {
      const response = await api.get("/events/");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  },

  // Get specific event
  getEvent: async (id) => {
    try {
      const response = await api.get(`/events/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch event");
    }
  },

  // Create new event
  createEvent: async (eventData) => {
    try {
      // Client-side role check for extra security
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role !== "vendor") {
          throw new Error("Only vendors can create events");
        }
      }

      const response = await api.post("/events/", eventData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create event"
      );
    }
  },

  // Update event
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}/`, eventData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update event"
      );
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/events/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete event"
      );
    }
  },
};

export const authAPI = {
  // Login
  login: async (credentials, rememberMe = false) => {
    try {
      const response = await api.post("/auth/login/", credentials);
      const data = response.data;

      // Choose storage based on remember me preference
      const storage = rememberMe ? localStorage : sessionStorage;

      // Handle JWT tokens (access/refresh) or single token
      if (data.access && data.refresh) {
        storage.setItem("access_token", data.access);
        storage.setItem("refresh_token", data.refresh);

        // Also store in localStorage for API compatibility
        if (data.access) {
          localStorage.setItem("token", data.access);
        }
      } else if (data.token) {
        storage.setItem("access_token", data.token);
        localStorage.setItem("token", data.token);
      }

      // Store user info if provided
      if (data.user) {
        storage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/auth/logout/");
    } catch (error) {
      // Continue with cleanup even if API call fails
      console.warn("Logout API call failed:", error);
    } finally {
      // Clear all auth data
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem("user");
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post("/auth/signup/", userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },
};

export default api;
