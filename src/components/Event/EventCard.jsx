import { Calendar, MapPin, Clock, Plus } from "lucide-react";

export function EventCard({ event, onView }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getEventTypeLabel = (eventType) => {
    const eventTypes = {
      wedding: "Wedding",
    };
    return eventTypes[eventType] || "Wedding";
  };

  return (
    <div
      onClick={() => onView(event)}
      className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-on-scroll cursor-pointer"
    >
      {/* Event Image */}
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200">
        <img
          src={event.image || "/placeholder.svg?height=256&width=400"}
          alt={event.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Event Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-black">{event.name}</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
            {getEventTypeLabel(event.eventType)}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium">{event.venue}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm font-medium">
              {formatDate(event.date)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm font-medium">
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmptyEventCard({ onCreate }) {
  return (
    <div className="text-center py-20 animate-on-scroll">
      <div className="bg-white rounded-3xl p-12 max-w-md mx-auto border border-gray-200 shadow-2xl">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-black mb-2">No Events Yet</h3>
        <p className="text-gray-600 mb-6">
          Get started by creating your first event
        </p>
        <button
          onClick={onCreate}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Create Your First Event
        </button>
      </div>
    </div>
  );
}
