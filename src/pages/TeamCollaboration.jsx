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
import NotificationsDropdown from "../components/homepage/NotificationsDropdown";
import UserProfileDropdown from "../components/homepage/UserProfileDropdown";
import { 
  fetchTeamMembers, 
  inviteTeamMember, 
  updateTeamMemberRole, 
  removeTeamMember,
  clearError 
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
    error = null 
  } = teamState || {};

  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        dispatch(addNotification({
          title: "Team Invitation Sent",
          message: `Invitation sent to ${inviteData.email}`,
          type: "team_invite",
          icon: "Mail"
        }));
        
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
  
  const filteredMembers = teamMembers.filter(member => {
    if (!member) return false;
    
    const memberName = member.name || '';
    const memberEmail = member.email || '';
    const memberEvents = Array.isArray(member.events) ? member.events : [];
    
    const matchesSearch = memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memberEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = selectedEvent === "all" || 
                        memberEvents.some(event => 
                          events.find(e => e.title === event && e.id?.toString() === selectedEvent)
                        );
    return matchesSearch && matchesEvent;
  });

  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      try {
        const result = await dispatch(removeTeamMember(memberId));
        
        if (removeTeamMember.fulfilled.match(result)) {
          dispatch(addNotification({
            title: "Team Member Removed",
            message: "Team member has been removed successfully",
            type: "team_update",
            icon: "Users"
          }));
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
      const result = await dispatch(updateTeamMemberRole({ memberId, newRole }));
      
      if (updateTeamMemberRole.fulfilled.match(result)) {
        dispatch(addNotification({
          title: "Role Updated",
          message: `Team member role updated to ${newRole}`,
          type: "team_update",
          icon: "Users"
        }));
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
          <p className="text-red-600 mb-4">Error loading team members: {error}</p>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
          <p className="text-gray-600 mb-6">
            Start building your team by inviting members to collaborate
          </p>
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Invite Your First Member
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {teamMembers.filter(m => m?.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {teamMembers.filter(m => m?.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-purple-600">
                  {teamMembers.filter(m => m?.role === 'admin').length}
                </p>
              </div>
              <Crown className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Events</option>
                {events.map(event => (
                  <option key={event.id} value={event.id?.toString()}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Invite Member
            </button>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Events
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => {
                  if (!member) return null;
                  
                  return (
                    <tr key={member.id || member.email} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {(member.name || member.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.name || 'No name'}</div>
                            <div className="text-sm text-gray-500">{member.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(member.role)}
                          <span className="text-sm text-gray-900 capitalize">{member.role || 'viewer'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(member.status)}
                          <span className="text-sm text-gray-900 capitalize">{member.status || 'pending'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {member.events && member.events.length > 0 ? (
                            <div className="space-y-1">
                              {member.events.slice(0, 2).map((event, index) => (
                                <div key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block mr-1">
                                  {event}
                                </div>
                              ))}
                              {member.events.length > 2 && (
                                <div className="text-xs text-gray-500">+{member.events.length - 2} more</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">No events</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.lastActive || 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <select
                            value={member.role || 'viewer'}
                            onChange={(e) => handleChangeRole(member.id || member.email, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                            disabled={member.id === 1} // Can't change your own role
                          >
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>
                          {member.id !== 1 && ( // Can't remove yourself
                            <button
                              onClick={() => handleRemoveMember(member.id || member.email)}
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Pending Invitations</h3>
        <p className="text-gray-600 mb-6">
          Track and manage your sent invitations
        </p>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Send New Invitation
        </button>
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans']">
        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="lg:ml-64 transition-all duration-300">
          {/* Top Navigation Bar */}
          <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <button
                  onClick={() => window.history.length > 1 ? window.history.back() : navigate("/homepage")}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-6 h-6 text-blue-600" />
                    Team Collaboration
                  </h1>
                  <p className="text-sm text-gray-600">Manage your team members and collaborate on events</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <NotificationsDropdown />
                <UserProfileDropdown user={user} />
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              {/* Tab Navigation */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                            activeTab === tab.id
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === "members" ? renderMembersTab() : renderInvitationsTab()}
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
                  <h3 className="text-xl font-semibold text-gray-900">Invite Team Member</h3>
                  <p className="text-sm text-gray-600 mt-1">Send an invitation to join your team</p>
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
                    onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
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
                    onChange={(e) => setInviteData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={inviteLoading}
                  >
                    <option value="viewer">Viewer - Can view events only</option>
                    <option value="editor">Editor - Can create and edit events</option>
                    <option value="admin">Admin - Full access including team management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Event (Optional)
                  </label>
                  <select
                    value={inviteData.eventId}
                    onChange={(e) => setInviteData(prev => ({ ...prev, eventId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={inviteLoading}
                  >
                    <option value="">All Events</option>
                    {events.map(event => (
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
                    onChange={(e) => setInviteData(prev => ({ ...prev, message: e.target.value }))}
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
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
      </div>
    </SidebarProvider>
  );
}