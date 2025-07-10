"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchGuests } from "../redux/slices/guestSlice";
import { fetchEvents } from "../redux/slices/eventSlice";
import {
  Users,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Download,
  Upload,
  Menu,
  X,
  Filter,
  Send,
  ArrowLeft,
} from "lucide-react";
import { SidebarProvider } from "../components/shared/SidebarProvider";
import AppSidebar from "../components/layout/AppSidebar";

// Add custom styles for mobile touch targets and responsiveness
const mobileStyles = `
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
  
  @media (max-width: 640px) {
    .mobile-scroll {
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
    }
    
    .table-container {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
  
  .animate-in {
    animation-fill-mode: both;
  }
  
  .fade-in {
    animation: fadeIn 0.3s ease-out;
  }
  
  .zoom-in-95 {
    animation: zoomIn95 0.3s ease-out;
  }
  
  .slide-in-from-bottom-4 {
    animation: slideInFromBottom4 0.3s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes zoomIn95 {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes slideInFromBottom4 {
    from { opacity: 0; transform: translateY(1rem); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Guests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Hide header when component mounts
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "block";
    };
  }, []);

  // Hide footer
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";
    return () => {
      if (footer) footer.style.display = "block";
    };
  }, []);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchEvents());
    // Note: fetchGuests is typically called per event, but for now we'll use local state
  }, [dispatch]);

  // Redux selectors
  const { guests = [] } = useSelector((state) => state.guests || {});
  const { events = [] } = useSelector((state) => state.events || {});
  const { user } = useSelector((state) => state.auth || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Handle search from URL params (from global search)
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) setSearchTerm(searchQuery);
  }, [searchParams]);

  // Guest form state
  const [guestForm, setGuestForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventId: "",
    status: "pending",
    checkedIn: false,
  });

  // Filter guests based on search and filters
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || guest.status === statusFilter;
    const matchesEvent =
      eventFilter === "all" ||
      guest.eventId === eventFilter ||
      String(guest.eventId) === String(eventFilter);
    return matchesSearch && matchesStatus && matchesEvent;
  });

  // Calculate stats based on filtered event
  const eventSpecificGuests =
    eventFilter === "all"
      ? guests
      : guests.filter(
          (g) =>
            g.eventId === eventFilter ||
            String(g.eventId) === String(eventFilter)
        );
  const stats = {
    total: eventSpecificGuests.length,
    confirmed: eventSpecificGuests.filter((g) => g.status === "confirmed")
      .length,
    pending: eventSpecificGuests.filter((g) => g.status === "pending").length,
    declined: eventSpecificGuests.filter((g) => g.status === "declined").length,
    checkedIn: eventSpecificGuests.filter((g) => g.checkedIn).length,
  };

  const handleInviteGuest = async (e) => {
    e.preventDefault();
    try {
      // Ensure eventId is properly validated
      const selectedEvent = events.find(
        (e) =>
          e.id === guestForm.eventId ||
          String(e.id) === String(guestForm.eventId)
      );

      if (!guestForm.eventId || !selectedEvent) {
        alert("Please select a valid event");
        return;
      }

      const newGuest = {
        id: Date.now().toString(),
        ...guestForm,
        eventId: selectedEvent.id, // Use the actual event ID from the selected event
        invitedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch({ type: "guests/addGuest", payload: newGuest });
      setGuestForm({
        name: "",
        email: "",
        phone: "",
        eventId: "",
        status: "pending",
        checkedIn: false,
      });
      setShowInviteModal(false);
      console.log(`Guest ${newGuest.name} invited successfully!`);
    } catch (error) {
      console.error("Failed to invite guest:", error);
    }
  };

  const handleEditGuest = (e) => {
    e.preventDefault();

    // Ensure eventId is properly validated
    const selectedEvent = events.find(
      (e) =>
        e.id === guestForm.eventId || String(e.id) === String(guestForm.eventId)
    );

    if (!guestForm.eventId || !selectedEvent) {
      alert("Please select a valid event");
      return;
    }

    const updatedGuest = {
      ...editingGuest,
      ...guestForm,
      eventId: selectedEvent.id, // Use the actual event ID from the selected event
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "guests/updateGuest", payload: updatedGuest });
    setShowEditModal(false);
    setEditingGuest(null);
    setGuestForm({
      name: "",
      email: "",
      phone: "",
      eventId: "",
      status: "pending",
      checkedIn: false,
    });
  };

  const handleDeleteGuest = (guestId) => {
    if (window.confirm("Are you sure you want to delete this guest?")) {
      dispatch({ type: "guests/removeGuest", payload: guestId });
    }
  };

  // Import/Export functionality for guests
  const handleExportGuests = () => {
    if (guests.length === 0) {
      alert("No guests to export");
      return;
    }
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Event",
      "Status",
      "Checked In",
      "Invited At",
    ];
    const csvContent = [
      headers.join(","),
      ...guests.map((guest) => {
        const eventName =
          events.find((e) => e.id === guest.eventId)?.title || "No Event";
        return [
          guest.id,
          `"${guest.name || ""}"`,
          `"${guest.email || ""}"`,
          `"${guest.phone || ""}"`,
          `"${eventName}"`,
          guest.status || "",
          guest.checkedIn ? "Yes" : "No",
          guest.invitedAt || "",
        ].join(",");
      }),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `guests_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportGuests = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      alert("Please select a CSV file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split("\n");
        const headers = lines[0].split(",");
        if (!headers.includes("Name") && !headers.includes("name")) {
          alert("CSV must contain a 'Name' column");
          return;
        }
        alert(
          `CSV file "${file.name}" processed successfully! ${
            lines.length - 1
          } guests found. (Note: This is a demo - actual import would require backend implementation)`
        );
        event.target.value = "";
      } catch (error) {
        alert("Error processing CSV file. Please check the format.");
      }
    };
    reader.readAsText(file);
  };

  const handleBulkAction = (action) => {
    selectedGuests.forEach((guestId) => {
      const guest = guests.find((g) => g.id === guestId);
      if (guest) {
        const updatedGuest = { ...guest };
        switch (action) {
          case "confirm":
            updatedGuest.status = "confirmed";
            break;
          case "decline":
            updatedGuest.status = "declined";
            break;
          case "checkin":
            updatedGuest.checkedIn = true;
            break;
          case "delete":
            dispatch({ type: "guests/removeGuest", payload: guestId });
            return;
        }
        if (action !== "delete") {
          updatedGuest.updatedAt = new Date().toISOString();
          dispatch({ type: "guests/updateGuest", payload: updatedGuest });
        }
      }
    });
    setSelectedGuests([]);
  };

  const openEditModal = (guest) => {
    setEditingGuest(guest);
    setGuestForm({
      name: guest.name,
      email: guest.email,
      phone: guest.phone || "",
      eventId: guest.eventId,
      status: guest.status,
      checkedIn: guest.checkedIn,
    });
    setShowEditModal(true);
  };

  const getEventName = (eventId) => {
    if (!eventId) return "No Event";

    // Handle both string and number eventId
    const event = events.find(
      (e) =>
        e.id === eventId ||
        e.id === String(eventId) ||
        String(e.id) === String(eventId)
    );
    return event ? event.title : "Unknown Event";
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        icon: Clock,
      },
      confirmed: {
        color: "bg-green-50 text-green-700 border border-green-200",
        icon: CheckCircle,
      },
      declined: {
        color: "bg-red-50 text-red-700 border border-red-200",
        icon: XCircle,
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const selectedEventName =
    eventFilter !== "all" ? getEventName(eventFilter) : "All Events";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 w-full">
        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />

        {/* Main Content - full width with proper margins */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out min-h-screen w-full ${
            sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          }`}
        >
          <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6">
            {/* Mobile Menu */}
            <div className="flex items-center gap-4 mb-6 lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    // Go back to the previous page if possible, otherwise fallback to dashboard
                    if (window.history.length > 2) {
                      window.history.back();
                    } else {
                      navigate("/dashboard");
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Guest Management
                  </h1>
                  <p className="text-gray-600">
                    {eventFilter !== "all"
                      ? `Managing guests for ${selectedEventName}`
                      : "Manage attendees and guest lists for your events"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4 md:mt-0 w-full sm:w-auto">
                <label className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-sm sm:text-base min-h-[44px]">
                  <Upload className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">Import</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportGuests}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleExportGuests}
                  disabled={guests.length === 0}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px]"
                  title="Export guests to CSV"
                >
                  <Download className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">Export</span>
                </button>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium min-h-[44px] shadow-sm hover:shadow-md"
                >
                  <Send className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">Invite Guest</span>
                </button>
              </div>
            </div>

            {/* Event Filter Banner */}
            {eventFilter !== "all" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 sm:px-6 py-3 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-900">
                      Viewing guests for:{" "}
                      <span className="font-semibold">{selectedEventName}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setEventFilter("all")}
                    className="text-sm text-blue-700 hover:text-blue-800 font-medium underline sm:no-underline"
                  >
                    View All Events
                  </button>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                      Total Guests
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {stats.total}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-lg flex items-center justify-center mt-2 sm:mt-0 sm:ml-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                      Confirmed
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                      {stats.confirmed}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-50 rounded-lg flex items-center justify-center mt-2 sm:mt-0 sm:ml-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                      Pending
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">
                      {stats.pending}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-50 rounded-lg flex items-center justify-center mt-2 sm:mt-0 sm:ml-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                      Declined
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">
                      {stats.declined}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-red-50 rounded-lg flex items-center justify-center mt-2 sm:mt-0 sm:ml-2">
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200 col-span-2 sm:col-span-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                      Checked In
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                      {stats.checkedIn}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-50 rounded-lg flex items-center justify-center mt-2 sm:mt-0 sm:ml-2">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6">
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search guests by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 flex-1 sm:flex-none">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="flex-1 sm:w-auto sm:min-w-[140px] px-3 sm:px-4 py-2 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>

                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    className="px-3 sm:px-4 py-2 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm sm:text-base flex-1 sm:flex-none sm:min-w-[160px]"
                  >
                    <option value="all">All Events</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedGuests.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedGuests.length} guest
                    {selectedGuests.length !== 1 ? "s" : ""} selected
                  </span>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleBulkAction("confirm")}
                      className="flex-1 sm:flex-none px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors touch-target"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleBulkAction("decline")}
                      className="flex-1 sm:flex-none px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors touch-target"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleBulkAction("checkin")}
                      className="flex-1 sm:flex-none px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors touch-target"
                    >
                      Check In
                    </button>
                    <button
                      onClick={() => handleBulkAction("delete")}
                      className="flex-1 sm:flex-none px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors touch-target"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedGuests([])}
                      className="flex items-center justify-center p-1.5 text-gray-600 hover:text-gray-800 transition-colors touch-target"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Guests Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {filteredGuests.length === 0 ? (
                <div className="text-center py-8 sm:py-12 px-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                    No guests found
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base max-w-md mx-auto">
                    {guests.length === 0
                      ? "Get started by inviting your first guest."
                      : eventFilter !== "all"
                      ? `No guests found for ${selectedEventName}. Try selecting a different event or invite guests to this event.`
                      : "Try adjusting your search or filter criteria."}
                  </p>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    <Send className="w-4 h-4" />
                    {eventFilter !== "all"
                      ? `Invite Guest to ${selectedEventName}`
                      : "Invite First Guest"}
                  </button>
                </div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="block sm:hidden">
                    <div className="p-3">
                      {/* Mobile Select All */}
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <input
                            type="checkbox"
                            checked={
                              selectedGuests.length === filteredGuests.length &&
                              filteredGuests.length > 0
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedGuests(
                                  filteredGuests.map((g) => g.id)
                                );
                              } else {
                                setSelectedGuests([]);
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          Select All
                        </label>
                        <span className="text-sm text-gray-500">
                          {filteredGuests.length} guests
                        </span>
                      </div>

                      {/* Mobile Guest Cards */}
                      <div className="space-y-3">
                        {filteredGuests.map((guest) => (
                          <div
                            key={guest.id}
                            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md hover:bg-blue-50 transition-all duration-200"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3 flex-1">
                                <input
                                  type="checkbox"
                                  checked={selectedGuests.includes(guest.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedGuests([
                                        ...selectedGuests,
                                        guest.id,
                                      ]);
                                    } else {
                                      setSelectedGuests(
                                        selectedGuests.filter(
                                          (id) => id !== guest.id
                                        )
                                      );
                                    }
                                  }}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                  {guest.name?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-semibold text-gray-900 truncate">
                                    {guest.name}
                                  </div>
                                  <div className="text-xs text-gray-600 truncate flex items-center gap-1 mt-1">
                                    <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                    <span className="truncate">
                                      {guest.email}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  const dropdown = document.getElementById(
                                    `mobile-dropdown-${guest.id}`
                                  );
                                  dropdown?.classList.toggle("hidden");
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded touch-target"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-gray-500 font-medium">
                                  Event:
                                </span>
                                <div className="font-semibold text-gray-900 truncate mt-1">
                                  {getEventName(guest.eventId)}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500 font-medium">
                                  Status:
                                </span>
                                <div className="mt-1">
                                  {getStatusBadge(guest.status)}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500 font-medium">
                                  Check-in:
                                </span>
                                <div className="mt-1">
                                  {guest.checkedIn ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-800 border border-green-200 shadow-sm">
                                      <UserCheck className="w-3 h-3 flex-shrink-0" />
                                      <span className="hidden sm:inline">
                                        Checked In
                                      </span>
                                      <span className="sm:hidden">✓</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                      <Clock className="w-3 h-3 flex-shrink-0 text-gray-400" />
                                      <span className="hidden sm:inline">
                                        Not checked in
                                      </span>
                                      <span className="sm:hidden">–</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500 font-medium">
                                  Invited:
                                </span>
                                <div className="font-semibold text-gray-700 mt-1">
                                  {guest.invitedAt
                                    ? new Date(
                                        guest.invitedAt
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </div>
                              </div>
                            </div>

                            {/* Mobile Actions Dropdown */}
                            <div
                              id={`mobile-dropdown-${guest.id}`}
                              className="hidden mt-3 pt-3 border-t border-gray-200"
                            >
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => {
                                    openEditModal(guest);
                                    document
                                      .getElementById(
                                        `mobile-dropdown-${guest.id}`
                                      )
                                      ?.classList.add("hidden");
                                  }}
                                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                                {!guest.checkedIn && (
                                  <button
                                    onClick={() => {
                                      const updatedGuest = {
                                        ...guest,
                                        checkedIn: true,
                                        updatedAt: new Date().toISOString(),
                                      };
                                      dispatch({
                                        type: "guests/updateGuest",
                                        payload: updatedGuest,
                                      });
                                      document
                                        .getElementById(
                                          `mobile-dropdown-${guest.id}`
                                        )
                                        ?.classList.add("hidden");
                                    }}
                                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                  >
                                    <UserCheck className="w-4 h-4" />
                                    Check In
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    handleDeleteGuest(guest.id);
                                    document
                                      .getElementById(
                                        `mobile-dropdown-${guest.id}`
                                      )
                                      ?.classList.add("hidden");
                                  }}
                                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors col-span-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete Guest
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
                    <table className="w-full">
                      <thead className="bg-gradient-to-b from-blue-600 via-blue-400 to-blue-200">
                        <tr>
                          <th className="px-4 lg:px-6 py-4 text-left">
                            <input
                              type="checkbox"
                              checked={
                                selectedGuests.length ===
                                  filteredGuests.length &&
                                filteredGuests.length > 0
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedGuests(
                                    filteredGuests.map((g) => g.id)
                                  );
                                } else {
                                  setSelectedGuests([]);
                                }
                              }}
                              className="rounded border-white/30 text-white focus:ring-blue-300 focus:ring-offset-0 bg-white/20"
                            />
                          </th>
                          <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                            Guest
                          </th>
                          <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                            Event
                          </th>
                          <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                            Check-in
                          </th>
                          <th className="px-4 lg:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                            Invited
                          </th>
                          <th className="px-4 lg:px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredGuests.map((guest) => (
                          <tr
                            key={guest.id}
                            className="hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
                          >
                            <td className="px-4 lg:px-6 py-5">
                              <input
                                type="checkbox"
                                checked={selectedGuests.includes(guest.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedGuests([
                                      ...selectedGuests,
                                      guest.id,
                                    ]);
                                  } else {
                                    setSelectedGuests(
                                      selectedGuests.filter(
                                        (id) => id !== guest.id
                                      )
                                    );
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                              />
                            </td>
                            <td className="px-4 lg:px-6 py-5">
                              <div className="flex items-center">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4 shadow-md">
                                  {guest.name?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-semibold text-gray-900 truncate">
                                    {guest.name}
                                  </div>
                                  <div className="text-sm text-gray-600 flex items-center gap-1 truncate mt-1">
                                    <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                    <span className="truncate">
                                      {guest.email}
                                    </span>
                                  </div>
                                  {guest.phone && (
                                    <div className="text-sm text-gray-600 flex items-center gap-1 truncate mt-1">
                                      <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                      <span className="truncate">
                                        {guest.phone}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-5">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                {getEventName(guest.eventId)}
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-5">
                              {getStatusBadge(guest.status)}
                            </td>
                            <td className="px-4 lg:px-6 py-5">
                              {guest.checkedIn ? (
                                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-800 border border-green-200 shadow-sm">
                                  <UserCheck className="w-3 h-3 flex-shrink-0" />
                                  <span className="hidden sm:inline">
                                    Checked In
                                  </span>
                                  <span className="sm:hidden">✓</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                  <Clock className="w-3 h-3 flex-shrink-0 text-gray-400" />
                                  <span className="hidden sm:inline">
                                    Not checked in
                                  </span>
                                  <span className="sm:hidden">–</span>
                                </span>
                              )}
                            </td>
                            <td className="px-4 lg:px-6 py-5">
                              <div className="text-sm font-medium text-gray-700">
                                {guest.invitedAt
                                  ? new Date(
                                      guest.invitedAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-5 text-right">
                              <div className="relative inline-block text-left">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const dropdown = document.getElementById(
                                      `dropdown-${guest.id}`
                                    );
                                    // Close all other dropdowns
                                    document
                                      .querySelectorAll(".guest-dropdown")
                                      .forEach((el) => {
                                        if (el !== dropdown)
                                          el.classList.add("hidden");
                                      });
                                    if (dropdown) {
                                      // Responsive: open up if near bottom
                                      const rect =
                                        e.target.getBoundingClientRect();
                                      const windowHeight = window.innerHeight;
                                      if (windowHeight - rect.bottom < 200) {
                                        dropdown.classList.add("dropdown-up");
                                      } else {
                                        dropdown.classList.remove(
                                          "dropdown-up"
                                        );
                                      }
                                      dropdown.classList.toggle("hidden");
                                    }
                                    // Add outside click handler
                                    const handleClick = (event) => {
                                      if (!dropdown.contains(event.target)) {
                                        dropdown.classList.add("hidden");
                                        document.removeEventListener(
                                          "mousedown",
                                          handleClick
                                        );
                                      }
                                    };
                                    setTimeout(() => {
                                      document.addEventListener(
                                        "mousedown",
                                        handleClick
                                      );
                                    }, 0);
                                  }}
                                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                                <div
                                  id={`dropdown-${guest.id}`}
                                  className="guest-dropdown hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                                  style={{ zIndex: 100 }}
                                >
                                  <div className="py-1">
                                    <button
                                      onClick={() => {
                                        openEditModal(guest);
                                        document
                                          .getElementById(
                                            `dropdown-${guest.id}`
                                          )
                                          ?.classList.add("hidden");
                                      }}
                                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                      <Edit className="w-4 h-4 text-gray-400" />
                                      Edit Guest
                                    </button>
                                    {!guest.checkedIn && (
                                      <button
                                        onClick={() => {
                                          const updatedGuest = {
                                            ...guest,
                                            checkedIn: true,
                                            updatedAt: new Date().toISOString(),
                                          };
                                          dispatch({
                                            type: "guests/updateGuest",
                                            payload: updatedGuest,
                                          });
                                          document
                                            .getElementById(
                                              `dropdown-${guest.id}`
                                            )
                                            ?.classList.add("hidden");
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                      >
                                        <UserCheck className="w-4 h-4 text-gray-400" />
                                        Check In
                                      </button>
                                    )}
                                    <hr className="my-1" />
                                    <button
                                      onClick={() => {
                                        handleDeleteGuest(guest.id);
                                        document
                                          .getElementById(
                                            `dropdown-${guest.id}`
                                          )
                                          ?.classList.add("hidden");
                                      }}
                                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete Guest
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Guest Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl border border-gray-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Send className="w-5 h-5 text-blue-600" />
                    Invite Guest
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Send an invitation to join your event
                  </p>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-150 hover:scale-110 active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleInviteGuest}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestForm.name}
                      onChange={(e) =>
                        setGuestForm({ ...guestForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter guest name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={guestForm.email}
                      onChange={(e) =>
                        setGuestForm({ ...guestForm, email: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={guestForm.phone}
                      onChange={(e) =>
                        setGuestForm({ ...guestForm, phone: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event *
                    </label>
                    <select
                      required
                      value={guestForm.eventId}
                      onChange={(e) =>
                        setGuestForm({ ...guestForm, eventId: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="">Select an event</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={guestForm.status}
                      onChange={(e) =>
                        setGuestForm({ ...guestForm, status: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Send className="w-4 h-4" />
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Guest Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl border border-gray-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Edit Guest
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Update guest information
                  </p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-150 hover:scale-110 active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleEditGuest}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestForm.name}
                      onChange={(e) =>
                        setGuestForm({ ...guestForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={guestForm.email}
                      onChange={(e) =>
                        setGuestForm({ ...guestForm, email: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={guestForm.phone}
                      onChange={(e) =>
                        setGuestForm({ ...guestForm, phone: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event *
                    </label>
                    <select
                      required
                      value={guestForm.eventId}
                      onChange={(e) =>
                        setGuestForm({ ...guestForm, eventId: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="">Select an event</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={guestForm.status}
                      onChange={(e) =>
                        setGuestForm({ ...guestForm, status: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="checkedIn"
                      checked={guestForm.checkedIn}
                      onChange={(e) =>
                        setGuestForm({
                          ...guestForm,
                          checkedIn: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="checkedIn"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Checked In
                    </label>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    Update Guest
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
};

export default Guests;
