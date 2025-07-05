import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  ImageIcon,
  Youtube,
  Plus,
  Minus,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  Trash2,
  WifiOff,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// --- Simulated API (as provided by user) ---
const api = {
  post: async (url, data) => {
    console.log("POST:", url, data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (Math.random() < 0.1) {
        throw new Error("Failed to connect to the server.");
    }
    return { data: { ...data, id: data.id || Date.now().toString() } };
  },
  put: async (url, data) => {
    console.log("PUT:", url, data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (Math.random() < 0.1) {
        throw new Error("Failed to connect to the server.");
    }
    return { data };
  },
  delete: async (url) => {
    console.log("DELETE:", url);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (Math.random() < 0.1) {
        throw new Error("Failed to connect to the server.");
    }
    return { data: { message: "Event deleted successfully" } };
  },
   get: async (url) => {
    console.log("GET:", url);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: {
        id: '123',
        eventType: 'wedding',
        name: 'John & Jane\'s Wedding',
        date: '2025-12-20',
        startTime: '14:00',
        endTime: '22:00',
        venue: 'The Grand Hall',
        details: 'A beautiful wedding ceremony and reception.',
        hosts: [
            { id: 1, name: 'Jane Doe', parentNames: ['Mr. & Mrs. Doe'] },
            { id: 2, name: 'John Smith', parentNames: ['Mr. & Mrs. Smith'] }
        ],
        agenda: [],
        googleMapLink: '',
        youtubeUrl: '',
        image: ''
    }};
  }
};

const eventAPI = {
  getEvent: async (id) => {
    try {
      const response = await api.get(`/events/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch event");
    }
  },
  createEvent: async (eventData) => {
    try {
      // Client-side role check for extra security (removed from EventManagement & SecurityMonitor)
      // This check is still here in the simulated API, but the global checks are removed.
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        // This check is now commented out to allow all users to create events
        /*
        if (user.role !== "vendor") {
          throw new Error("Only vendors can create events");
        }
        */
      } else {
         // This check is now commented out to allow all users to create events
         // throw new Error("You must be logged in as a vendor to create events.");
      }

      const response = await api.post("/events/", eventData);
      return response.data;
    } catch (error) {
      // Re-throw with a more specific message if available
      throw new Error(
        error.response?.data?.message || error.message || "Failed to create event"
      );
    }
  },
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}/`, eventData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update event"
      );
    }
  },
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/events/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete event"
      );
    }
  },
};
// --- End of simulated api.js ---


// --- Fallback Storage ---
const offlineStorage = {
    getQueue: () => JSON.parse(localStorage.getItem('offlineQueue') || '[]'),
    saveQueue: (queue) => localStorage.setItem('offlineQueue', JSON.stringify(queue)),
    addToQueue: (action, payload) => {
        const queue = offlineStorage.getQueue();
        queue.push({ action, payload, id: Date.now() });
        offlineStorage.saveQueue(queue);
    }
}

