import { EventCard, EmptyEventCard } from "./EventCard";
import { AnalyticsWidget } from "./AnalyticsWidget";

export function EventList({
  events,
  onCreateEvent,
  onViewEvent,
  analyticsData,
}) {
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
        </div>

        {/* Analytics Widget */}
        <div className="mb-8 sm:mb-12">
          <AnalyticsWidget data={analyticsData} />
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

        {events.length === 0 && <EmptyEventCard onCreate={onCreateEvent} />}
      </div>
    </section>
  );
}
