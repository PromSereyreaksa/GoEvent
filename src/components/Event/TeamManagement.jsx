import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, X, Mail, User, Search, Copy, Check } from "lucide-react";
import { 
  addTeamMember, 
  removeTeamMember, 
  inviteTeamMember, 
  searchUsers,
  clearSearchResults
} from "../../redux/slices/eventSlice";

export default function TeamManagement({ eventId, teamMembers = [], canManage = false, eventTitle = "" }) {
  const dispatch = useDispatch();
  const { searchResults, teamMemberLoading, invitationLoading } = useSelector((state) => state.events);
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteMethod, setInviteMethod] = useState('email'); // 'email', 'username', 'link'
  const [inviteValue, setInviteValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  // Generate invite link
  useEffect(() => {
    if (eventId) {
      const baseUrl = window.location.origin;
      setInviteLink(`${baseUrl}/events/${eventId}/join?token=invite_${eventId}_${Date.now()}`);
    }
  }, [eventId]);

  const handleSearch = async (query) => {
    if (query.length >= 2) {
      dispatch(searchUsers(query));
    } else {
      dispatch(clearSearchResults());
    }
  };

  const handleInviteUser = async () => {
    if (!inviteValue.trim()) return;

    const invitationData = {
      [inviteMethod]: inviteValue,
      eventId,
      message: `You've been invited to collaborate on an event. Join us to help plan and manage this event together.`
    };

    try {
      await dispatch(inviteTeamMember({ eventId, invitationData })).unwrap();
      setShowInviteModal(false);
      setInviteValue('');
      setSearchQuery('');
      dispatch(clearSearchResults());
    } catch (error) {
      console.error('Failed to send invitation:', error);
    }
  };

  const handleAddFromSearch = async (user) => {
    try {
      const memberData = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        addedAt: new Date().toISOString()
      };
      
      await dispatch(addTeamMember({ eventId, memberData })).unwrap();
      setShowInviteModal(false);
      setSearchQuery('');
      dispatch(clearSearchResults());
    } catch (error) {
      console.error('Failed to add team member:', error);
    }
  };

  const handleRemoveTeamMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        await dispatch(removeTeamMember({ eventId, memberId })).unwrap();
      } catch (error) {
        console.error('Failed to remove team member:', error);
      }
    }
  };

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Team Members</h3>
          <p className="text-gray-600">Collaborate with others on this event</p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Member
          </button>
        )}
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h4>
            {canManage && (
              <p className="text-sm">Add team members to start collaborating</p>
            )}
          </div>
        ) : (
          teamMembers.map((member) => (
            <div key={member.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-lg">
                    {member.first_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {member.first_name} {member.last_name}
                  </p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
                {canManage && (
                  <button
                    onClick={() => handleRemoveTeamMember(member.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                    disabled={teamMemberLoading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Add Team Member</h4>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Selection Display */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Adding member to:</span> {eventTitle || 'Current Event'}
              </p>
            </div>

            {/* Invite Method Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
              <button
                onClick={() => setInviteMethod('email')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  inviteMethod === 'email' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </button>
              <button
                onClick={() => setInviteMethod('username')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  inviteMethod === 'username' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4 inline mr-1" />
                Search
              </button>
              <button
                onClick={() => setInviteMethod('link')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  inviteMethod === 'link' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Copy className="w-4 h-4 inline mr-1" />
                Link
              </button>
            </div>

            {/* Email Invite */}
            {inviteMethod === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteValue}
                  onChange={(e) => setInviteValue(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleInviteUser}
                  disabled={!inviteValue.trim() || invitationLoading}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {invitationLoading ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            )}

            {/* Username Search */}
            {inviteMethod === 'username' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Users
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    placeholder="Search by name or email"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-3 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <button
                          onClick={() => handleAddFromSearch(user)}
                          disabled={teamMemberLoading}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Link Invite */}
            {inviteMethod === 'link' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invitation Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                  <button
                    onClick={copyInviteLink}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Share this link with anyone you want to add to your event team
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
