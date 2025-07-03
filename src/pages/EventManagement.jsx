"use client";

import { useState, useEffect, createContext, useContext } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  ArrowLeft,
  Youtube,
  Upload,
  ImageIcon,
  Bell,
  Users,
  Heart,
  TrendingUp,
  TrendingDown,
  CreditCard,
  UserPlus,
  Home,
  BarChart3,
  Settings,
  Menu,
} from "lucide-react";

// Sidebar Context for managing toggle state
const SidebarContext = createContext();

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// Custom Breadcrumb Components
const Breadcrumb = ({ children, className = "" }) => (
  <nav className={`flex ${className}`} aria-label="Breadcrumb">
    {children}
  </nav>
);

const BreadcrumbList = ({ children }) => (
  <ol className="flex items-center space-x-1 text-sm text-gray-600">
    {children}
  </ol>
);

const BreadcrumbItem = ({ children }) => (
  <li className="flex items-center">{children}</li>
);

const BreadcrumbPage = ({ children }) => (
  <span className="font-medium text-gray-900">{children}</span>
);

// Custom Separator Component
const Separator = ({ orientation = "horizontal", className = "" }) => (
  <div
    className={`bg-gray-200 ${
      orientation === "vertical" ? "w-px h-4" : "h-px w-full"
    } ${className}`}
  />
);

