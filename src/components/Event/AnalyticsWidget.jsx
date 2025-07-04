import {
  BarChart3,
  Calendar,
  Users,
  TrendingUp,
  Heart,
  TrendingDown,
} from "lucide-react";

// Enhanced Analytics Widget Component
export function AnalyticsWidget({ data }) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-2xl animate-on-scroll">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl sm:rounded-2xl flex items-center justify-center">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-black">
            Analytics Overview
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Your event performance insights
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {data.map((metric, index) => (
          <div key={metric.title} className="text-center group">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-2 sm:mb-4 group-hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div
                className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${
                  metric.color === "text-blue-600"
                    ? "from-blue-100 to-blue-200"
                    : metric.color === "text-green-600"
                    ? "from-green-100 to-green-200"
                    : metric.color === "text-purple-600"
                    ? "from-purple-100 to-purple-200"
                    : "from-pink-100 to-pink-200"
                } mb-2 sm:mb-3`}
              >
                <metric.icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${metric.color}`}
                />
              </div>
              <div
                className={`flex items-center justify-center gap-1 text-xs font-semibold ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                } mb-1 sm:mb-2`}
              >
                {metric.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{metric.change}</span>
              </div>
              <p className="text-xs text-gray-600 font-medium mb-1">
                {metric.title}
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
                {metric.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
