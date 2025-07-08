"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  ArrowLeft,
  Users,
  Plus,
  Mail,
  UserPlus,
  Crown,
  Edit3,
  Eye,
  Trash2,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Send,
} from "lucide-react";
import AppSidebar from "../components/homepage/AppSidebar";
import { SidebarProvider } from "../components/homepage/SidebarProvider";
import {
  fetchTeamMembers,
  inviteTeamMember,
  updateTeamMemberRole,
  removeTeamMember,
  clearError,
} from "../redux/slices/teamSlice";
import { addNotification } from "../redux/slices/notificationsSlice";

export default function TeamCollaboration() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { events = [] } = useSelector((state) => state.events || {});

  // Safe access to team state with proper fallbacks
  const teamState = useSelector((state) => state.team);
  const {
    members = [],
    loading = false,
    inviteLoading = false,
    error = null,
  } = teamState || {};

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("members");
  const [searchTerm, setSearchTerm] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [inviteData, setInviteData] = useState({
    email: "",
    role: "editor",
    eventId: "",
    message: "",
  });

  // Fetch team members on component mount
  useEffect(() => {
    dispatch(fetchTeamMembers());
  }, [dispatch]);

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

  const handleInviteSubmit = async (e) => {
    e.preventDefault();

    try {
      // Dispatch the invite action
      const result = await dispatch(inviteTeamMember(inviteData));

      if (inviteTeamMember.fulfilled.match(result)) {
        // Add notification about successful invitation
        dispatch(
          addNotification({
            title: "Team Invitation Sent",
            message: `Invitation sent to ${inviteData.email}`,
            type: "team_invite",
            icon: "Mail",
          })
        );

        // Reset form and close modal
        setInviteData({
          email: "",
          role: "editor",
          eventId: "",
          message: "",
        });
        setShowInviteModal(false);

        // Show success message
        alert(`Invitation sent to ${inviteData.email}!`);
      } else {
        // Handle error
        console.error("Failed to send invitation:", result.payload);
        alert(`Failed to send invitation: ${result.payload}`);
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("An error occurred while sending the invitation.");
    }
  };

  const getRolePermissions = (role) => {
    switch (role) {
      case "admin":
        return ["create", "edit", "delete", "invite", "manage"];
      case "editor":
        return ["create", "edit"];
      case "viewer":
        return ["view"];
      default:
        return ["view"];
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case "editor":
        return <Edit3 className="w-4 h-4 text-blue-600" />;
      case "viewer":
        return <Eye className="w-4 h-4 text-gray-600" />;
      default:
        return <Eye className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "inactive":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Ensure members is always an array and safely filter
  const teamMembers = Array.isArray(members) ? members : [];

  const filteredMembers = teamMembers.filter((member) => {
    if (!member) return false;

    const memberName = member.name || "";
    const memberEmail = member.email || "";
    const memberEvents = Array.isArray(member.events) ? member.events : [];

    const matchesSearch =
      memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memberEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent =
      selectedEvent === "all" ||
      memberEvents.some((event) =>
        events.find(
          (e) => e.title === event && e.id?.toString() === selectedEvent
        )
      );
    return matchesSearch && matchesEvent;
  });

  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      try {
        const result = await dispatch(removeTeamMember(memberId));

        if (removeTeamMember.fulfilled.match(result)) {
          dispatch(
            addNotification({
              title: "Team Member Removed",
              message: "Team member has been removed successfully",
              type: "team_update",
              icon: "Users",
            })
          );
        } else {
          alert(`Failed to remove team member: ${result.payload}`);
        }
      } catch (error) {
        console.error("Error removing team member:", error);
        alert("An error occurred while removing the team member.");
      }
    }
  };

  const handleChangeRole = async (memberId, newRole) => {
    try {
      const result = await dispatch(
        updateTeamMemberRole({ memberId, newRole })
      );

      if (updateTeamMemberRole.fulfilled.match(result)) {
        dispatch(
          addNotification({
            title: "Role Updated",
            message: `Team member role updated to ${newRole}`,
            type: "team_update",
            icon: "Users",
          })
        );
      } else {
        alert(`Failed to update role: ${result.payload}`);
      }
    } catch (error) {
      console.error("Error updating team member role:", error);
      alert("An error occurred while updating the role.");
    }
  };

  const tabs = [
    { id: "members", label: "Team Members", icon: Users },
    { id: "invitations", label: "Pending Invitations", icon: Send },
  ];

  const renderMembersTab = () => {
    // Show loading state
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading team members...</span>
        </div>
      );
    }

    // Show error state
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">
            Error loading team members: {error}
          </p>
          <button
            onClick={() => dispatch(fetchTeamMembers())}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    // Show empty state if no members
    if (teamMembers.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No team members yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start building your team by inviting members to collaborate
          </p>
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium w-full sm:w-auto max-w-xs mx-auto"
          >
            <UserPlus className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm sm:text-base">
              Invite Your First Member
            </span>
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamMembers.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {teamMembers.filter((m) => m?.status === "active").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Pending
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {teamMembers.filter((m) => m?.status === "pending").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Admins</p>
                <p className="text-2xl font-bold text-purple-600">
                  {teamMembers.filter((m) => m?.role === "admin").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search and Event Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-gray-400 transition-colors"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-gray-400 transition-colors"
                >
                  <option value="all">All Events</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id?.toString()}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Invite Button - Full width on mobile, auto width on larger screens */}
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium w-full sm:w-auto sm:self-start"
            >
              <UserPlus className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm sm:text-base font-medium">
                Invite Team Member
              </span>
            </button>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-b from-blue-600 via-blue-400 to-blue-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Events
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredMembers.map((member) => {
                  if (!member) return null;

                  return (
                    <tr
                      key={member.id || member.email}
                      className="hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                            {(member.name || member.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {member.name || "No name"}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span>{member.email || "No email"}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(member.role)}
                          <span className="text-sm text-gray-900 capitalize">
                            {member.role || "viewer"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(member.status)}
                          <span className="text-sm text-gray-900 capitalize">
                            {member.status || "pending"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {member.events && member.events.length > 0 ? (
                            <div className="space-y-1">
                              {member.events.slice(0, 2).map((event, index) => (
                                <div
                                  key={index}
                                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block mr-1"
                                >
                                  {event}
                                </div>
                              ))}
                              {member.events.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{member.events.length - 2} more
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              No events
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.lastActive || "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <select
                            value={member.role || "viewer"}
                            onChange={(e) =>
                              handleChangeRole(
                                member.id || member.email,
                                e.target.value
                              )
                            }
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                            disabled={member.id === 1} // Can't change your own role
                          >
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>
                          {member.id !== 1 && ( // Can't remove yourself
                            <button
                              onClick={() =>
                                handleRemoveMember(member.id || member.email)
                              }
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Remove member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderInvitationsTab = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Pending Invitations
        </h3>
        <p className="text-gray-600 mb-6">
          Track and manage your sent invitations
        </p>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium w-full sm:w-auto max-w-xs mx-auto"
        >
          <UserPlus className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm sm:text-base">Send New Invitation</span>
        </button>
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] w-full">
        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />

        {/* Main Content - with proper margin for sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out ${
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => {
                    // Go back to the previous page if possible, otherwise fallback to dashboard
                    if (window.history.length > 2) {
                      window.history.back();
                    } else {
                      navigate("/dashboard");
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 truncate flex items-center gap-2">
                    Team Collaboration
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    Manage your team members and collaborate on events
                  </p>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="max-w-7xl mx-auto">
              {/* Tab Navigation */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <nav className="flex space-x-8 px-6">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                            activeTab === tab.id
                              ? "border-blue-500 text-blue-600 bg-blue-50/50"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="p-6 bg-white">
                  {activeTab === "members"
                    ? renderMembersTab()
                    : renderInvitationsTab()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Invite Team Member
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Send an invitation to join your team
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleInviteSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inviteData.email}
                  onChange={(e) =>
                    setInviteData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="colleague@example.com"
                  disabled={inviteLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={inviteData.role}
                  onChange={(e) =>
                    setInviteData((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={inviteLoading}
                >
                  <option value="viewer">Viewer - Can view events only</option>
                  <option value="editor">
                    Editor - Can create and edit events
                  </option>
                  <option value="admin">
                    Admin - Full access including team management
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Event (Optional)
                </label>
                <select
                  value={inviteData.eventId}
                  onChange={(e) =>
                    setInviteData((prev) => ({
                      ...prev,
                      eventId: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={inviteLoading}
                >
                  <option value="">All Events</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id?.toString()}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={inviteData.message}
                  onChange={(e) =>
                    setInviteData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Add a personal message to your invitation..."
                  disabled={inviteLoading}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  disabled={inviteLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {inviteLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Invitation
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}
