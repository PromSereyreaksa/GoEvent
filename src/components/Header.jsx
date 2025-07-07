"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // State management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDarkBg, setIsDarkBg] = useState(true);

  // Constants
  const SCROLL_THRESHOLD = {
    BACKGROUND_CHANGE: 600,
    HIDE_THRESHOLD: 100,
  };

  // Event handlers
  const handleLogout = useCallback(() => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate("/");
  }, [dispatch, navigate]);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Scroll control logic
  const controlNavbar = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Determine background based on scroll position
    setIsDarkBg(currentScrollY < SCROLL_THRESHOLD.BACKGROUND_CHANGE);

    // Show/hide navbar logic
    if (currentScrollY < SCROLL_THRESHOLD.HIDE_THRESHOLD) {
      setIsVisible(true);
    } else if (currentScrollY < lastScrollY) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setIsMenuOpen(false);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  // Effects
  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [controlNavbar]);

  // Style configurations
  const headerStyles = {
    base: `fixed top-0 left-0 right-0 z-50 py-4 px-4 sm:px-8 font-['Plus_Jakarta_Sans'] transition-all duration-500`,
    visibility: isVisible ? "translate-y-0" : "-translate-y-full",
    background: isDarkBg
      ? "bg-transparent"
      : "bg-white/95 backdrop-blur-md shadow-sm",
  };

  const logoStyles = `text-xl font-bold transition-all duration-300 ${
    isDarkBg ? "text-white drop-shadow-lg" : "text-gray-800"
  } group-hover:scale-105`;

  const getDashboardButtonStyles = (isMobile = false) => {
    const baseStyles = `rounded-full font-semibold transition-all duration-300 inline-flex items-center gap-2 group shadow-lg hover:shadow-xl transform hover:scale-105`;
    const sizeStyles = isMobile ? "px-4 py-2 text-sm shadow-md" : "px-6 py-3";
    const colorStyles = isDarkBg
      ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
      : "bg-blue-600 text-white hover:bg-blue-700";

    return `${baseStyles} ${sizeStyles} ${colorStyles}`;
  };

  const getTextButtonStyles = () =>
    `px-4 py-2 rounded-full font-medium transition-all duration-300 ${
      isDarkBg
        ? "text-white/90 hover:text-white hover:bg-white/10"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
    }`;

  const getSignUpButtonStyles = () =>
    "bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 group";

  const getMobileMenuStyles = () => {
    const containerStyles = `lg:hidden overflow-hidden transition-all duration-300 ease-out ${
      isMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
    }`;

    const contentStyles = `transform transition-all duration-300 ease-out ${
      isMenuOpen ? "translate-y-0 scale-100" : "-translate-y-4 scale-95"
    }`;

    const panelStyles = `rounded-2xl p-6 transition-all duration-300 ease-out ${
      isDarkBg
        ? "bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl"
        : "bg-white/98 backdrop-blur-md border border-gray-200 shadow-xl"
    }`;

    return { containerStyles, contentStyles, panelStyles };
  };

  const getMobileButtonStyles = () =>
    `p-2 rounded-xl transition-all duration-300 ${
      isDarkBg
        ? "text-white hover:bg-white/20 border border-white/20"
        : "text-gray-700 hover:bg-gray-100 border border-gray-200"
    } hover:scale-105`;

  // Component render helpers
  const renderLogo = () => (
    <a
      href={isAuthenticated ? "/homepage" : "/"}
      className="flex items-center gap-3 group"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-blue-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
      </div>
      <span className={logoStyles}>GoEvent</span>
    </a>
  );

  const renderDesktopNavigation = () => (
    <div className="hidden lg:flex items-center gap-4">
      {isAuthenticated ? (
        // Authenticated user navigation
        <>
          <a href="/homepage" className={getDashboardButtonStyles()}>
            <span>View Dashboard</span>
          </a>
          <a
            href="/about"
            className={`${getTextButtonStyles()} inline-flex items-center gap-2 group`}
          >
            <span>About</span>
            <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
          </a>
          <button onClick={handleLogout} className={getTextButtonStyles()}>
            Logout
          </button>
        </>
      ) : (
        // Unauthenticated user navigation
        <>
          <a
            href="/about"
            className={`${getTextButtonStyles()} inline-flex items-center gap-2 group`}
          >
            <span>About</span>
            <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
          </a>
          <a href="/sign-in" className={getTextButtonStyles()}>
            Sign In
          </a>
          <a href="/sign-up" className={getSignUpButtonStyles()}>
            <span>Sign up</span>
            <ExternalLink className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
          </a>
        </>
      )}
    </div>
  );

  const renderMobileControls = () => (
    <div className="lg:hidden flex items-center gap-3">
      {isAuthenticated && (
        <a href="/homepage" className={getDashboardButtonStyles(true)}>
          Dashboard
        </a>
      )}
      <button className={getMobileButtonStyles()} onClick={handleMenuToggle}>
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );

  const renderMobileMenuItem = (
    href,
    title,
    description,
    icon,
    isButton = false,
    onClick = null
  ) => {
    const baseClasses =
      "px-4 py-4 rounded-xl font-medium transition-all duration-300 ease-out inline-flex items-center gap-4 group transform hover:translate-x-1 border border-transparent";
    const colorClasses =
      title === "Logout"
        ? "text-gray-700 hover:text-red-600 hover:bg-red-50/80 hover:border-red-100"
        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 hover:border-blue-100";

    const iconBgClasses =
      title === "Logout"
        ? "w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-colors duration-300"
        : "w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors duration-300";

    const iconColorClasses =
      title === "Logout"
        ? "w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors duration-300"
        : "w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300";

    const descriptionClasses =
      title === "Logout"
        ? "text-sm text-gray-500 group-hover:text-red-500"
        : "text-sm text-gray-500 group-hover:text-blue-500";

    const Component = isButton ? "button" : "a";
    const props = isButton
      ? {
          onClick: () => {
            onClick();
            closeMenu();
          },
          className: `${baseClasses} ${colorClasses} text-left`,
        }
      : {
          href,
          onClick: closeMenu,
          className: `${baseClasses} ${colorClasses}`,
        };

    return (
      <Component {...props}>
        <div className={iconBgClasses}>
          {React.cloneElement(icon, { className: iconColorClasses })}
        </div>
        <div className="flex-1">
          <div className="font-semibold">{title}</div>
          <div className={descriptionClasses}>{description}</div>
        </div>
      </Component>
    );
  };

  const renderMobileMenu = () => {
    const { containerStyles, contentStyles, panelStyles } =
      getMobileMenuStyles();

    return (
      <div className={containerStyles}>
        <div className={contentStyles}>
          <div
            className={panelStyles}
            style={{
              borderRadius: "20px",
              boxShadow: isDarkBg
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="flex flex-col gap-2">
              {/* About Link */}
              {renderMobileMenuItem(
                "/about",
                "About",
                "Learn more about GoEvent",
                <ExternalLink />
              )}

              {/* Authentication-based navigation */}
              {isAuthenticated ? (
                renderMobileMenuItem(
                  null,
                  "Logout",
                  "Sign out of your account",
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>,
                  true,
                  handleLogout
                )
              ) : (
                <>
                  {renderMobileMenuItem(
                    "/sign-in",
                    "Sign In",
                    "Access your account",
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m0 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  )}
                  <a
                    href="/sign-up"
                    className="mt-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 ease-out inline-flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                    onClick={closeMenu}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    <span>Create Account</span>
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header
      className={`${headerStyles.base} ${headerStyles.visibility} ${headerStyles.background}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {renderLogo()}
          {renderDesktopNavigation()}
          {renderMobileControls()}
        </div>
        {renderMobileMenu()}
      </div>
    </header>
  );
}
