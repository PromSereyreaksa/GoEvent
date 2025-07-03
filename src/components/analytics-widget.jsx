import { TrendingUp, TrendingDown, Calendar, Users, Heart, CreditCard } from 'lucide-react'

const analyticsData = [
  {
    title: "Total Events",
    value: "24",
    change: "+12.5%",
    trend: "up",
    icon: Calendar,
    color: "text-blue-600",
  },
  {
    title: "Attendees",
    value: "1,247",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-green-600",
  },
  {
    title: "Revenue",
    value: "$12.4K",
    change: "+15.3%",
    trend: "up",
    icon: CreditCard,
    color: "text-purple-600",
  },
  {
    title: "Satisfaction",
    value: "94%",
    change: "-2.1%",
    trend: "down",
    icon: Heart,
    color: "text-pink-600",
  },
]

export function AnalyticsWidget() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-2">Analytics Overview</h3>
      <p className="text-sm text-gray-600 mb-6">Your event performance overview</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsData.map((metric) => (
          <div key={metric.title} className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 mb-3">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <div className={`flex items-center justify-center gap-1 text-xs ${
              metric.trend === "up" ? "text-green-600" : "text-red-600"
            } mb-1`}>
              {metric.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{metric.change}</span>
            </div>
            <p className="text-xs text-gray-600">{metric.title}</p>
            <p className="text-lg font-bold text-black">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
