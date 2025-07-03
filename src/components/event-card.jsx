import { Calendar, Clock, MapPin, Edit3, Trash2 } from 'lucide-react'

export function EventCard({ event, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Event Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
        <img
          src={event.image || "/placeholder.svg?height=200&width=400"}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => onEdit(event)}
            className="p-2 bg-white/90 text-blue-600 hover:bg-white rounded-full transition-colors shadow-sm"
            aria-label="Edit event"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="p-2 bg-white/90 text-red-600 hover:bg-white rounded-full transition-colors shadow-sm"
            aria-label="Delete event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-black mb-4">
          {event.name}
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-neutral-600">
            <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="text-sm">{event.venue}</span>
          </div>

          <div className="flex items-center gap-3 text-neutral-600">
            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="text-sm">
              {formatDate(event.date)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-neutral-600">
            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="text-sm">
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