// EventForm now accepts props from EventManagement
export function EventForm({ formData, onInputChange, onFileUpload, onSave, onCancel, isEdit }) {
  const navigate = useNavigate();
  // Removed useParams and local isEdit, as they are now passed as props
  // const { eventId } = useParams();
  // const isEdit = Boolean(eventId);

  // Removed local formData state, as it's now controlled by parent
  // const [formData, setFormData] = useState({
  //     eventType: 'wedding',
  //     hosts: [{ id: Date.now(), name: "", parentNames: [""] }],
  //     agenda: [],
  // });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Define different event types and their specific fields
  const eventTypes = [
    { value: "wedding", label: "Wedding", fields: ['hosts', 'agenda', 'venue', 'endTime', 'googleMapLink', 'youtubeUrl', 'image', 'details'] },
    { value: "conference", label: "Conference", fields: ['speakers', 'venue', 'endTime', 'details', 'image'] },
    { value: "concert", label: "Concert", fields: ['artist', 'venue', 'endTime', 'youtubeUrl', 'image'] },
    { value: "other", label: "Other", fields: ['details', 'venue', 'endTime', 'image'] }
  ];

  // Removed useEffect for fetching data, as formData is now passed as prop
  /*
  useEffect(() => {
    if (isEdit) {
      setIsLoading(true);
      eventAPI.getEvent(eventId)
        .then(data => {
            setFormData(data); // This would update local state, now handled by parent
            setIsLoading(false);
        })
        .catch(err => {
            setError(err.message || "Failed to fetch event data.");
            setIsLoading(false);
        });
    }
  }, [eventId, isEdit]);
  */

  // handleSave now calls the onSave prop from the parent
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setNotification(null);

    try {
      // Call the onSave prop, which handles the actual API call (create/update)
      await onSave();
      // onSave is expected to handle navigation and notifications in EventManagement
      // Removed local navigation and notification setting
      // setNotification({ type: 'success', message: `Event ${isEdit ? 'updated' : 'created'} successfully!` });
      // setTimeout(() => navigate("/homepage"), 2000);
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(errorMessage);

      // Only queue for offline if it seems like a network error
      if (errorMessage.includes("connect") || errorMessage.includes("Failed to fetch")) {
        setNotification({ type: 'offline', message: 'Action failed. Saved to offline queue for later.' });
        // The id for update would need to come from formData if not using eventId from params
        offlineStorage.addToQueue(isEdit ? 'update' : 'create', isEdit ? { id: formData.id, ...formData } : formData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // The handleDelete function snippet was incomplete in the original query.
  // Assuming it would trigger a confirmation and then call an onDelete prop if available.
  // For now, it's left as is, but ensure `showConfirmation` is defined or removed if not used.
  const handleDelete = async () => {
      // showConfirmation is not defined in this scope.
      // This part of the code needs to be completed based on your confirmation modal implementation.
      // If onDelete is passed as a prop, it would be called here.
      // Example:
      // showConfirmation(
      //     "Delete Event",
      //     "Are you sure you want to permanently delete this event? This action cannot be undone.",
      //     async () => {
      //         setIsLoading(true);
      //         await onDelete(formData.id); // Assuming onDelete prop exists
      //         setIsLoading(false);
      //         navigate("/events"); // Navigate back after deletion
      //     }
      // );
  };

  // Helper function to render form fields based on event type
  const renderField = (fieldName) => {
    switch (fieldName) {
      case 'eventType':
        return (
          <div className="mb-6">
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={onInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        );
      case 'name':
        return (
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Event Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={onInputChange}
              placeholder="e.g., John & Jane's Wedding"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        );
      case 'date':
        return (
          <div className="mb-6">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date || ''}
              onChange={onInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        );
      case 'startTime':
        return (
          <div className="mb-6">
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime || ''}
              onChange={onInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        );
      case 'endTime':
        return (
          <div className="mb-6">
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime || ''}
              onChange={onInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        );
      case 'venue':
        return (
          <div className="mb-6">
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
              Venue
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue || ''}
              onChange={onInputChange}
              placeholder="e.g., The Grand Hall"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        );
      case 'details':
        return (
          <div className="mb-6">
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
              Details
            </label>
            <textarea
              id="details"
              name="details"
              value={formData.details || ''}
              onChange={onInputChange}
              rows="4"
              placeholder="Provide more details about the event..."
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        );
      case 'youtubeUrl':
        return (
          <div className="mb-6">
            <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Video URL
            </label>
            <div className="flex items-center mt-1">
              <Youtube className="w-5 h-5 text-red-500 mr-2" />
              <input
                type="url"
                id="youtubeUrl"
                name="youtubeUrl"
                value={formData.youtubeUrl || ''}
                onChange={onInputChange}
                placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                className="block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        );
      case 'googleMapLink':
        return (
          <div className="mb-6">
            <label htmlFor="googleMapLink" className="block text-sm font-medium text-gray-700 mb-2">
              Google Map Link
            </label>
            <div className="flex items-center mt-1">
              <MapPin className="w-5 h-5 text-green-500 mr-2" />
              <input
                type="url"
                id="googleMapLink"
                name="googleMapLink"
                value={formData.googleMapLink || ''}
                onChange={onInputChange}
                placeholder="e.g., https://goo.gl/maps/example"
                className="block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Event Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 border border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
                {formData.image ? (
                  <img src={formData.image} alt="Event Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Image
                <input
                  id="image-upload"
                  name="image"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => onFileUpload(e, 'image')}
                />
              </label>
            </div>
          </div>
        );
      case 'hosts':
        return (
          <div className="mb-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hosts</h3>
            {formData.hosts && formData.hosts.map((host, hostIndex) => (
              <div key={host.id || hostIndex} className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Host {hostIndex + 1}</h4>
                  {formData.hosts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newHosts = formData.hosts.filter((_, i) => i !== hostIndex);
                        onInputChange({ target: { name: 'hosts', value: newHosts } });
                      }}
                      className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                      aria-label="Remove host"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor={`host-name-${hostIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id={`host-name-${hostIndex}`}
                    value={host.name || ''}
                    onChange={(e) => {
                      const newHosts = [...formData.hosts];
                      newHosts[hostIndex] = { ...newHosts[hostIndex], name: e.target.value };
                      onInputChange({ target: { name: 'hosts', value: newHosts } });
                    }}
                    placeholder={hostIndex === 0 ? "Bride's Name" : "Groom's Name"}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parents' Names
                  </label>
                  {host.parentNames && host.parentNames.map((parentName, parentIndex) => (
                    <div key={parentIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={parentName || ''}
                        onChange={(e) => {
                          const newHosts = [...formData.hosts];
                          const newParentNames = [...(newHosts[hostIndex].parentNames || [])];
                          newParentNames[parentIndex] = e.target.value;
                          newHosts[hostIndex] = { ...newHosts[hostIndex], parentNames: newParentNames };
                          onInputChange({ target: { name: 'hosts', value: newHosts } });
                        }}
                        placeholder={`Parent ${parentIndex + 1} Name`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm mr-2"
                      />
                      {host.parentNames.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newHosts = [...formData.hosts];
                            const newParentNames = (newHosts[hostIndex].parentNames || []).filter((_, i) => i !== parentIndex);
                            newHosts[hostIndex] = { ...newHosts[hostIndex], parentNames: newParentNames };
                            onInputChange({ target: { name: 'hosts', value: newHosts } });
                          }}
                          className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                          aria-label="Remove parent"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newHosts = [...formData.hosts];
                      newHosts[hostIndex] = {
                        ...newHosts[hostIndex],
                        parentNames: [...(newHosts[hostIndex].parentNames || []), ""],
                      };
                      onInputChange({ target: { name: 'hosts', value: newHosts } });
                    }}
                    className="mt-2 text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" /> Add Parent
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                onInputChange({
                  target: {
                    name: 'hosts',
                    value: [...(formData.hosts || []), { id: Date.now(), name: "", parentNames: [""] }],
                  },
                });
              }}
              className="mt-4 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-xl shadow-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" /> Add Another Host
            </button>
          </div>
        );
      case 'agenda':
        return (
          <div className="mb-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Agenda</h3>
            {formData.agenda && formData.agenda.map((day, dayIndex) => (
              <div key={day.id || dayIndex} className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Day {dayIndex + 1}</h4>
                  {formData.agenda.length > 0 && ( // Allow removing if there's at least one
                    <button
                      type="button"
                      onClick={() => {
                        const newAgenda = formData.agenda.filter((_, i) => i !== dayIndex);
                        onInputChange({ target: { name: 'agenda', value: newAgenda } });
                      }}
                      className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                      aria-label="Remove day"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor={`agenda-date-${dayIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id={`agenda-date-${dayIndex}`}
                    value={day.date || ''}
                    onChange={(e) => {
                      const newAgenda = [...formData.agenda];
                      newAgenda[dayIndex] = { ...newAgenda[dayIndex], date: e.target.value };
                      onInputChange({ target: { name: 'agenda', value: newAgenda } });
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor={`agenda-title-${dayIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Day Title
                  </label>
                  <input
                    type="text"
                    id={`agenda-title-${dayIndex}`}
                    value={day.title || ''}
                    onChange={(e) => {
                      const newAgenda = [...formData.agenda];
                      newAgenda[dayIndex] = { ...newAgenda[dayIndex], title: e.target.value };
                      onInputChange({ target: { name: 'agenda', value: newAgenda } });
                    }}
                    placeholder="e.g., Wedding Ceremony"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <h5 className="text-md font-semibold text-gray-700 mb-3 mt-4">Activities</h5>
                {day.activities && day.activities.map((activity, activityIndex) => (
                  <div key={activity.id || activityIndex} className="flex items-center gap-2 mb-2 bg-white p-3 rounded-lg border border-gray-200">
                    <input
                      type="time"
                      value={activity.time || ''}
                      onChange={(e) => {
                        const newAgenda = [...formData.agenda];
                        const newActivities = [...(newAgenda[dayIndex].activities || [])];
                        newActivities[activityIndex] = { ...newActivities[activityIndex], time: e.target.value };
                        newAgenda[dayIndex] = { ...newAgenda[dayIndex], activities: newActivities };
                        onInputChange({ target: { name: 'agenda', value: newAgenda } });
                      }}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={activity.activity || ''}
                      onChange={(e) => {
                        const newAgenda = [...formData.agenda];
                        const newActivities = [...(newAgenda[dayIndex].activities || [])];
                        newActivities[activityIndex] = { ...newActivities[activityIndex], activity: e.target.value };
                        newAgenda[dayIndex] = { ...newAgenda[dayIndex], activities: newActivities };
                        onInputChange({ target: { name: 'agenda', value: newAgenda } });
                      }}
                      placeholder="Activity description"
                      className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                    />
                    {day.activities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newAgenda = [...formData.agenda];
                          const newActivities = (newAgenda[dayIndex].activities || []).filter((_, i) => i !== activityIndex);
                          newAgenda[dayIndex] = { ...newAgenda[dayIndex], activities: newActivities };
                          onInputChange({ target: { name: 'agenda', value: newAgenda } });
                        }}
                        className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                        aria-label="Remove activity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newAgenda = [...formData.agenda];
                    newAgenda[dayIndex] = {
                      ...newAgenda[dayIndex],
                      activities: [...(newAgenda[dayIndex].activities || []), { id: Date.now(), time: "", activity: "" }],
                    };
                    onInputChange({ target: { name: 'agenda', value: newAgenda } });
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> Add Activity
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                onInputChange({
                  target: {
                    name: 'agenda',
                    value: [...(formData.agenda || []), { id: Date.now(), date: "", title: "", activities: [{ id: Date.now() + 1, time: "", activity: "" }] }],
                  },
                });
              }}
              className="mt-4 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-xl shadow-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" /> Add Another Day
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // Get fields relevant to the selected event type
  const currentEventTypeFields = eventTypes.find(
    (type) => type.value === formData.eventType
  )?.fields || [];

  // Always include core fields like name, date, startTime
  const formFieldsToRender = [
    'name',
    'date',
    'startTime',
    ...currentEventTypeFields
  ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-3xl shadow-lg border border-gray-200 animate-in fade-in slide-in-from-bottom-4">
      {/* Notification Display */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
            notification.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
          }`}
        >
          {notification.type === 'success' ? (
            <Save className="w-5 h-5 text-green-600" />
          ) : (
            <WifiOff className="w-5 h-5 text-yellow-600" />
          )}
          <p className="font-medium">{notification.message}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <p className="font-medium text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Event Type Selector */}
        {renderField('eventType')}

        {/* Dynamic Fields based on event type */}
        {formFieldsToRender.map(fieldName => renderField(fieldName))}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            type="button"
            onClick={onCancel} // Use onCancel prop
            className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:shadow-md flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-2xl font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isEdit ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
