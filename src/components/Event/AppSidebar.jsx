import { Calendar, Plus, Home, BarChart3, Settings, X } from "lucide-react";
import { useSidebar } from "./SidebarContext";

// Enhanced App Sidebar Component with smooth mobile transitions
export const AppSidebar = ({ onNavigate, currentView }) => {
  const {
    isCollapsed,
    toggleSidebar,
    isMobile,
    isMobileOpen,
    closeMobileSidebar,
  } = useSidebar();

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: Home,
      view: "list",
      isActive: currentView === "list",
    },
    {
      title: "Create Event",
      icon: Plus,
      view: "create",
      isActive: currentView === "create",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      view: "analytics",
      isActive: false,
    },
    {
      title: "Settings",
      icon: Settings,
      view: "settings",
      isActive: false,
    },
  ];

  const handleNavigation = (view) => {
    onNavigate(view);
    if (isMobile) {
      closeMobileSidebar();
    }
  };

  const sidebarSections = [
    {
      type: "navigation",
      items: sidebarItems,
    },
    {
      type: "profile",
      user: {
        name: "Prom Sereyreaksa",
        email: "prumsereyreaksa@gmail.com",
        avatar: "reaksa.jpg",
      },
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 flex flex-col z-50 shadow-2xl transition-all duration-300 ease-in-out ${
        isMobile
          ? `w-64 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`
          : isCollapsed
          ? "w-16"
          : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <a href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div>
              <h1 className="font-bold text-gray-900 text-lg">GoEvent</h1>
              <p className="text-xs text-gray-600">Event Management</p>
            </div>
          )}
        </a>

        {isMobile && (
          <button
            onClick={closeMobileSidebar}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {sidebarSections.map((section, idx) => {
        if (section.type === "navigation") {
          return (
            <nav className="flex-1 p-4" key={idx}>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.title}>
                    <button
                      onClick={() => handleNavigation(item.view)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 group ${
                        item.isActive
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-50 hover:shadow-md"
                      } ${!isMobile && isCollapsed ? "justify-center" : ""}`}
                      title={!isMobile && isCollapsed ? item.title : ""}
                    >
                      <item.icon className={`w-5 h-5 flex-shrink-0`} />
                      {(!isCollapsed || isMobile) && (
                        <span className="font-semibold truncate">
                          {item.title}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          );
        }
        if (section.type === "profile" && (!isCollapsed || isMobile)) {
          return (
            <div className="p-4 border-t border-gray-200" key={idx}>
              <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {section.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {section.user.name}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {section.user.email}
                  </p>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })}
    </aside>
  );
};
