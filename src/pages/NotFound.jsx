"use client"
import { useEffect } from "react"
import { Home, ArrowLeft, Search, Calendar, Users } from "lucide-react"

const NotFound = () => {
  // Add scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        }
      })
    }, observerOptions)

    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll(".animate-on-scroll")
    animatedElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = "/"
    }
  }

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans']">
      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: scale(1);
        }

        .animate-on-scroll.delay-100 {
          transition-delay: 0.1s;
        }

        .animate-on-scroll.delay-200 {
          transition-delay: 0.2s;
        }

        .animate-on-scroll.delay-300 {
          transition-delay: 0.3s;
        }

        .animate-on-scroll.delay-400 {
          transition-delay: 0.4s;
        }

        .hero-gradient {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #ffffff 100%);
        }

        .floating-element {
          animation: float 6s ease-in-out infinite;
        }

        .floating-element:nth-child(2) {
          animation-delay: -2s;
        }

        .floating-element:nth-child(3) {
          animation-delay: -4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          80%, 100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        .error-number {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Hero Section with 404 Error */}
      <section className="relative hero-gradient pt-16 sm:pt-20 pb-32 sm:pb-40 lg:pb-48 overflow-hidden min-h-screen flex items-center">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-1.svg')] bg-center bg-no-repeat bg-cover opacity-20 scale-110 sm:scale-100"></div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="floating-element absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="floating-element absolute bottom-40 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center animate-on-scroll">
            {/* 404 Number */}
            <div className="mb-8 animate-on-scroll">
              <div className="text-8xl sm:text-9xl lg:text-[12rem] font-bold text-white/90 mb-4 leading-none">404</div>
              <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[110%] sm:leading-[115%] tracking-[-1px] sm:tracking-[-2px] text-white mb-6 sm:mb-8 animate-on-scroll delay-100">
              Oops! Page Not Found
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto px-4 mb-10 sm:mb-12 animate-on-scroll delay-200 leading-relaxed">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you might
              have entered the wrong URL. Let's get you back on track!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-on-scroll delay-300 mb-12">
              <a
                href="/"
                className="group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 inline-flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto justify-center"
              >
                <Home className="w-5 h-5" />
                Go Home
              </a>

              <button
                onClick={handleGoBack}
                className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 inline-flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-20"></div>
      </section>

      {/* Helpful Links Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-on-scroll">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Search className="w-4 h-4" />
              Looking for something specific?
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[120%] tracking-[-1.5px] sm:tracking-[-2.5px] text-black mb-6">
              Popular Pages
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Here are some popular pages that might help you find what you're looking for
            </p>
          </div>

          {/* Popular Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-on-scroll delay-200">
            <a
              href="/events"
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-center group hover:scale-105"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Events</h3>
              <p className="text-sm text-neutral-600">Manage your events</p>
            </a>

            <a
              href="/about"
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-center group hover:scale-105"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">About Us</h3>
              <p className="text-sm text-neutral-600">Meet our team</p>
            </a>

            <a
              href="/contact"
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-center group hover:scale-105"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Contact</h3>
              <p className="text-sm text-neutral-600">Get in touch</p>
            </a>

            <a
              href="/help"
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-center group hover:scale-105"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Help Center</h3>
              <p className="text-sm text-neutral-600">Find answers</p>
            </a>
          </div>

          {/* Additional Help Text */}
          <div className="text-center mt-12 animate-on-scroll delay-300">
            <p className="text-neutral-600 mb-4">Still can't find what you're looking for?</p>
            <a href="/contact" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              Contact our support team →
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">GoEvent Platform Stats</h2>
            <p className="text-blue-100 text-lg">Join thousands of successful event organizers</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="animate-on-scroll delay-200">
              <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">10K+</div>
              <div className="text-blue-100 text-sm sm:text-base">Events Created</div>
            </div>
            <div className="animate-on-scroll delay-300">
              <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">50K+</div>
              <div className="text-blue-100 text-sm sm:text-base">Happy Customers</div>
            </div>
            <div className="animate-on-scroll delay-400">
              <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">99.9%</div>
              <div className="text-blue-100 text-sm sm:text-base">Uptime</div>
            </div>
            <div className="animate-on-scroll delay-500">
              <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">24/7</div>
              <div className="text-blue-100 text-sm sm:text-base">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NotFound
