import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors more gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Network error
    if (!response) {
      error.message = "Network error. Please check your connection.";
      return Promise.reject(error);
    }

    // If token is invalid (unauthenticated)
    if (
      response.status === 401 &&
      response.config &&
      !response.config.__isRetryRequest
    ) {
      // Check if the request was to an auth-critical route
      const authCriticalRoutes = ["/auth/me", "/auth/refresh"];

      const isAuthCritical = authCriticalRoutes.some((path) =>
        response.config.url.includes(path)
      );

      if (isAuthCritical) {
        localStorage.removeItem("token");
        window.location.href = "/sign-in";
      }
    }

    return Promise.reject(error);
  }
);

// Utility function to handle API errors consistently
const handleAPIError = (error, defaultMessage) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    if (status === 400) {
      return new Error(data?.message || data?.error || "Bad request");
    } else if (status === 401) {
      return new Error("Unauthorized access. Please log in again.");
    } else if (status === 403) {
      return new Error("You don't have permission to perform this action.");
    } else if (status === 404) {
      return new Error("Resource not found.");
    } else if (status === 500) {
      return new Error("Server error. Please try again later.");
    } else {
      return new Error(data?.message || data?.error || defaultMessage);
    }
  } else if (error.request) {
    // Request was made but no response received
    return new Error("Network error. Please check your connection.");
  } else {
    // Something else happened
    return new Error(error.message || defaultMessage);
  }
};

// Simple cache for API responses
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key) => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  apiCache.delete(key);
  return null;
};

const setCachedData = (key, data) => {
  apiCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

const clearCache = (pattern) => {
  if (pattern) {
    Array.from(apiCache.keys()).forEach(key => {
      if (key.includes(pattern)) {
        apiCache.delete(key);
      }
    });
  } else {
    apiCache.clear();
  }
};


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
  // Get all events with optional filters
  getEvents: async (filters = {}, useCache = true) => {
    try {
      const cacheKey = `events_${JSON.stringify(filters)}`;
      
      // Check cache first
      if (useCache) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          console.log('📦 Using cached events data');
          return cachedData;
        }
      }

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const url = `/events/${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      
      // Cache the response
      if (useCache) {
        setCachedData(cacheKey, response.data);
      }
      
      return response.data;
    } catch (error) {
      throw handleAPIError(error, "Failed to fetch events");
    }
  },

  // Get specific event
  getEvent: async (id, useCache = true) => {
    try {
      const cacheKey = `event_${id}`;
      
      if (useCache) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          console.log(`📦 Using cached event data for ID: ${id}`);
          return cachedData;
        }
      }

      const response = await api.get(`/events/${id}/`);
      
      if (useCache) {
        setCachedData(cacheKey, response.data);
      }
      
      return response.data;
    } catch (error) {
      throw handleAPIError(error, "Failed to fetch event");
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
      
      // Clear events cache since we added a new event
      clearCache("events_");
      
      return response.data;
    } catch (error) {
      throw handleAPIError(error, "Failed to create event");
    }
  },

  // Update event
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}/`, eventData);
      
      // Clear relevant cache entries
      clearCache("events_");
      clearCache(`event_${id}`);
      
      return response.data;
    } catch (error) {
      throw handleAPIError(error, "Failed to update event");
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/events/${id}/`);
      
      // Clear relevant cache entries
      clearCache("events_");
      clearCache(`event_${id}`);
      
      return response.data;
    } catch (error) {
      throw handleAPIError(error, "Failed to delete event");
    }
  },

  // Get events by vendor (for vendors to see their own events)
  getVendorEvents: async (vendorId, useCache = true) => {
    try {
      const cacheKey = `vendor_events_${vendorId}`;
      
      if (useCache) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          console.log(`📦 Using cached vendor events for ID: ${vendorId}`);
          return cachedData;
        }
      }

      const response = await api.get(`/events/vendor/${vendorId}/`);
      
      if (useCache) {
        setCachedData(cacheKey, response.data);
      }
      
      return response.data;
    } catch (error) {
      throw handleAPIError(error, "Failed to fetch vendor events");
    }
  },

  // Get event analytics/stats
  getEventStats: async (eventId, useCache = true) => {
    try {
      const cacheKey = `event_stats_${eventId}`;
      
      if (useCache) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          console.log(`📦 Using cached event stats for ID: ${eventId}`);
          return cachedData;
        }
      }

      const response = await api.get(`/events/${eventId}/stats/`);
      
      if (useCache) {
        setCachedData(cacheKey, response.data);
      }
      
      return response.data;
    } catch (error) {
      throw handleAPIError(error, "Failed to fetch event statistics");
    }
  },

  // Clear all event-related cache
  clearEventCache: () => {
    clearCache("events_");
    clearCache("event_");
    clearCache("vendor_events_");
    clearCache("event_stats_");
  }
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
      const response = await api.post("/auth/signup/", userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },
};

export default api;
