import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./redux/store"
import Header from "./components/Header"
import ProtectedRoute from "./components/ProtectedRoute"

// Pages
import Home from "./pages/Home"
import Homepage from "./pages/Homepage"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import About from "./pages/About"
import PricingSection from "./pages/Pricing"
import EventManagement from "./pages/EventManagement"

function App() {
  return (
    
    
    <Provider store={store}>
      <Router>
        <div className="App">
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

            {/* Use EventManagement for all event routes */}
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <EventManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute>
                  <EventManagement />
                </ProtectedRoute>
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
