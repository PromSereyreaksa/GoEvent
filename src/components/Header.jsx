"use client"  

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDarkBg, setIsDarkBg] = useState(true);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Reviews", href: "/reviews" },
  ];

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if we're over a dark or light background
      // Adjust these values based on your page layout
      if (currentScrollY < 600) { // Hero section (dark blue)
        setIsDarkBg(true);
      } else { // Other sections (potentially light)
        setIsDarkBg(false);
      }
      
      // Show navbar when at top of page or scrolling up
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else {
        // Scrolling down past 100px (roughly first page)
        setIsVisible(false);
        setIsMenuOpen(false); // Close mobile menu when hiding navbar
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-8 font-['Plus_Jakarta_Sans'] transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isDarkBg 
          ? 'bg-transparent' 
          : 'bg-white/95 backdrop-blur-md shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-blue-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
              </svg>
            </div>
            <span className={`text-xl font-bold drop-shadow-sm transition-colors ${
              isDarkBg ? 'text-white' : 'text-gray-800'
            }`}>
              GoEvent
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex">
            <div
              className={`rounded-2xl px-8 py-3 backdrop-blur-md border transition-colors ${
                isDarkBg 
                  ? 'bg-white/20 border-white/30' 
                  : 'bg-gray-100/80 border-gray-200/50'
              }`}
              style={{
                borderRadius: "16px",
                boxShadow: isDarkBg
                  ? "inset 0 4px 4px 0 rgba(255, 255, 255, 0.25), 0 8px 32px 0 rgba(0, 0, 0, 0.1)"
                  : "inset 0 4px 4px 0 rgba(0, 0, 0, 0.05), 0 8px 32px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center gap-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`text-base font-medium transition-colors drop-shadow-sm ${
                      isDarkBg 
                        ? 'text-white hover:text-white/80' 
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </nav>

          {/* Sign up button */}
          <div className="hidden lg:block">
            <a
              href="/sign-up"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
            >
              Sign up
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden w-8 p-0 transition-colors drop-shadow-md ${
              isDarkBg 
                ? 'text-white hover:text-gray-200' 
                : 'text-gray-700 hover:text-gray-900'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4">
            <div
              className={`rounded-2xl p-6 backdrop-blur-md border transition-colors ${
                isDarkBg 
                  ? 'bg-white/20 border-white/30' 
                  : 'bg-gray-100/90 border-gray-200/50'
              }`}
              style={{
                borderRadius: "16px",
                boxShadow: isDarkBg
                  ? "inset 0 4px 4px 0 rgba(255, 255, 255, 0.25), 0 8px 32px 0 rgba(0, 0, 0, 0.1)"
                  : "inset 0 4px 4px 0 rgba(0, 0, 0, 0.05), 0 8px 32px 0 rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`text-base font-medium transition-colors drop-shadow-sm ${
                      isDarkBg 
                        ? 'text-white hover:text-white/80' 
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className={`pt-4 border-t ${isDarkBg ? 'border-white/20' : 'border-gray-300/50'}`}>
                  <a
                    href="/sign-up"
                    className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors inline-block text-center shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