// Enhanced Sidebar Provider with smooth mobile transitions
const SidebarProvider = ({ children }) => {
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

const SidebarInset = ({ children }) => {
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

const SidebarTrigger = ({ className = "" }) => {
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

// Enhanced App Sidebar Component with smooth mobile transitions
const AppSidebar = ({ onNavigate, currentView }) => {
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

// Enhanced Analytics Widget Component
function AnalyticsWidget({ data }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-2xl animate-on-scroll">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-black">Analytics Overview</h3>
          <p className="text-sm text-gray-600">
            Your event performance insights
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((metric, index) => (
          <div key={metric.title} className="text-center group">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 mb-4 group-hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${
                  metric.color === "text-blue-600"
                    ? "from-blue-100 to-blue-200"
                    : metric.color === "text-green-600"
                    ? "from-green-100 to-green-200"
                    : metric.color === "text-purple-600"
                    ? "from-purple-100 to-purple-200"
                    : "from-pink-100 to-pink-200"
                } mb-3`}
              >
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div
                className={`flex items-center justify-center gap-1 text-xs font-semibold ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                } mb-2`}
              >
                {metric.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{metric.change}</span>
              </div>
              <p className="text-xs text-gray-600 font-medium mb-1">
                {metric.title}
              </p>
              <p className="text-2xl font-bold text-black">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Notifications Dropdown Component
function NotificationsDropdown({ notifications }) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-gray-200 z-50">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg text-black">Notifications</h3>
            <p className="text-sm text-gray-600">
              Stay updated with your events
            </p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                  notification.unread ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                    <notification.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-black">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {notification.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 font-medium">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Analytics data
const analyticsData = [
  {
    title: "Total Events",
    value: "24",
    change: "+12.5%",
    trend: "up",
    icon: Calendar,
    color: "text-blue-600",
  },
  {
    title: "Attendees",
    value: "1,247",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-green-600",
  },
  {
    title: "Revenue",
    value: "$12.4K",
    change: "+15.3%",
    trend: "up",
    icon: TrendingUp,
    color: "text-purple-600",
  },
  {
    title: "Satisfaction",
    value: "94%",
    change: "-2.1%",
    trend: "down",
    icon: Heart,
    color: "text-pink-600",
  },
];

// Notifications data
const notifications = [
  {
    id: 1,
    title: "New Event Registration",
    description: "John Doe registered for Annual Company Retreat",
    time: "2 minutes ago",
    unread: true,
    icon: UserPlus,
  },
  {
    id: 2,
    title: "Event Update",
    description: "Product Launch Event venue has been changed",
    time: "1 hour ago",
    unread: true,
    icon: Calendar,
  },
  {
    id: 3,
    title: "Payment Received",
    description: "Payment of $299 received for Digital Marketing Workshop",
    time: "3 hours ago",
    unread: false,
    icon: CreditCard,
  },
];

// Main Event Management Component
export default function EventManagement() {
  const [currentView, setCurrentView] = useState("list");
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Annual Company Retreat",
      venue: "Mountain View Resort",
      date: "2024-03-15",
      startTime: "09:00",
      endTime: "17:00",
      description:
        "Join us for our annual company retreat featuring team building activities, workshops, and networking opportunities.",
      location: "Mountain View Resort, 123 Resort Drive, Aspen, CO",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      image: "/placeholder.svg?height=200&width=400",
      mapImage: null,
    },
    {
      id: 2,
      name: "Product Launch Event",
      venue: "Tech Conference Center",
      date: "2024-04-20",
      startTime: "14:00",
      endTime: "18:00",
      description:
        "Exciting product launch event showcasing our latest innovations and future roadmap.",
      location:
        "Tech Conference Center, 456 Innovation Blvd, San Francisco, CA",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      image: "/placeholder.svg?height=200&width=400",
      mapImage: null,
    },
    {
      id: 3,
      name: "Digital Marketing Workshop",
      venue: "Creative Hub Downtown",
      date: "2024-05-10",
      startTime: "10:00",
      endTime: "16:00",
      description:
        "Learn the latest digital marketing strategies and tools from industry experts.",
      location: "Creative Hub Downtown, 789 Innovation Street, New York, NY",
      youtubeUrl: "",
      image: "/placeholder.svg?height=200&width=400",
      mapImage: null,
    },
  ]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    venue: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    location: "",
    youtubeUrl: "",
    image: "",
    mapImage: "",
  });

  // Add scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [currentView]);

  // Hide header when component mounts
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "none";
    }

    return () => {
      if (header) {
        header.style.display = "block";
      }
    };
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      venue: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      location: "",
      youtubeUrl: "",
      image: "",
      mapImage: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateEvent = () => {
    setCurrentView("create");
    resetForm();
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData(event);
    setCurrentView("edit");
  };

  const handleDeleteEvent = (eventId) => {
    console.log("Deleting event with ID:", eventId); // Debug log
    console.log("Current events:", events); // Debug log

    if (window.confirm("Are you sure you want to delete this event?")) {
      const updatedEvents = events.filter((event) => {
        console.log("Checking event:", event.id, "against:", eventId); // Debug log
        return event.id !== eventId;
      });

      console.log("Updated events:", updatedEvents); // Debug log
      setEvents(updatedEvents);
    }
  };

  const handleSaveEvent = () => {
    if (currentView === "create") {
      const newEvent = {
        ...formData,
        id: Date.now(),
      };
      setEvents([...events, newEvent]);
    } else if (currentView === "edit") {
      setEvents(
        events.map((event) =>
          event.id === editingEvent.id
            ? { ...formData, id: editingEvent.id }
            : event
        )
      );
    }
    setCurrentView("list");
    resetForm();
    setEditingEvent(null);
  };

  const handleCancel = () => {
    setCurrentView("list");
    resetForm();
    setEditingEvent(null);
  };

  const handleNavigation = (view) => {
    if (view === "create") {
      handleCreateEvent();
    } else {
      setCurrentView(view);
    }
  };

  const getYouTubeVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Event List View
  if (currentView === "list") {
    return (
      <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans']">
        <style jsx>{`
          .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
            transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          .animate-on-scroll.delay-100 {
            transition-delay: 0.1s;
          }

          .animate-on-scroll.delay-200 {
            transition-delay: 0.2s;
          }

          .animate-on-scroll.delay-300 {
            transition-delay: 0.3s;
          }

          .animate-on-scroll.delay-400 {
            transition-delay: 0.4s;
          }

          .animate-on-scroll.delay-500 {
            transition-delay: 0.5s;
          }

          .animate-on-scroll.delay-600 {
            transition-delay: 0.6s;
          }
        `}</style>

        <SidebarProvider>
          <AppSidebar onNavigate={handleNavigation} currentView={currentView} />
          <SidebarInset>
            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              {/* Header */}
              <div className="flex h-16 shrink-0 items-center gap-2 bg-white border-b border-gray-200 px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto flex items-center gap-3">
                  <NotificationsDropdown notifications={notifications} />
                </div>
              </div>

              {/* Main Content Section */}
              <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-12 animate-on-scroll">
                    <div>
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[120%] tracking-[-1.5px] sm:tracking-[-2.5px] text-gray-900 mb-4">
                        Your Events
                      </h2>
                      <p className="text-lg text-gray-600">
                        Manage all your events in one place
                      </p>
                    </div>
                    <button
                      onClick={handleCreateEvent}
                      className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 shadow-lg animate-on-scroll delay-200 w-fit"
                    >
                      <Plus className="w-5 h-5" />
                      Create Event
                    </button>
                  </div>

                  {/* Analytics Widget */}
                  <div className="mb-12">
                    <AnalyticsWidget data={analyticsData} />
                  </div>

                  {/* Events Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event, index) => (
                      <div
                        key={event.id}
                        className={`bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-on-scroll delay-${
                          200 + index * 100
                        }`}
                      >
                        {/* Event Image */}
                        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
                          <img
                            src={
                              event.image ||
                              "/placeholder.svg?height=200&width=400"
                            }
                            alt={event.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4 flex gap-2">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white rounded-2xl transition-colors shadow-lg hover:shadow-xl"
                              aria-label="Edit event"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEvent(event.id);
                              }}
                              className="p-2 bg-white/90 backdrop-blur-sm text-red-600 hover:bg-white rounded-2xl transition-colors shadow-lg hover:shadow-xl"
                              aria-label="Delete event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Event Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-black mb-4">
                            {event.name}
                          </h3>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-medium">
                                {event.venue}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="text-sm font-medium">
                                {formatDate(event.date)}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                                <Clock className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="text-sm font-medium">
                                {formatTime(event.startTime)} -{" "}
                                {formatTime(event.endTime)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {events.length === 0 && (
                    <div className="text-center py-20 animate-on-scroll">
                      <div className="bg-white rounded-3xl p-12 max-w-md mx-auto border border-gray-200 shadow-2xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <Calendar className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2">
                          No Events Yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Get started by creating your first event
                        </p>
                        <button
                          onClick={handleCreateEvent}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                          Create Your First Event
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    );
  }

  // Create/Edit Event Form View
  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans']">
      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .animate-on-scroll.delay-100 {
          transition-delay: 0.1s;
        }

        .animate-on-scroll.delay-200 {
          transition-delay: 0.2s;
        }

        .animate-on-scroll.delay-300 {
          transition-delay: 0.3s;
        }

        .animate-on-scroll.delay-400 {
          transition-delay: 0.4s;
        }
      `}</style>

      <SidebarProvider>
        <AppSidebar onNavigate={handleNavigation} currentView={currentView} />
        <SidebarInset>
          {/* Header */}
          <div className="flex h-16 shrink-0 items-center gap-2 bg-white border-b border-gray-200 px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {currentView === "create" ? "Create Event" : "Edit Event"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {/* Form Section */}
            <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                {/* Header with Back Button */}
                <div className="flex items-center gap-4 mb-12 animate-on-scroll">
                  <button
                    onClick={handleCancel}
                    className="p-3 text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
                    aria-label="Go back to events list"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[120%] tracking-[-1.5px] sm:tracking-[-2.5px] text-gray-900 mb-2">
                      {currentView === "create"
                        ? "Create New Event"
                        : "Edit Event"}
                    </h2>
                    <p className="text-lg text-gray-600">
                      Fill in the information below to{" "}
                      {currentView === "create" ? "create" : "update"} your
                      event
                    </p>
                  </div>
                </div>

                {/* Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveEvent();
                  }}
                  className="bg-white rounded-3xl p-8 md:p-12 animate-on-scroll delay-200 border border-gray-200 shadow-2xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Event Image Upload */}
                    <div className="md:col-span-2">
                      <label className="block text-black font-bold mb-4 text-lg">
                        Event Image
                      </label>
                      <div className="relative">
                        {formData.image ? (
                          <div className="relative">
                            <img
                              src={formData.image || "/placeholder.svg"}
                              alt="Event preview"
                              className="w-full h-48 object-cover rounded-3xl border border-gray-200 shadow-lg"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, image: "" }))
                              }
                              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors shadow-lg"
                              aria-label="Remove image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-blue-400 transition-colors bg-gradient-to-br from-gray-50 to-white">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                              <ImageIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-gray-600 mb-6 font-medium">
                              Upload an event image
                            </p>
                            <label className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer inline-flex items-center gap-2">
                              <Upload className="w-5 h-5" />
                              Choose Image
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, "image")}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Event Name */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="name"
                        className="block text-black font-bold mb-4 text-lg"
                      >
                        Event Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter event name"
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium"
                        required
                      />
                    </div>

                    {/* Venue Name */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="venue"
                        className="block text-black font-bold mb-4 text-lg"
                      >
                        Venue Name *
                      </label>
                      <input
                        type="text"
                        id="venue"
                        name="venue"
                        value={formData.venue}
                        onChange={handleInputChange}
                        placeholder="Enter venue name"
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium"
                        required
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-black font-bold mb-4 text-lg"
                      >
                        Event Date *
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium"
                        required
                      />
                    </div>

                    {/* Start Time */}
                    <div>
                      <label
                        htmlFor="startTime"
                        className="block text-black font-bold mb-4 text-lg"
                      >
                        Start Time *
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium"
                        required
                      />
                    </div>

                    {/* End Time */}
                    <div>
                      <label
                        htmlFor="endTime"
                        className="block text-black font-bold mb-4 text-lg"
                      >
                        End Time *
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium"
                        required
                      />
                    </div>

                    {/* Location for Maps */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="location"
                        className="block text-black font-bold mb-4 text-lg"
                      >
                        Full Address
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Enter full address for Google Maps"
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium"
                      />
                      <p className="text-sm text-gray-600 mt-3 font-medium">
                        Enter a complete address to show the location on the map
                      </p>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="description"
                        className="block text-black font-bold mb-4 text-lg"
                      >
                        Event Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your event..."
                        rows="4"
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors resize-none bg-gray-50 font-medium"
                      />
                    </div>

                    {/* YouTube URL */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="youtubeUrl"
                        className="block text-black font-bold mb-4 text-lg"
                      >
                        YouTube Video URL
                      </label>
                      <input
                        type="url"
                        id="youtubeUrl"
                        name="youtubeUrl"
                        value={formData.youtubeUrl}
                        onChange={handleInputChange}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium"
                      />
                    </div>
                  </div>

                  {/* YouTube Preview */}
                  {formData.youtubeUrl &&
                    getYouTubeVideoId(formData.youtubeUrl) && (
                      <div className="mt-12 animate-on-scroll delay-400">
                        <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                            <Youtube className="w-5 h-5 text-red-600" />
                          </div>
                          Video Preview
                        </h3>
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-200 shadow-lg">
                          <iframe
                            src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                              formData.youtubeUrl
                            )}`}
                            width="100%"
                            height="315"
                            style={{ border: 0, borderRadius: "20px" }}
                            allowFullScreen
                            title="Event Video Preview"
                          />
                        </div>
                      </div>
                    )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={
                        !formData.name ||
                        !formData.venue ||
                        !formData.date ||
                        !formData.startTime ||
                        !formData.endTime
                      }
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Save className="w-5 h-5" />
                      {currentView === "create"
                        ? "Create Event"
                        : "Update Event"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
