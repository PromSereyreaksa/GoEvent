"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
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
} from "lucide-react"
import { SidebarProvider } from "../components/homepage/SidebarProvider"
import AppSidebar from "../components/homepage/AppSidebar"

const Guests = () => {
  const dispatch = useDispatch()

  // Fix Redux selector to match your store structure
  const { guests = [] } = useSelector((state) => state.guests || {})
  const { events = [] } = useSelector((state) => state.events || {})
  const { user } = useSelector((state) => state.auth || {})

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")
  const [selectedGuests, setSelectedGuests] = useState([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingGuest, setEditingGuest] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Guest form state
  const [guestForm, setGuestForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventId: "",
    status: "pending",
    checkedIn: false,
  })

  // Filter guests based on search and filters
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || guest.status === statusFilter
    const matchesEvent = eventFilter === "all" || guest.eventId === eventFilter

    return matchesSearch && matchesStatus && matchesEvent
  })

  // Calculate stats based on filtered event
  const eventSpecificGuests = eventFilter === "all" ? guests : guests.filter((g) => g.eventId === eventFilter)
  const stats = {
    total: eventSpecificGuests.length,
    confirmed: eventSpecificGuests.filter((g) => g.status === "confirmed").length,
    pending: eventSpecificGuests.filter((g) => g.status === "pending").length,
    declined: eventSpecificGuests.filter((g) => g.status === "declined").length,
    checkedIn: eventSpecificGuests.filter((g) => g.checkedIn).length,
  }

  const handleInviteGuest = (e) => {
    e.preventDefault()
    const newGuest = {
      id: Date.now().toString(),
      ...guestForm,
      invitedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    dispatch({ type: "guests/addGuest", payload: newGuest })
    setGuestForm({
      name: "",
      email: "",
      phone: "",
      eventId: "",
      status: "pending",
      checkedIn: false,
    })
    setShowInviteModal(false)
  }

  const handleEditGuest = (e) => {
    e.preventDefault()
    const updatedGuest = {
      ...editingGuest,
      ...guestForm,
      updatedAt: new Date().toISOString(),
    }

    dispatch({ type: "guests/updateGuest", payload: updatedGuest })
    setShowEditModal(false)
    setEditingGuest(null)
    setGuestForm({
      name: "",
      email: "",
      phone: "",
      eventId: "",
      status: "pending",
      checkedIn: false,
    })
  }

  const handleDeleteGuest = (guestId) => {
    if (window.confirm("Are you sure you want to delete this guest?")) {
      dispatch({ type: "guests/removeGuest", payload: guestId })
    }
  }

  const handleBulkAction = (action) => {
    selectedGuests.forEach((guestId) => {
      const guest = guests.find((g) => g.id === guestId)
      if (guest) {
        const updatedGuest = { ...guest }

        switch (action) {
          case "confirm":
            updatedGuest.status = "confirmed"
            break
          case "decline":
            updatedGuest.status = "declined"
            break
          case "checkin":
            updatedGuest.checkedIn = true
            break
          case "delete":
            dispatch({ type: "guests/removeGuest", payload: guestId })
            return
        }

        if (action !== "delete") {
          updatedGuest.updatedAt = new Date().toISOString()
          dispatch({ type: "guests/updateGuest", payload: updatedGuest })
        }
      }
    })
    setSelectedGuests([])
  }

  const openEditModal = (guest) => {
    setEditingGuest(guest)
    setGuestForm({
      name: guest.name,
      email: guest.email,
      phone: guest.phone || "",
      eventId: guest.eventId,
      status: guest.status,
      checkedIn: guest.checkedIn,
    })
    setShowEditModal(true)
  }

  const getEventName = (eventId) => {
    const event = events.find((e) => e.id === eventId)
    return event ? event.title : "Unknown Event"
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-50 text-yellow-700 border border-yellow-200", icon: Clock },
      confirmed: { color: "bg-green-50 text-green-700 border border-green-200", icon: CheckCircle },
      declined: { color: "bg-red-50 text-red-700 border border-red-200", icon: XCircle },
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const selectedEventName = eventFilter !== "all" ? getEventName(eventFilter) : "All Events"

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-7 h-7 text-blue-600" />
                    Guest Management
                  </h1>
                  <p className="text-gray-600">
                    {eventFilter !== "all"
                      ? `Managing guests for ${selectedEventName}`
                      : "Manage all your event guests"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4" />
                  Import
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Invite Guest
                </button>
              </div>
            </div>
          </div>

          {/* Event Filter Banner */}
          {eventFilter !== "all" && (
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-900">
                    Viewing guests for: <span className="font-semibold">{selectedEventName}</span>
                  </span>
                </div>
                <button
                  onClick={() => setEventFilter("all")}
                  className="text-sm text-blue-700 hover:text-blue-800 font-medium"
                >
                  View All Events
                </button>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Guests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Confirmed</p>
                    <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Declined</p>
                    <p className="text-2xl font-bold text-red-600">{stats.declined}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Checked In</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.checkedIn}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search guests by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedGuests.length} guest{selectedGuests.length !== 1 ? "s" : ""} selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction("confirm")}
                      className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleBulkAction("decline")}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleBulkAction("checkin")}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Check In
                    </button>
                    <button
                      onClick={() => handleBulkAction("delete")}
                      className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedGuests([])}
                      className="px-3 py-1.5 text-gray-600 hover:text-gray-800 transition-colors"
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
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No guests found</h3>
                  <p className="text-gray-600 mb-4">
                    {guests.length === 0
                      ? "Get started by inviting your first guest."
                      : eventFilter !== "all"
                        ? `No guests found for ${selectedEventName}. Try selecting a different event or invite guests to this event.`
                        : "Try adjusting your search or filter criteria."}
                  </p>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    {eventFilter !== "all" ? `Invite Guest to ${selectedEventName}` : "Invite First Guest"}
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedGuests.length === filteredGuests.length && filteredGuests.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedGuests(filteredGuests.map((g) => g.id))
                              } else {
                                setSelectedGuests([])
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Guest
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check-in
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invited
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredGuests.map((guest) => (
                        <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedGuests.includes(guest.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedGuests([...selectedGuests, guest.id])
                                } else {
                                  setSelectedGuests(selectedGuests.filter((id) => id !== guest.id))
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm mr-4">
                                {guest.name?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-gray-400" />
                                  {guest.email}
                                </div>
                                {guest.phone && (
                                  <div className="text-sm text-gray-500 flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-gray-400" />
                                    {guest.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{getEventName(guest.eventId)}</div>
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(guest.status)}</td>
                          <td className="px-6 py-4">
                            {guest.checkedIn ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                <UserCheck className="w-3 h-3" />
                                Checked In
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">Not checked in</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {guest.invitedAt ? new Date(guest.invitedAt).toLocaleDateString() : "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="relative inline-block text-left">
                              <button
                                onClick={() => {
                                  const dropdown = document.getElementById(`dropdown-${guest.id}`)
                                  dropdown?.classList.toggle("hidden")
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                              <div
                                id={`dropdown-${guest.id}`}
                                className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      openEditModal(guest)
                                      document.getElementById(`dropdown-${guest.id}`)?.classList.add("hidden")
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
                                        }
                                        dispatch({ type: "guests/updateGuest", payload: updatedGuest })
                                        document.getElementById(`dropdown-${guest.id}`)?.classList.add("hidden")
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
                                      handleDeleteGuest(guest.id)
                                      document.getElementById(`dropdown-${guest.id}`)?.classList.add("hidden")
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Guest Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                Invite Guest
              </h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleInviteGuest}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={guestForm.name}
                    onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter guest name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={guestForm.email}
                    onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={guestForm.phone}
                    onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event *</label>
                  <select
                    required
                    value={guestForm.eventId}
                    onChange={(e) => setGuestForm({ ...guestForm, eventId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={guestForm.status}
                    onChange={(e) => setGuestForm({ ...guestForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Guest Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Guest</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditGuest}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={guestForm.name}
                    onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={guestForm.email}
                    onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={guestForm.phone}
                    onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event *</label>
                  <select
                    required
                    value={guestForm.eventId}
                    onChange={(e) => setGuestForm({ ...guestForm, eventId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={guestForm.status}
                    onChange={(e) => setGuestForm({ ...guestForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    onChange={(e) => setGuestForm({ ...guestForm, checkedIn: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="checkedIn" className="ml-2 text-sm text-gray-700">
                    Checked In
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SidebarProvider>
  )
}

export default Guests
