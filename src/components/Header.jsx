"use client"

import { useState, useEffect } from "react"
import { Menu, X, ExternalLink } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isDarkBg, setIsDarkBg] = useState(true)

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY

      // Determine if we're over a dark or light background
      if (currentScrollY < 600) {
        setIsDarkBg(true)
      } else {
        setIsDarkBg(false)
      }

      // Show navbar when at top of page or scrolling up
      if (currentScrollY < 100) {
        setIsVisible(true)
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
        setIsMenuOpen(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", controlNavbar)
    return () => window.removeEventListener("scroll", controlNavbar)
  }, [lastScrollY])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-4 sm:px-8 font-['Plus_Jakarta_Sans'] transition-all duration-500 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${isDarkBg ? "bg-transparent" : "bg-white/95 backdrop-blur-md shadow-sm"}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
            </div>
            <span
              className={`text-xl font-bold transition-all duration-300 ${
                isDarkBg ? "text-white drop-shadow-lg" : "text-gray-800"
              } group-hover:scale-105`}
            >
              GoEvent
            </span>
          </a>

          {/* Desktop Navigation - Only About and Sign up */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="/about"
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 inline-flex items-center gap-2 group ${
                isDarkBg
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <span>About</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
            </a>

            <a
              href="/sign-up"
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 group"
            >
              <span>Sign up</span>
              <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${
              isDarkBg
                ? "text-white hover:bg-white/20 border border-white/20"
                : "text-gray-700 hover:bg-gray-100 border border-gray-200"
            } hover:scale-105`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation - Only About and Sign up */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 animate-in slide-in-from-top-2 duration-300">
            <div
              className={`rounded-2xl p-6 backdrop-blur-md border transition-all duration-300 ${
                isDarkBg ? "bg-white/15 border-white/25 shadow-2xl" : "bg-gray-50/95 border-gray-200/60 shadow-xl"
              }`}
              style={{
                borderRadius: "20px",
                boxShadow: isDarkBg
                  ? "inset 0 4px 6px 0 rgba(255, 255, 255, 0.2), 0 15px 50px 0 rgba(0, 0, 0, 0.2)"
                  : "inset 0 4px 6px 0 rgba(0, 0, 0, 0.03), 0 15px 50px 0 rgba(0, 0, 0, 0.15)",
              }}
            >
              <div className="flex flex-col gap-4">
                {/* About Link */}
                <a
                  href="/about"
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 inline-flex items-center gap-2 group ${
                    isDarkBg
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>About</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </a>

                {/* Sign up Button */}
                <a
                  href="/sign-up"
                  className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 inline-flex items-center justify-center gap-2 text-center shadow-lg w-full group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Sign up</span>
                  <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
