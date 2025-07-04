import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { SidebarContext, useSidebar } from "./SidebarContext";

// Enhanced Sidebar Provider with CSS-only mobile detection to prevent flicker
export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Start with sidebar collapsed
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    // On mobile, toggle the mobile overlay
    // On desktop, toggle the collapsed state
    if (window.innerWidth < 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  // Close mobile sidebar when clicking outside or on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMobileSidebar();
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleSidebar,
        isMobileOpen,
        closeMobileSidebar,
      }}
    >
      <div className="flex h-screen bg-gray-50">
        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden"
            onClick={closeMobileSidebar}
          />
        )}
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

export const SidebarInset = ({ children }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out 
        ml-0 md:ml-16 ${!isCollapsed ? "md:ml-64" : ""}`}
    >
      {children}
    </div>
  );
};

export const SidebarTrigger = ({ className = "" }) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className={`p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center ${className}`}
      aria-label="Toggle sidebar"
    >
      <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  );
};
