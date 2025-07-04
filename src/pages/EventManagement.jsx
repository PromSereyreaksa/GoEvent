"use client";

import { useState, useEffect } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "../components/Event/SidebarProvider";
import { AppSidebar } from "../components/Event/AppSidebar";
import { NotificationsDropdown } from "../components/Event/NotificationsDropdown";
import { EventList } from "../components/Event/EventList";
import { EventForm } from "../components/Event/EventForm";
import { EventInformation } from "../components/Event/EventInformation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  Separator,
} from "../components/Event/BreadcrumbComponents";
import {
  analyticsData,
  notifications,
  sampleEvents,
} from "../components/Event/data";
import {
  animationStyles,
  useScrollAnimation,
} from "../components/Event/animations";
import "../styles/mobile-enhancements.css";

// Main Event Management Component
export default function EventManagement() {
  const [currentView, setCurrentView] = useState("list");
  const [events, setEvents] = useState(sampleEvents);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [formData, setFormData] = useState({
    eventType: "",
    customEventType: "",
    name: "",
    details: "",
    agenda: [], // Changed to array for multi-day agenda
    venue: "",
    hosts: [],
    date: "",
    startTime: "",
    endTime: "",
    youtubeUrl: "",
    googleMapLink: "",
    image: "",
  });

  // Add scroll animation effect
  useEffect(() => {
    const cleanup = useScrollAnimation();
    return cleanup;
  }, [currentView]);

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

  const resetForm = () => {
    setFormData({
      eventType: "",
      customEventType: "",
      name: "",
      details: "",
      agenda: [], // Changed to array for multi-day agenda
      venue: "",
      hosts: [],
      date: "",
      startTime: "",
      endTime: "",
      youtubeUrl: "",
      googleMapLink: "",
      image: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateEvent = () => {
    setCurrentView("create");
    resetForm();
    // Initialize with exactly 2 hosts (bride and groom) and one agenda day
    setFormData((prev) => ({
      ...prev,
      hosts: [
        { id: Date.now(), name: "", parentNames: [""] },
        { id: Date.now() + 1, name: "", parentNames: [""] },
      ],
      agenda: [
        {
          id: Date.now() + 2,
          date: "",
          title: "",
          activities: [{ id: Date.now() + 3, time: "", activity: "" }],
        },
      ],
    }));
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData(event);
    setCurrentView("edit");
  };

  const handleViewEvent = (event) => {
    setViewingEvent(event);
    setCurrentView("view");
  };

  const handleDeleteEvent = (eventId) => {
    console.log("Deleting event with ID:", eventId);
    console.log("Current events:", events);

    if (window.confirm("Are you sure you want to delete this event?")) {
      const updatedEvents = events.filter((event) => {
        console.log("Checking event:", event.id, "against:", eventId);
        return event.id !== eventId;
      });

      console.log("Updated events:", updatedEvents);
      setEvents(updatedEvents);
    }
  };

  const handleSaveEvent = () => {
    if (currentView === "create") {
      const newEvent = {
        ...formData,
        id: Date.now(),
      };
      setEvents([...events, newEvent]);
    } else if (currentView === "edit") {
      setEvents(
        events.map((event) =>
          event.id === editingEvent.id
            ? { ...formData, id: editingEvent.id }
            : event
        )
      );
    }
    setCurrentView("list");
    resetForm();
    setEditingEvent(null);
    setViewingEvent(null);
  };

  const handleCancel = () => {
    setCurrentView("list");
    resetForm();
    setEditingEvent(null);
    setViewingEvent(null);
  };

  const handleNavigation = (view) => {
    if (view === "create") {
      handleCreateEvent();
    } else {
      setCurrentView(view);
    }
  };

  // Event List View
  if (currentView === "list") {
    return (
      <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] overflow-hidden smooth-scroll">
        <style jsx>{animationStyles}</style>

        <SidebarProvider>
          <AppSidebar onNavigate={handleNavigation} currentView={currentView} />
          <SidebarInset>
            {/* Main Content */}
            <main className="flex-1 overflow-auto safe-area-padding">
              {/* Header - Mobile Responsive */}
              <div className="flex h-14 sm:h-16 shrink-0 items-center gap-2 sm:gap-4 bg-white border-b border-gray-200 px-4 sm:px-6">
                <SidebarTrigger className="-ml-1 p-1.5 sm:p-2" />
                <Separator
                  orientation="vertical"
                  className="mr-2 h-4 hidden sm:block"
                />
                <Breadcrumb className="hidden sm:block">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                {/* Mobile title */}
                <div className="sm:hidden">
                  <h1 className="text-lg font-semibold text-gray-900">
                    Dashboard
                  </h1>
                </div>
                <div className="ml-auto flex items-center gap-2 sm:gap-3">
                  <NotificationsDropdown notifications={notifications} />
                </div>
              </div>

              <EventList
                events={events}
                onCreateEvent={handleCreateEvent}
                onViewEvent={handleViewEvent}
                analyticsData={analyticsData}
              />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    );
  }

  // Event Information View
  if (currentView === "view") {
    return (
      <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] overflow-hidden smooth-scroll">
        <style jsx>{animationStyles}</style>
        <EventInformation
          event={viewingEvent}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onBack={() => setCurrentView("list")}
        />
      </div>
    );
  }

  // Create/Edit Event Form View
  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] overflow-hidden smooth-scroll">
      <style jsx>{animationStyles}</style>

      <SidebarProvider>
        <AppSidebar onNavigate={handleNavigation} currentView={currentView} />
        <SidebarInset>
          {/* Header - Mobile Responsive */}
          <div className="flex h-14 sm:h-16 shrink-0 items-center gap-2 sm:gap-4 bg-white border-b border-gray-200 px-4 sm:px-6">
            <SidebarTrigger className="-ml-1 p-1.5 sm:p-2" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 hidden sm:block"
            />
            <Breadcrumb className="hidden sm:block">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {currentView === "create" ? "Create Event" : "Edit Event"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            {/* Mobile title */}
            <div className="sm:hidden">
              <h1 className="text-lg font-semibold text-gray-900">
                {currentView === "create" ? "Create Event" : "Edit Event"}
              </h1>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 overflow-auto safe-area-padding">
            <section className="py-8 sm:py-12 lg:py-16 xl:py-24 px-4 sm:px-6 lg:px-8">
              <EventForm
                formData={formData}
                onInputChange={handleInputChange}
                onFileUpload={handleFileUpload}
                onSave={handleSaveEvent}
                onCancel={handleCancel}
                isEdit={currentView === "edit"}
              />
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
