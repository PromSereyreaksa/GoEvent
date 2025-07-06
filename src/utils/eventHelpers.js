/**
 * Event utility functions for data validation and formatting
 */

/**
 * Validates and normalizes event data to ensure all required properties exist
 * @param {Object} event - Raw event data
 * @returns {Object} - Normalized event data with fallback values
 */
export const normalizeEventData = (event) => {
  if (!event || typeof event !== "object") {
    return {
      id: null,
      name: "Untitled Event",
      eventType: "wedding",
      type: "wedding",
      venue: "TBD",
      date: null,
      startTime: null,
      endTime: null,
      image: "/placeholder.svg?height=200&width=400",
      details: "",
      agenda: [],
      hosts: [],
      youtubeUrl: null,
      googleMapLink: null,
    };
  }

  return {
    id: event.id || null,
    name: event.name || "Untitled Event",
    eventType: event.eventType || event.type || "wedding",
    type: event.type || event.eventType || "wedding",
    venue: event.venue || "TBD",
    date: event.date || null,
    startTime: event.startTime || event.start_time || null,
    endTime: event.endTime || event.end_time || null,
    image:
      event.image || event.thumbnail || "/placeholder.svg?height=200&width=400",
    details: event.details || event.description || "",
    agenda: event.agenda || [],
    hosts: event.hosts || [],
    youtubeUrl: event.youtubeUrl || event.youtube_url || null,
    googleMapLink: event.googleMapLink || event.google_map_link || null,
    // Preserve any additional properties
    ...event,
  };
};

/**
 * Validates an array of events and normalizes each one
 * @param {Array} events - Array of raw event data
 * @returns {Array} - Array of normalized event data
 */
export const normalizeEventsArray = (events) => {
  if (!Array.isArray(events)) {
    console.warn("normalizeEventsArray: Expected array, got:", typeof events);
    return [];
  }

  return events.map((event, index) => {
    try {
      return normalizeEventData(event);
    } catch (error) {
      console.error(`Error normalizing event at index ${index}:`, error, event);
      return normalizeEventData(null); // Return default event
    }
  });
};

/**
 * Formats time string to a more readable format
 * @param {string} timeString - Time in HH:MM or HH:MM:SS format
 * @returns {string} - Formatted time string
 */
export const formatTime = (timeString) => {
  if (!timeString) {
    return "Time TBD";
  }

  try {
    const timeParts = timeString.split(":");
    if (timeParts.length < 2) {
      return "Time TBD";
    }

    const [hours, minutes] = timeParts;
    const date = new Date();
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes));

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.warn("Error formatting time:", timeString, error);
    return "Time TBD";
  }
};

/**
 * Formats date string to a more readable format
 * @param {string} dateString - Date string
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) {
    return "Date TBD";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Date TBD";
    }

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.warn("Error formatting date:", dateString, error);
    return "Date TBD";
  }
};

/**
 * Gets event type label
 * @param {string} eventType - Event type
 * @returns {string} - Event type label
 */
export const getEventTypeLabel = (eventType) => {
  const eventTypes = {
    wedding: "Wedding",
    birthday: "Birthday",
    anniversary: "Anniversary",
    corporate: "Corporate",
    party: "Party",
    conference: "Conference",
    workshop: "Workshop",
    meeting: "Meeting",
    celebration: "Celebration",
    other: "Other",
  };
  return eventTypes[eventType] || "Event";
};

/**
 * Validates if an event has the minimum required data
 * @param {Object} event - Event data
 * @returns {boolean} - True if event has minimum required data
 */
export const isValidEvent = (event) => {
  return !!(event && event.id && event.name);
};

/**
 * Filters events based on search criteria
 * @param {Array} events - Array of events
 * @param {string} searchTerm - Search term
 * @returns {Array} - Filtered events
 */
export const filterEvents = (events, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) {
    return events;
  }

  const term = searchTerm.toLowerCase().trim();

  return events.filter((event) => {
    const searchableFields = [
      event.name,
      event.venue,
      event.details,
      event.eventType,
      event.type,
    ];

    return searchableFields.some(
      (field) => field && field.toLowerCase().includes(term)
    );
  });
};
