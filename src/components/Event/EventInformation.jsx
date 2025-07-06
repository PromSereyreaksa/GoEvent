import { ArrowLeft, Calendar, MapPin, Clock, Users, Heart } from "lucide-react";

/**
 * A simplified, crash-proof component to display event data.
 * It displays raw data safely using optional chaining and avoids complex formatting.
 */
export function EventInformation({ event, onBack }) {

  // A safety guard in case the event object is null or undefined
  if (!event) {
    return <div className="p-8">Error: Event data is missing.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 font-sans">
      {/* --- Header --- */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          {event?.name || "Event Title"}
        </h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* --- Image --- */}
      {event?.image && (
        <img
          src={event.image}
          alt={event?.name || "Event"}
          className="w-full h-auto sm:h-80 object-cover rounded-lg mb-8 border"
        />
      )}

      {/* --- Core Details --- */}
      <div className="mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-blue-500 flex-shrink-0" />
                  <span><strong>Date:</strong> {event?.date || "Not set"}</span>
              </div>
              <div className="flex items-center gap-3">
                  <Clock size={20} className="text-green-500 flex-shrink-0" />
                  <span><strong>Time:</strong> {event?.startTime || "N/A"} - {event?.endTime || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-purple-500 flex-shrink-0" />
                  <span><strong>Venue:</strong> {event?.venue || "Not set"}</span>
              </div>
              <div className="flex items-center gap-3">
                  <Heart size={20} className="text-pink-500 flex-shrink-0" />
                  <span><strong>Type:</strong> {event?.eventType || "N/A"}</span>
              </div>
          </div>
      </div>
      

      {/* --- Description --- */}
      {event?.details && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap p-4 bg-gray-50 rounded-lg border">
            {event.details}
          </p>
        </div>
      )}

      {/* --- Hosts (Simplified) --- */}
      {event?.hosts?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Hosts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.hosts.map((host, index) => (
              <div key={host?.id || index} className="p-4 bg-gray-50 rounded-lg border">
                <p className="font-bold text-lg flex items-center gap-2">
                    <Users size={20} /> {host?.name || "Unnamed Host"}
                </p>
                {host?.parentNames?.length > 0 && (
                  <p className="text-sm text-gray-600 pl-2">
                    Parents: {host.parentNames.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Agenda (Simplified) --- */}
      {event?.agenda?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Agenda</h2>
          {event.agenda.map((day, index) => (
            <div key={day?.id || index} className="mb-4 p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-bold text-xl mb-2">
                {day?.title || `Day ${index + 1}`} ({day?.date || "No Date"})
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {day?.activities?.length > 0 ? (
                    day.activities.map((activity, actIndex) => (
                        <li key={activity?.id || actIndex}>
                            <strong>{activity?.time || "Time:"}</strong> {activity?.activity || "No activity description."}
                        </li>
                    ))
                ) : (
                    <li>No activities listed for this day.</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}