import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./redux/store"
import Header from "./components/Header"
import ProtectedRoute from "./components/ProtectedRoute"
import RoleProtectedRoute from "./components/RoleProtectedRoute"
import EventManagementWrapper from "./components/EventManagementWrapper"
import CreateEventProtection from "./components/CreateEventProtection"
import SecurityMonitor from "./components/SecurityMonitor"

// redux
import { useDispatch } from "react-redux";
import { initializeAuth } from "./redux/slices/authSlice";

// Pages
import Home from "./pages/Home"
import Homepage from "./pages/Homepage"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import About from "./pages/About"
import PricingSection from "./pages/Pricing"
import EventManagement from "./pages/EventManagement"
import Guests from "./components/Guests"

// effect
import { useEffect } from "react"

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

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

            {/* Use EventManagement for all event routes with comprehensive vendor protection */}
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <CreateEventProtection>
                    <EventManagementWrapper>
                      <EventManagement />
                    </EventManagementWrapper>
                  </CreateEventProtection>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute>
                  <CreateEventProtection>
                    <EventManagementWrapper>
                      <EventManagement />
                    </EventManagementWrapper>
                  </CreateEventProtection>
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

            {/* Block any direct event creation routes - vendor only */}
            <Route
              path="/create-event"
              element={
                <RoleProtectedRoute requiredRole="vendor" fallbackRoute="/homepage">
                  <Navigate to="/events?create=true" replace />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/event/create"
              element={
                <RoleProtectedRoute requiredRole="vendor" fallbackRoute="/homepage">
                  <Navigate to="/events?create=true" replace />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/new-event"
              element={
                <RoleProtectedRoute requiredRole="vendor" fallbackRoute="/homepage">
                  <Navigate to="/events?create=true" replace />
                </RoleProtectedRoute>
              }
            />

            {/* Catch all other routes and redirect to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  )
}

export default App
