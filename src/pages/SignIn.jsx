"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
// Check if user is authenticated
// const baseUrl = 'http://192.168.226.155:9000'
const baseUrl = import.meta.env.REACT_APP_API_BASE_URL || "http://192.168.31.249:9000";

// Make authenticated API calls
// const response = await authenticatedFetch('/api/user/profile/')

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Prepare data for Django REST Framework JWT authentication
      const apiData = {
        email: formData.email,
        password: formData.password,
      }

      // Replace with your actual API endpoint
      const response = await fetch(`${baseUrl}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // Handle different types of errors from Django
        if (response.status === 401) {
          setErrors({ general: "Invalid email or password" })
        } else if (errorData.email) {
          setErrors({ email: errorData.email[0] })
        } else if (errorData.password) {
          setErrors({ password: errorData.password[0] })
        } else {
          setErrors({ general: "Login failed. Please try again." })
        }
        return
      }

      const result = await response.json()

      // Handle JWT tokens
      if (result.access && result.refresh) {
        // Store tokens based on remember me preference
        if (formData.rememberMe) {
          // Store in localStorage for persistent login
          localStorage.setItem("access_token", result.access)
          localStorage.setItem("refresh_token", result.refresh)
        } else {
          // Store in sessionStorage for session-only login
          sessionStorage.setItem("access_token", result.access)
          sessionStorage.setItem("refresh_token", result.refresh)
        }

        // Store user info if provided
        if (result.user) {
          const storage = formData.rememberMe ? localStorage : sessionStorage
          storage.setItem("user", JSON.stringify(result.user))
        }

        console.log("Login successful:", result)

        // Redirect to dashboard or home page
        window.location.href = "/dashboard"
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrors({ general: "Network error. Please check your connection and try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      // Replace with your Google OAuth endpoint
      window.location.href = "/api/auth/google/"
    } catch (error) {
      console.error("Google sign-in error:", error)
      setErrors({ general: "Google sign-in failed. Please try again." })
    }
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    // Redirect to forgot password page or open modal
    window.location.href = "/forgot-password"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 via-blue-400 to-white font-['Plus_Jakarta_Sans'] pt-20 pb-56 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/cta-grid.svg')] bg-center bg-no-repeat bg-cover opacity-20"></div>
      <div className="relative z-10 max-w-md mx-auto px-4">
        <div className="bg-white rounded-3xl p-10 flex flex-col gap-6 shadow-xl">
          <div className="text-center flex flex-col gap-1.5">
            <h2 className="text-3xl font-bold text-black">Sign in to your account</h2>
            <p className="text-sm text-neutral-600">
              Or{" "}
              <a href="/sign-up" className="font-medium text-blue-500 hover:text-blue-600">
                create a new account
              </a>
            </p>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-base font-semibold text-black">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-base font-semibold text-black">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="text-sm text-black">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" onClick={handleForgotPassword} className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignIn
