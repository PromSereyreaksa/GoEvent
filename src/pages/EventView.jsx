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

   // Hide header when component mounts
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "none";
    }

    return () => {
      if (header) {
        header.style.display = "block";
      }
    };
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add debugging
        console.log("Fetching event with ID:", id);
        console.log("Sample events:", sampleEvents);

        // Try to find in sample events first
        const sampleEvent = sampleEvents.find((e) => {
          // Handle both string and number IDs
          return e.id === parseInt(id) || e.id === id || e.id.toString() === id;
        });
        
        if (sampleEvent) {
          console.log("Found sample event:", sampleEvent);
          setEvent(sampleEvent);
        } else {
          console.log("Event not found in samples, trying API...");
          // If not found in samples, try API
          const data = await eventAPI.getEvent(id);
          console.log("API returned:", data);
          setEvent(data);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.message || "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    } else {
      console.error("No ID provided");
      setError("No event ID provided");
      setLoading(false);
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
          <p className="text-sm text-gray-500 mb-6">
            Event ID: {id}
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

  // Add debugging for successful render
  console.log("Rendering EventInformation with event:", event);

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans']">
      <style>{animationStyles}</style>
      
      {/* Add fallback rendering if EventInformation component fails */}
      {event ? (
        <EventInformation
          event={event}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBack={handleBack}
        />
      ) : (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Event Details</h1>
          <p>No event data available</p>
        </div>
      )}
    </div>
  );
}