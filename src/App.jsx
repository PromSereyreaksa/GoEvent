"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./redux/store"
import Header from "./components/layout/Header"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import EventManagementWrapper from "./components/EventManagementWrapper"
import SecurityMonitor from "./components/SecurityMonitor"

// redux
import { useDispatch } from "react-redux"
import { initializeAuth } from "./redux/slices/authSlice"

// Pages
import Home from "./pages/Home"
import Homepage from "./pages/Homepage"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import About from "./pages/About"
import PricingSection from "./pages/Pricing"
import EventManagement from "./pages/EventManagement"
import EventCreate from "./pages/EventCreate"
import EventView from "./pages/EventView"
import EventEdit from "./pages/EventEdit"
import Settings from "./pages/Settings"
import User from "./pages/User"
import TeamCollaboration from "./pages/TeamCollaboration"
import Guests from "./components/Guests"

// effect
import { useEffect } from "react"

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <SecurityMonitor />
          <Header />
          <Routes>
            {/* Public Routes - Only Landing Page and About */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            {/* Auth Routes - Accessible when not authenticated */}
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            {/* Protected Routes - All other pages require authentication */}
            <Route
              path="/homepage"
              element={
                <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navigate to="/homepage" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pricing"
              element={
                <ProtectedRoute>
                  <PricingSection />
                </ProtectedRoute>
              }
            />

            {/* Event Routes - Allow all authenticated users to view, but restrict creation/editing to vendors */}
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <EventManagementWrapper>
                    <EventManagement />
                  </EventManagementWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/create"
              element={
                <ProtectedRoute>
                  <EventManagementWrapper>
                    <EventCreate />
                  </EventManagementWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute>
                  <EventManagementWrapper>
                    <EventView />
                  </EventManagementWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id/edit"
              element={
                <ProtectedRoute>
                  <EventManagementWrapper>
                    <EventEdit />
                  </EventManagementWrapper>
                </ProtectedRoute>
              }
            />

            {/* Guests Route - Dedicated guest management page */}
            <Route
              path="/guests"
              element={
                <ProtectedRoute>
                  <Guests />
                </ProtectedRoute>
              }
            />

            {/* Settings Route */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* User Profile Route */}
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <User />
                </ProtectedRoute>
              }
            />

            {/* Team Collaboration Route */}
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <TeamCollaboration />
                </ProtectedRoute>
              }
            />

            {/* Legacy event creation routes */}
            <Route path="/create-event" element={<Navigate to="/events/create" replace />} />
            <Route path="/event/create" element={<Navigate to="/events/create" replace />} />
            <Route path="/new-event" element={<Navigate to="/events/create" replace />} />

            {/* Catch all other routes and redirect to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  )
}

export default App
