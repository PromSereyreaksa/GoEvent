import { Calendar, MapPin, Clock, Plus } from "lucide-react";

export function EventCard({ event, onView }) {
  console.log("EventCard rendering with event:", event);

  // Safety checks for required fields
  if (!event) {
    console.warn("EventCard: No event data provided");
    return null;
  }

  if (!event.id) {
    console.warn("EventCard: Event missing ID field", event);
  }

  if (!event.name) {
    console.warn("EventCard: Event missing name field", event);
  }

  const formatDate = (dateString) => {
    if (!dateString) {
      console.warn("EventCard: Missing date string", dateString);
      return "Date TBD";
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("EventCard: Invalid date string", dateString);
        return "Invalid Date";
      }

      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("EventCard: Error formatting date", error);
      return "Date Error";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) {
      console.warn("EventCard: Missing time string", timeString);
      return "Time TBD";
    }

    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("EventCard: Error formatting time", error);
      return "Time Error";
    }
  };

  const getEventTypeLabel = (eventType) => {
    const eventTypes = {
      wedding: "Wedding",
    };
    return eventTypes[eventType] || "Wedding";
  };

  return (
    <div
      onClick={() => {
        console.log("EventCard clicked with event:", event);
        onView(event);
      }}
      className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-on-scroll cursor-pointer active:scale-95"
    >
      {/* Event Image */}
      <div className="relative h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-blue-100 to-blue-200">
        <img
          src={event.image || "/placeholder.svg?height=256&width=400"}
          alt={event.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Event Content */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3 gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-black line-clamp-2 leading-tight">
            {event.name || event.title || "Untitled Event"}
          </h3>
          <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold flex-shrink-0">
            {getEventTypeLabel(event.eventType)}
          </span>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium truncate">
              {event.venue || event.location || "Venue TBD"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
            </div>
            <span className="text-sm font-medium">
              {formatDate(event.date)}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
            </div>
            <span className="text-sm font-medium">
              {formatTime(event.startTime || event.start_Time)} -{" "}
              {formatTime(event.endTime || event.end_Time)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmptyEventCard() {
  return (
    <div className="col-span-full text-center py-16 sm:py-20 animate-on-scroll">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 max-w-md mx-auto border border-gray-200 shadow-2xl">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-black mb-2">
          No Events Yet
        </h3>
        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          You haven't created any events yet. Events will appear here once you
          create them.
        </p>
      </div>
    </div>
  );
}
