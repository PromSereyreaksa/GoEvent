"use client"
import { X, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  type = "warning", // warning, danger, success, info
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  children,
}) => {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <XCircle className="w-6 h-6 text-red-500" />
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case "info":
        return <Info className="w-6 h-6 text-blue-500" />
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />
    }
  }

  const getButtonStyles = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500"
      case "success":
        return "bg-green-600 hover:bg-green-700 focus:ring-green-500"
      case "info":
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
      default:
        return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={loading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {message && <p className="text-gray-600 mb-4">{message}</p>}
          {children}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${getButtonStyles()}`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
