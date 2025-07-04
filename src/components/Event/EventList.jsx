import { Plus } from "lucide-react";
import { EventCard, EmptyEventCard } from "./EventCard";
import { AnalyticsWidget } from "./AnalyticsWidget";

export function EventList({
  events,
  onCreateEvent,
  onViewEvent,
  analyticsData,
}) {
  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-12 animate-on-scroll">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[120%] tracking-[-1.5px] sm:tracking-[-2.5px] text-gray-900 mb-4">
              Your Events
            </h2>
            <p className="text-lg text-gray-600">
              Manage all your events in one place
            </p>
          </div>
          <button
            onClick={onCreateEvent}
            className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 shadow-lg animate-on-scroll delay-200 w-fit"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        </div>

        {/* Analytics Widget */}
        <div className="mb-12">
          <AnalyticsWidget data={analyticsData} />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              onView={onViewEvent}
              className={`animate-on-scroll delay-${200 + index * 100}`}
            />
          ))}
        </div>

        {events.length === 0 && <EmptyEventCard onCreate={onCreateEvent} />}
      </div>
    </section>
  );
}
