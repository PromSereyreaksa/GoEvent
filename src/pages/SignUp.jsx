"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
// const baseUrl = import.meta.env.REACT_APP_API_BASE_URL;

const baseUrl = 'http://192.168.226.155:9000'

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const validateForm = () => {
  const newErrors = {}

  console.log('Validating form data:', formData); // Add this for debugging

  if (!formData.firstName.trim()) {
    newErrors.firstName = "First name is required"
  }

  if (!formData.lastName.trim()) {
    newErrors.lastName = "Last name is required"
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email is required"
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Email is invalid"
  }

  // More explicit password validation
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
      autoComplete="new-password"
      required
      value={formData.password}
      onChange={handleChange}
      onBlur={(e) => {
        // Force validation on blur to catch any issues
        console.log('Password field value on blur:', e.target.value);
        console.log('FormData password:', formData.password);
      }}
      className={`block w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
        errors.password ? "border-red-300" : "border-gray-300"
      }`}
      placeholder="Create a password"
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


  if (!formData.agreeToTerms) {
    newErrors.agreeToTerms = "You must agree to the terms and conditions"
  }

  console.log('Validation errors:', newErrors); // Debug log
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
    // Use dj-rest-auth registration endpoint
    const apiData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,        // Note: password1, not password
      password2: formData.confirmPassword, // Note: password2, not password_confirm
    }

    const response = await fetch(`${baseUrl}/auth/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiData),
    })

    // Check if response has content before parsing JSON
    const contentType = response.headers.get("content-type")
    let result = {}
    
    if (contentType && contentType.includes("application/json")) {
      const text = await response.text()
      if (text) {
        try {
          result = JSON.parse(text)
        } catch (parseError) {
          console.error("JSON parse error:", parseError)
          setErrors({ general: "Invalid response from server" })
          return
        }
      }
    }

    if (!response.ok) {
      // Handle validation errors from dj-rest-auth
      if (result.non_field_errors) {
        setErrors({ general: result.non_field_errors.join(', ') })
      } else if (Object.keys(result).length > 0) {
        setErrors(result)
      } else {
        setErrors({ general: `Registration failed with status ${response.status}` })
      }
      return
    }

    console.log("Registration successful:", result)

    // Store JWT tokens if they're returned
    if (result.access_token) {
      localStorage.setItem('access_token', result.access_token)
    }
    if (result.refresh_token) {
      localStorage.setItem('refresh_token', result.refresh_token)
    }
    
    // Alternative: some configurations return tokens in 'access' and 'refresh' keys
    if (result.access) {
      localStorage.setItem('access_token', result.access)
    }
    if (result.refresh) {
      localStorage.setItem('refresh_token', result.refresh)
    }

    // Handle successful registration
    // Option 1: Redirect to dashboard/home
    // window.location.href = '/dashboard'
    
    // Option 2: Show success message and redirect after delay
    // setSuccessMessage("Registration successful! Redirecting...")
    // setTimeout(() => window.location.href = '/dashboard', 2000)
    
    // Option 3: Call parent component handler
    // onRegistrationSuccess(result)

  } catch (error) {
    console.error("Registration error:", error)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 via-blue-400 to-white font-['Plus_Jakarta_Sans'] pt-20 pb-56 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/cta-grid.svg')] bg-center bg-no-repeat bg-cover opacity-20"></div>
      <div className="relative z-10 max-w-md mx-auto px-4">
        <div className="bg-white rounded-3xl p-10 flex flex-col gap-6 shadow-xl">
          <div className="text-center flex flex-col gap-1.5">
            <h2 className="text-3xl font-bold text-black">Create your account</h2>
            <p className="text-sm text-neutral-600">
              Or{" "}
              <a href="/sign-in" className="font-medium text-blue-500 hover:text-blue-600">
                sign in to your existing account
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
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="text-base font-semibold text-black">
                    First name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`btk w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                        errors.firstName ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="First name"
                    />
                  </div>
                  {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-base font-semibold text-black">
                    Last name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`btk w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                        errors.lastName ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Last name"
                    />
                  </div>
                  {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
                </div>
              </div>

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
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Create a password"
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

              {/* Confirm Password Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-base font-semibold text-black">
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
                      errors.confirmPassword ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-black">
                  I agree to the{" "}
                  <a href="/terms-and-conditions" className="text-blue-600 hover:text-blue-500">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy-policy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.agreeToTerms && <p className="text-red-600 text-sm">{errors.agreeToTerms}</p>}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create account"}
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
                  className="w-full inline-flex justify-center py-3 px-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <span className="sr-only">Sign up with Google</span>
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

export default SignUp
