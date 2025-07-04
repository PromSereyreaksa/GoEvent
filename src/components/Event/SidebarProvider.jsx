import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { SidebarContext, useSidebar } from "./SidebarContext";

// Enhanced Sidebar Provider with smooth mobile transitions
export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        toggleSidebar,
        isMobile,
        isMobileOpen,
        closeMobileSidebar,
      }}
    >
      <div className="flex h-screen bg-gray-50">
        {/* Mobile Overlay */}
        {isMobile && isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={closeMobileSidebar}
          />
        )}
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

export const SidebarInset = ({ children }) => {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <div
      className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out ${
        isMobile ? "ml-0" : isCollapsed ? "ml-16" : "ml-64"
      }`}
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
      className={`p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors ${className}`}
      aria-label="Toggle sidebar"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
};
