import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            404
          </div>
          <div className="w-24 h-1 bg-primary-600 dark:bg-primary-400 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Sorry, we couldn't find the page you're looking for. The page might have been moved, 
          deleted, or you might have entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors w-full sm:w-auto"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-2">
            <Search className="w-5 h-5 mr-2" />
            <span className="text-sm">Looking for something specific?</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <Link to="/products" className="text-primary-600 dark:text-primary-400 hover:underline">
              Products
            </Link>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <Link to="/blog" className="text-primary-600 dark:text-primary-400 hover:underline">
              Blog
            </Link>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <Link to="/contact" className="text-primary-600 dark:text-primary-400 hover:underline">
              Contact
            </Link>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <Link to="/about" className="text-primary-600 dark:text-primary-400 hover:underline">
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
