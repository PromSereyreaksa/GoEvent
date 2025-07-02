import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import About from "./pages/About"
import Features from "./pages/Features"
import Reviews from "./pages/Reviews"
import Blog from "./pages/Blog"
import BlogDetail from "./pages/BlogDetail"
import Contact from "./pages/Contact"
import Pricing from "./pages/Pricing"
// import PrivacyPolicy from "./pages/PrivacyPolicy"
// import TermsAndConditions from "./pages/TermsAndConditions"
// import Changelog from "./pages/Changelog"
// import NotFound from "./pages/NotFound"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
// import License from "./pages/License"
// import Product from "./pages/Product"
// import ProductDetail from "./pages/ProductDetail"
// import CategoryDetail from "./pages/CategoryDetail"
// import SKUDetail from "./pages/SKUDetail"
import Checkout from "./pages/Checkout"
// import PayPalCheckout from "./pages/PayPalCheckout"
// import OrderConfirmation from "./pages/OrderConfirmation"
import "./App.css"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/license" element={<License />} />
              <Route path="/products" element={<Product />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/category/:id" element={<CategoryDetail />} />
              <Route path="/sku/:id" element={<SKUDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/paypal-checkout" element={<PayPalCheckout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
