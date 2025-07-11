"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, Plus, Trash2, Image, X } from "lucide-react";
import { eventAPI } from "../../utils/api";

export function EventForm({
  formData,
  onInputChange,
  onFileUpload,
  onSave,
  onCancel,
  isEdit = false,
  loading = false,
  error = null,
  // Extended props for complex form handling
  onAgendaChange,
  onActivityChange,
  onHostChange,
  onParentNameChange,
  addAgendaDay,
  removeAgendaDay,
  addActivity,
  removeActivity,
  addHost,
  removeHost,
  addParentName,
  removeParentName,
}) {
  const [activeTab, setActiveTab] = useState("basic");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const types = await eventAPI.getEventTypes();
        setCategories(types);
      } catch (error) {
        console.error('Failed to load event categories:', error);
        // Fallback to hardcoded categories if API fails
        setCategories([
          { value: 'wedding', label: 'Wedding' },
          { value: 'birthday', label: 'Birthday' },
          { value: 'housewarming', label: 'Housewarming' },
          { value: 'conferences', label: 'Conferences' },
          { value: 'seminars', label: 'Seminars' },
          { value: 'concert', label: 'Concert' },
          { value: 'retreat', label: 'Retreat' },
          { value: 'other', label: 'Other' }
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Get dynamic fields based on event category and edit mode
  const getFieldsForCategory = (category, isEditMode) => {
    const baseFields = ["basic"];
    
    // Only show additional tabs in edit mode
    if (!isEditMode) {
      return baseFields;
    }
    
    // Additional fields for editing
    const editFields = ["details"];
    
    switch (category) {
      case "wedding":
        return [...baseFields, ...editFields, "agenda", "hosts", "media", "advanced"];
      case "conferences":
        return [...baseFields, ...editFields, "agenda", "speakers", "media", "advanced"];
      case "seminars":
        return [...baseFields, ...editFields, "agenda", "speakers", "media", "advanced"];
      case "birthday":
        return [...baseFields, ...editFields, "agenda", "hosts", "media", "advanced"];
      case "housewarming":
        return [...baseFields, ...editFields, "agenda", "hosts", "media", "advanced"];
      case "concert":
        return [...baseFields, ...editFields, "agenda", "media", "advanced"];
      case "retreat":
        return [...baseFields, ...editFields, "agenda", "hosts", "media", "advanced"];
      default:
        return [...baseFields, ...editFields, "agenda", "media", "advanced"];
    }
  };

  const availableTabs = getFieldsForCategory(formData.category, isEdit);

  // Get label for hosts based on event category
  const getHostLabel = (category) => {
    switch (category) {
      case "wedding":
        return "Hosts (Bride & Groom)";
      case "conferences":
        return "Speakers";
      case "seminars":
        return "Speakers";
      case "birthday":
        return "Celebrant";
      case "housewarming":
        return "Hosts";
      case "retreat":
        return "Organizers";
      default:
        return "Hosts";
    }
  };

  // Get parent names label based on event category
  const getParentLabel = (category) => {
    switch (category) {
      case "wedding":
        return "Parent Names";
      case "conferences":
        return "Speaker Bio/Title";
      case "seminars":
        return "Speaker Bio/Title";
      case "birthday":
        return "Guardian/Parent Names";
      case "housewarming":
        return "Family Names";
      case "retreat":
        return "Contact Information";
      default:
        return "Additional Info";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation - updated to match formData structure
    if (!formData.title?.trim()) {
      alert("Event title is required");
      return;
    }
    if (!formData.date) {
      alert("Event date is required");
      return;
    }
    if (!formData.category) {
      alert("Event category is required");
      return;
    }

    onSave();
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-7xl mx-auto">
        {/* Form Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {isEdit ? "Edit Event" : "Create New Event"}
              </h2>
              <p className="text-lg text-gray-600">
                {isEdit ? "Update your event details" : "Fill in the details to create your event"}
              </p>
            </div>
            {isEdit && (
              <div className="text-sm text-gray-500">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Editing Mode
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xs">!</span>
              </div>
              <p className="text-red-800 font-medium">Error</p>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Form Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {availableTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`py-6 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "speakers" ? "Speakers" : tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                    disabled={categoriesLoading}
                  >
                    <option value="">
                      {categoriesLoading ? "Loading event categories..." : "Select event category"}
                    </option>
                    {categories.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {categoriesLoading && (
                    <p className="text-sm text-gray-500 mt-1">Loading available event categories...</p>
                  )}
                </div>

                {formData.category === "other" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Event Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customCategory"
                      value={formData.customCategory}
                      onChange={onInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter custom event category"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={onInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={onInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter venue address"
                    required
                  />
                </div>
              </div>
            )}

            {/* Details Tab - Only description for editing */}
            {activeTab === "details" && isEdit && (
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Description <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={onInputChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
                    placeholder="Describe your event in detail..."
                  />
                </div>
              </div>
            )}

            {/* Media Tab - Only available in edit mode */}
            {activeTab === "media" && isEdit && (
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Banner <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onFileUpload(e, "eventBanner")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                    {formData.eventBanner && (
                      <div className="flex items-center gap-4">
                        <img
                          src={formData.eventBanner}
                          alt="Event banner preview"
                          className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">Banner Preview</p>
                          <p className="text-xs text-gray-500">Image uploaded successfully</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo (Khmer) <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFileUpload(e, "logoKh")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo (English) <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFileUpload(e, "logoEn")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loading Screen Image <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFileUpload(e, "loadingScreen")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Music <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    accept="audio/mp3"
                    onChange={(e) => onFileUpload(e, "invitationBackgroundMusic")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transition Video <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => onFileUpload(e, "transitionVideo")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube Video URL <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    name="youtubeLink"
                    value={formData.youtubeLink}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Message URL <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    name="videoMessageLink"
                    value={formData.videoMessageLink}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Maps Link <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    name="googleMapLink"
                    value={formData.googleMapLink}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>
            )}

            {/* Advanced Tab - Only available in edit mode */}
            {activeTab === "advanced" && isEdit && (
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Plan <span className="text-gray-400">(Optional)</span>
                  </label>
                  <select
                    name="packagePlan"
                    value={formData.packagePlan || ""}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select package plan</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invitation Template <span className="text-gray-400">(Optional)</span>
                  </label>
                  <select
                    name="invitationTemplate"
                    value={formData.invitationTemplate || ""}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select invitation template</option>
                    <option value="classic">Classic</option>
                    <option value="modern">Modern</option>
                    <option value="elegant">Elegant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Members <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className="space-y-4">
                    {/* Team Members List */}
                    {formData.team_members && formData.team_members.length > 0 && (
                      <div className="space-y-2">
                        {formData.team_members.map((member, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {member.first_name?.charAt(0) || member.email?.charAt(0) || '?'}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {member.first_name} {member.last_name}
                                </p>
                                <p className="text-xs text-gray-500">{member.email}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedMembers = formData.team_members.filter((_, i) => i !== index);
                                onInputChange({
                                  target: {
                                    name: 'team_members',
                                    value: updatedMembers
                                  }
                                });
                              }}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Add Team Member - Note: Full functionality available in edit mode via TeamManagement */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Team Member Management:</strong>
                      </p>
                      <p className="text-xs text-blue-600">
                        Team members can be added and managed after the event is created. 
                        Team members will have full access to view and edit this event.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Agenda Tab */}
            {activeTab === "agenda" && availableTabs.includes("agenda") && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formData.category === "conferences" ? "Conference Schedule" :
                     formData.category === "seminars" ? "Seminar Schedule" :
                     formData.category === "wedding" ? "Wedding Timeline" :
                     formData.category === "retreat" ? "Retreat Schedule" : "Event Agenda"}
                    <span className="text-gray-400 text-sm font-normal ml-2">(Optional)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addAgendaDay}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {formData.category === "conferences" || formData.category === "seminars" ? "Add Session" : "Add Day"}
                  </button>
                </div>

                {formData.agenda?.map((day, dayIndex) => (
                  <div key={day.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Day {dayIndex + 1}</h4>
                      {formData.agenda.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAgendaDay(dayIndex)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={day.date}
                          onChange={(e) => onAgendaChange(dayIndex, 'date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Day Title
                        </label>
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) => onAgendaChange(dayIndex, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="e.g., Wedding Ceremony"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-700">Activities</h5>
                        <button
                          type="button"
                          onClick={() => addActivity(dayIndex)}
                          className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
                        >
                          + Add Activity
                        </button>
                      </div>

                      {day.activities?.map((activity, activityIndex) => (
                        <div key={activity.id} className="flex items-center gap-3">
                          <input
                            type="time"
                            value={activity.time}
                            onChange={(e) => onActivityChange(dayIndex, activityIndex, 'time', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                          <input
                            type="text"
                            value={activity.activity}
                            onChange={(e) => onActivityChange(dayIndex, activityIndex, 'activity', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="Activity description"
                          />
                          {day.activities.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeActivity(dayIndex, activityIndex)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Hosts/Speakers Tab */}
            {(activeTab === "hosts" || activeTab === "speakers") && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getHostLabel(formData.category)}
                    <span className="text-gray-400 text-sm font-normal ml-2">(Optional)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addHost}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {(formData.category === "conferences" || formData.category === "seminars") ? "Add Speaker" : "Add Host"}
                  </button>
                </div>

                {formData.hosts?.map((host, hostIndex) => (
                  <div key={host.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">
                        {(formData.category === "conferences" || formData.category === "seminars") ? `Speaker ${hostIndex + 1}` :
                         formData.category === "birthday" ? "Celebrant" :
                         `Host ${hostIndex + 1}`}
                      </h4>
                      {formData.hosts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHost(hostIndex)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {(formData.category === "conferences" || formData.category === "seminars") ? "Speaker Name" :
                           formData.category === "birthday" ? "Celebrant Name" :
                           "Host Name"}
                        </label>
                        <input
                          type="text"
                          value={host.name}
                          onChange={(e) => onHostChange(hostIndex, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder={(formData.category === "conferences" || formData.category === "seminars") ? "Enter speaker name" :
                                     formData.category === "birthday" ? "Enter celebrant name" :
                                     "Enter host name"}
                        />
                      </div>

                      {/* Only show parent names for appropriate event categories */}
                      {!(formData.category === "conferences" || formData.category === "seminars") && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {getParentLabel(formData.category)}
                          </label>
                          {host.parentNames?.map((parentName, parentIndex) => (
                            <div key={parentIndex} className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={parentName}
                                onChange={(e) => onParentNameChange(hostIndex, parentIndex, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder={formData.category === "wedding" ? "Parent name" :
                                           formData.category === "birthday" ? "Parent/Guardian name" :
                                           formData.category === "housewarming" ? "Family member name" :
                                           formData.category === "retreat" ? "Contact information" :
                                           "Additional info"}
                              />
                              {host.parentNames.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeParentName(hostIndex, parentIndex)}
                                  className="text-red-600 hover:text-red-700 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addParentName(hostIndex)}
                            className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
                          >
                            {formData.category === "wedding" ? "+ Add Parent" :
                             formData.category === "birthday" ? "+ Add Guardian" :
                             formData.category === "housewarming" ? "+ Add Family Member" :
                             formData.category === "retreat" ? "+ Add Contact" :
                             "+ Add Info"}
                          </button>
                        </div>
                      )}

                      {/* Speaker-specific fields for conferences and seminars */}
                      {(formData.category === "conferences" || formData.category === "seminars") && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Speaker Title/Bio
                            </label>
                            <textarea
                              value={host.bio || ""}
                              onChange={(e) => onHostChange(hostIndex, 'bio', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                              rows={3}
                              placeholder="Speaker's title, company, or bio"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Contact Email
                            </label>
                            <input
                              type="email"
                              value={host.email || ""}
                              onChange={(e) => onHostChange(hostIndex, 'email', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                              placeholder="speaker@company.com"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {loading ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}