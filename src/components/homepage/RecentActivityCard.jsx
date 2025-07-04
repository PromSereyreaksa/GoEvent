"use client"

import { Clock } from "lucide-react"

export default function RecentActivityCard({ activities }) {
  const getActivityColor = (type) => {
    switch (type) {
      case "event_created":
        return "text-blue-600 bg-blue-100"
      case "guest_registered":
        return "text-green-600 bg-green-100"
      case "event_updated":
        return "text-orange-600 bg-orange-100"
      case "team_invite":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className=" rounded-2xl p-6 shadow-lg border border-blue-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-gray-700 hover:text-gray-900 font-medium">View All</button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${getActivityColor(activity.type)} shadow-sm`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                <p className="text-sm text-gray-700 mt-1">{activity.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600">{activity.time}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500">No recent activity</p>
        </div>
      )}
    </div>
  )
}
