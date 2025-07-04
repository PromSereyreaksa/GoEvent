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
        className="relative p-2 sm:p-3 text-gray-600 hover:bg-gray-100 rounded-xl sm:rounded-2xl transition-colors"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center font-bold shadow-lg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Mobile overlay */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 z-50 max-h-[80vh] sm:max-h-none overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="font-bold text-base sm:text-lg text-black">
                Notifications
              </h3>
              <p className="text-sm text-gray-600">
                Stay updated with your events
              </p>
            </div>
            <div className="max-h-64 sm:max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                    notification.unread ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                      <notification.icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
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
        </>
      )}
    </div>
  );
}
