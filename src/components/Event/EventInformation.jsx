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
    <div className="w-full min-h-screen p-6 sm:p-10 font-sans">
      {/* --- Header --- */}
      <div className="flex items-center justify-between mb-10 max-w-7xl mx-auto">
        <button onClick={onBack} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          {event?.name || event?.title || "Event Title"}
        </h1>
        <div className="w-12"></div> {/* Spacer */}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* --- Image --- */}
        {(event?.image || event?.event_banner) && (
          <img
            src={event.image || event.event_banner}
            alt={event?.name || event?.title || "Event"}
            className="w-full h-auto sm:h-96 object-cover rounded-2xl mb-10 border shadow-sm"
          />
        )}

        {/* --- Core Details --- */}
        <div className="mb-10 p-6 sm:p-8 bg-gray-50 rounded-2xl border shadow-sm">
            <h2 className="text-3xl font-bold mb-6">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex items-center gap-4">
                    <Calendar size={24} className="text-blue-500 flex-shrink-0" />
                    <span className="text-lg"><strong>Date:</strong> {event?.date || "Not set"}</span>
                </div>
                <div className="flex items-center gap-4">
                    <Clock size={24} className="text-green-500 flex-shrink-0" />
                    <span className="text-lg"><strong>Time:</strong> {event?.startTime || event?.start_time || "N/A"} - {event?.endTime || event?.end_time || "N/A"}</span>
                </div>
                <div className="flex items-center gap-4">
                    <MapPin size={24} className="text-purple-500 flex-shrink-0" />
                    <span className="text-lg"><strong>Venue:</strong> {event?.venue || event?.venue_name || "Not set"}</span>
              </div>
              <div className="flex items-center gap-4">
                  <Heart size={24} className="text-pink-500 flex-shrink-0" />
                  <span className="text-lg"><strong>Type:</strong> {event?.eventType || event?.category || "N/A"}</span>
              </div>
          </div>
      </div>
      

      {/* --- Description --- */}
      {(event?.details || event?.description) && (
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-4">Description</h2>
          <p className="text-gray-700 text-lg whitespace-pre-wrap p-6 bg-gray-50 rounded-2xl border shadow-sm">
            {event.details || event.description}
          </p>
        </div>
      )}

      {/* --- Hosts (Simplified) --- */}
      {event?.hosts?.length > 0 && (
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-6">Hosts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {event.hosts.map((host, index) => (
              <div key={host?.id || index} className="p-6 bg-gray-50 rounded-2xl border shadow-sm">
                <p className="font-bold text-xl flex items-center gap-3">
                    <Users size={24} /> {host?.name || "Unnamed Host"}
                </p>
                {host?.parentNames?.length > 0 && (
                  <p className="text-base text-gray-600 pl-2 mt-2">
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
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-6">Agenda</h2>
          {event.agenda.map((day, index) => (
            <div key={day?.id || index} className="mb-6 p-6 bg-gray-50 rounded-2xl border shadow-sm">
              <h3 className="font-bold text-2xl mb-4">
                {day?.title || `Day ${index + 1}`} ({day?.date || "No Date"})
              </h3>
              <ul className="list-disc list-inside space-y-3">
                {day?.activities?.length > 0 ? (
                    day.activities.map((activity, actIndex) => (
                        <li key={activity?.id || actIndex} className="text-lg">
                            <strong>{activity?.time || "Time:"}</strong> {activity?.activity || "No activity description."}
                        </li>
                    ))
                ) : (
                    <li className="text-lg">No activities listed for this day.</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
