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

        // Simplified logic to find the event by ID, comparing as strings
        const sampleEvent = sampleEvents.find((e) => e.id.toString() === id);
        
        if (sampleEvent) {
          setEvent(sampleEvent);
        } else {
          const data = await eventAPI.getEvent(id);
          setEvent(data);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    } else {
      setError("No event ID provided");
      setLoading(false);
    }
  }, [id]);

  const handleBack = () => {
    navigate("/events");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading event...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-6">{error || "The event you're looking for doesn't exist."}</p>
            <button onClick={handleBack} className="bg-blue-600 text-white px-6 py-3 rounded-lg">
                Back to Events
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans']">
      <style>{animationStyles}</style>
      
      {/* Render the simplified component, passing only the needed props */}
      <EventInformation
          event={event}
          onBack={handleBack}
        />
    </div>
  );
}
