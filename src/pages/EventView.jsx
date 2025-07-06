"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EventInformation } from "../components/Event/EventInformation";
import { sampleEvents } from "../components/Event/data";
import { animationStyles } from "../components/Event/animations";
import { eventAPI } from "../utils/api";

export default function EventView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to find in sample events first
        const sampleEvent = sampleEvents.find((e) => e.id === parseInt(id));
        if (sampleEvent) {
          setEvent(sampleEvent);
        } else {
          // If not found in samples, try API
          const data = await eventAPI.getEvent(id);
          setEvent(data);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleEdit = (event) => {
    navigate(`/events/${event.id}/edit`);
  };

  const handleDelete = async (eventId) => {
    try {
      await eventAPI.deleteEvent(eventId);
      navigate("/events", { replace: true });
    } catch (err) {
      console.error("Error deleting event:", err);
      // Navigate anyway for now
      navigate("/events", { replace: true });
    }
  };

  const handleBack = () => {
    navigate("/events");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The event you're looking for doesn't exist."}
          </p>
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] overflow-hidden smooth-scroll">
      <style>{animationStyles}</style>
      <EventInformation
        event={event}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBack={handleBack}
      />
    </div>
  );
}
