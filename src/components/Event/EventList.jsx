import { EventCard, EmptyEventCard } from "./EventCard";
import { AnalyticsWidget } from "./AnalyticsWidget";
import { useSelector } from "react-redux";
import { useVendorCheck } from "../SecurityMonitor";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export function EventList({ events, onViewEvent, analyticsData }) {
  const { user } = useSelector((state) => state.auth);
  const { isVendor } = useVendorCheck();
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate("/events?create=true");
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 xl:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile Responsive */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center sm:gap-6 mb-8 sm:mb-12 animate-on-scroll">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-[120%] tracking-[-1px] sm:tracking-[-1.5px] lg:tracking-[-2.5px] text-gray-900 mb-2 sm:mb-4">
              Your Events
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Manage all your events in one place
            </p>
          </div>

          {/* Create Event Button - Only for Vendors */}
          {isVendor && (
            <button
              onClick={handleCreateEvent}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          )}
        </div>

        {/* Analytics Widget */}
        <div className="mb-8 sm:mb-12">
          <AnalyticsWidget data={analyticsData} />
        </div>

        {/* Debug Info */}
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
          <h3 className="font-semibold text-gray-800 mb-2">EventList Debug:</h3>
          <p className="text-sm text-gray-600">
            Events received: {events.length}
          </p>
          <p className="text-sm text-gray-600">
            Events array:{" "}
            {JSON.stringify(
              events.map((e) => ({
                id: e.id,
                name: e.name,
                title: e.title,
                date: e.date,
                venue: e.venue,
                eventType: e.eventType,
              })),
              null,
              2
            )}
          </p>
          <p className="text-sm text-gray-600">
            Map function will render: {events.map((e) => e.id).join(", ")}
          </p>
        </div>

        {/* Events Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              onView={onViewEvent}
              className={`animate-on-scroll delay-${200 + index * 100}`}
            />
          ))}
        </div>

        {events.length === 0 && <EmptyEventCard />}
      </div>
    </section>
  );
}
