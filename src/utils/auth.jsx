// JWT Authentication utility functions

export const getAccessToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token") || sessionStorage.getItem("access_token")
}

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token")
}

export const getUser = () => {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("user") || sessionStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

export const isAuthenticated = () => {
  return !!getAccessToken()
}

export const logout = () => {
  // Clear all auth data
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user")
  sessionStorage.removeItem("access_token")
  sessionStorage.removeItem("refresh_token")
  sessionStorage.removeItem("user")

  // Redirect to login
  window.location.href = "/sign-in"
}

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    logout()
    return null
  }

  try {
    const response = await fetch("/api/auth/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    })

    if (!response.ok) {
      logout()
      return null
    }

    const data = await response.json()

    // Update access token
    const storage = localStorage.getItem("access_token") ? localStorage : sessionStorage
    storage.setItem("access_token", data.access)

    return data.access
  } catch (error) {
    console.error("Token refresh failed:", error)
    logout()
    return null
  }
}

// API call wrapper with automatic token refresh
export const authenticatedFetch = async (url, options = {}) => {
  let accessToken = getAccessToken()

  if (!accessToken) {
    logout()
    return null
  }

  // First attempt with current token
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  // If token expired, try to refresh
  if (response.status === 401) {
    accessToken = await refreshAccessToken()

    if (!accessToken) {
      return null
    }

    // Retry with new token
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
  }

  return response
}
