import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign up attempt:", formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-white font-['Plus_Jakarta_Sans'] pt-20 pb-56 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid-1.svg?height=800&width=1200')] bg-center bg-no-repeat bg-cover opacity-20"></div>

      <div className="relative z-10 max-w-md mx-auto px-4">
        <div className="bg-white rounded-3xl p-10 flex flex-col gap-6 shadow-xl">
          <div className="text-center flex flex-col gap-1.5">
            <h2 className="text-3xl font-bold text-black">
              Create your account
            </h2>
            <p className="text-sm text-neutral-600">
              Or{" "}
              <a
                href="/sign-in"
                className="font-medium text-blue-500 hover:text-blue-600"
              >
                sign in to your existing account
              </a>
            </p>
          </div>

          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-8">
                  <label
                    htmlFor="firstName"
                    className="text-base font-semibold text-black"
                  >
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
                      className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      placeholder="First name"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  <label
                    htmlFor="lastName"
                    className="text-base font-semibold text-black"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-base font-semibold text-black"
                >
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
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-base font-semibold text-black"
                >
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
                    className="block w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
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
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-base font-semibold text-black"
                >
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
                    className="block w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
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
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                required
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-black">
                I agree to the{" "}
                <a
                  href="/terms-and-conditions"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Create account
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
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

                <button
                  type="button"
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <span className="sr-only">Sign up with Facebook</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
