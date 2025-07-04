import { useState } from "react";
import { Bell } from "lucide-react";

// Enhanced Notifications Dropdown Component
export function NotificationsDropdown({ notifications }) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-gray-200 z-50">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg text-black">Notifications</h3>
            <p className="text-sm text-gray-600">
              Stay updated with your events
            </p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                  notification.unread ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                    <notification.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-black">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {notification.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 font-medium">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
