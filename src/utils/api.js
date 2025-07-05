import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
    // Get token from localStorage
    const token = localStorage.getItem("token");

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
      // Token expired or invalid
      localStorage.removeItem("token");
      // Redirect to sign-in page if it exists
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
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login/", credentials);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/auth/logout/");
      localStorage.removeItem("token");
    } catch (error) {
      // Even if logout fails, remove token
      localStorage.removeItem("token");
      throw new Error(error.response?.data?.message || "Logout failed");
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register/", userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },
};

export default api;
