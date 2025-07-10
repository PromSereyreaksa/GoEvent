import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, X, User, Search } from "lucide-react";
import { 
  addTeamMember, 
  removeTeamMember, 
  searchUsers,
  clearSearchResults,
  fetchEvents
} from "../../redux/slices/eventSlice";

export default function TeamManagement({ eventId, teamMembers = [], canManage = false, eventTitle = "" }) {
  const dispatch = useDispatch();
  const { searchResults, teamMemberLoading, loading } = useSelector((state) => state.events);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debug: Log team members when they change
  useEffect(() => {
    console.log('🔍 TeamManagement: Team members updated:', {
      eventId,
      teamMembersCount: teamMembers.length,
      teamMembers: teamMembers
    });
  }, [teamMembers, eventId]);

  const handleSearch = async (query = searchInput) => {
    console.log('Searching for users with query:', query);
    if (query.trim().length >= 2) {
      setIsSearching(true);
      setSearchQuery(query.trim());
      try {
        await dispatch(searchUsers(query.trim()));
        console.log('Search completed, results:', searchResults);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      dispatch(clearSearchResults());
      setSearchQuery('');
      setIsSearching(false);
    }
  };

  /* const handleAddFromSearch = async (user) => {
    try {
      // Prepare member data for the API
      const memberData = {
        id: user.id, // This will be used as user_id in the API
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: 'member', // Default role
        permissions: ['view'], // Default permissions
      };
      
      console.log('Adding team member with data:', memberData);
      const result = await dispatch(addTeamMember({ eventId, memberData })).unwrap();
      
      // Refresh events to get updated team member data
      await dispatch(fetchEvents()).unwrap();
      
      setShowAddModal(false);
      setSearchQuery('');
      dispatch(clearSearchResults());
      
      console.log('Team member added successfully:', result);
      alert('Team member added successfully!');
    } catch (error) {
      console.error('Failed to add team member:', error);
      alert(`Failed to add team member: ${error.message || 'Please try again.'}`);
    }
  }; */

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    dispatch(clearSearchResults());
    setIsSearching(false);
  };

  

  const handleAddFromSearch = async (user) => {
  try {
    const memberData = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      bio: user.bio || "",
      profile_picture: user.profile_picture || null,
      is_vendor: user.is_vendor || false,
      is_partner: user.is_partner || false,
      phone_number: user.phone_number || null
    };
    
    console.log('🚀 Adding team member:', { eventId, memberData });
    
    const result = await dispatch(addTeamMember({ eventId, memberData })).unwrap();
    console.log('✅ Team member added successfully:', result);
    
    // ... rest of success handling
  } catch (error) {
    console.error('❌ Failed to add team member:', error);
    // ... error handling
  }
};

  const handleRemoveTeamMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        await dispatch(removeTeamMember({ eventId, memberId })).unwrap();
        
        // Refresh events to get updated team member data
        await dispatch(fetchEvents()).unwrap();
        
        alert('Team member removed successfully!');
      } catch (error) {
        console.error('Failed to remove team member:', error);
        alert(`Failed to remove team member: ${error.message || 'Please try again.'}`);
      }
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
            onClick={() => setShowAddModal(true)}
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

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Add Team Member</h4>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  handleClearSearch();
                }}
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

            {/* User Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Users (Press Enter to search)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    placeholder="Search by name or email"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => handleSearch()}
                  disabled={searchInput.trim().length < 2 || isSearching}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
                {(searchInput.length > 0 || searchQuery.length > 0) && (
                  <button
                    onClick={handleClearSearch}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              {/* Debug: Test button to trigger search with mock data */}
              <div className="mt-2">
                <button
                  onClick={() => {
                    setSearchInput('john');
                    setTimeout(() => handleSearch('john'), 100);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Test search with "john"
                </button>
              </div>
              
              {/* Search Results */}
              {isSearching && (
                <div className="mt-3 p-3 text-center text-gray-500 text-sm">
                  Searching for users...
                </div>
              )}
              
              {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="mt-3 p-3 text-center text-gray-500 text-sm">
                  No users found matching "{searchQuery}"
                </div>
              )}
              
              {!isSearching && searchResults.length > 0 && (
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
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        {teamMemberLoading ? 'Adding...' : 'Add'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {searchInput.length > 0 && searchInput.length < 2 && (
                <div className="mt-3 p-3 text-center text-gray-500 text-sm">
                  Type at least 2 characters to search
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
