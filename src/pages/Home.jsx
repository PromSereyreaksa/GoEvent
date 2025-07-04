"use client"

import PricingSection from "../components/Pricing-Section"
// import Header from "../components/Header"
import {
  Users,
  ArrowDownCircle,
  CalendarHeart,
  ListChecks,
  MessagesSquare,
  CalendarSearch,
  MapPin,
  ImageIcon,
  Music,
  ChevronDown,
  Star,
  ExternalLink,
} from "lucide-react"
import { useEffect } from "react"

export function DefaultPricing() {
  return <PricingSection />
}

export default function Home() {
  const features = [
    {
      icon: <CalendarHeart className="w-8 h-8" />,
      title: "Smart Event Builder",
      description: "Choose from pre-designed event templates ",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "User Friendly",
      description: "Intuitive design that makes it easy for anyone to use and navigate.",
    },
    {
      icon: <ListChecks className="w-8 h-8" />,
      title: "Real-time Guest RSVP & Check-in System",
      description: "Recognized for excellence in design and user experience.",
    },
  ]

  const reviews = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechCorp",
      content:
        "This platform has transformed how we manage our corporate events. The interface is intuitive and the features are exactly what we needed!",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Mike Chen",
      role: "Wedding Planner",
      content:
        "Beautiful design and excellent functionality. My clients love the invitations we create with this platform. Highly recommended!",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Emily Davis",
      role: "Marketing Director",
      content:
        "The best investment we've made for our event management. The analytics and guest management features are outstanding.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  const handleScrollToFeatures = (e) => {
    e.preventDefault()
    const featuresSection = document.getElementById("features")
    if (featuresSection) {
      const targetPosition = featuresSection.offsetTop - 20 // Small offset for better visual
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const observerOptions = {
      threshold: [0, 0.1, 0.5, 0.9, 1],
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target

        if (entry.isIntersecting) {
          if (entry.intersectionRatio > 0.1) {
            element.classList.add("animate-in")
            element.classList.remove("animate-out")
          }
        } else {
          if (entry.boundingClientRect.top < 0) {
            element.classList.add("animate-out")
            element.classList.remove("animate-in")
          } else {
            element.classList.remove("animate-in", "animate-out")
          }
        }
      })
    }, observerOptions)

    const animatedElements = document.querySelectorAll(".animate-on-scroll")
    animatedElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] text-neutral-600">
      {/* <Header /> */}

      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        
        .animate-on-scroll.animate-out {
          opacity: 0.1;
          transform: translateY(-50px) scale(0.85) rotateX(15deg);
          filter: blur(2px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .animate-on-scroll.delay-100 { transition-delay: 0.1s; }
        .animate-on-scroll.delay-200 { transition-delay: 0.2s; }
        .animate-on-scroll.delay-300 { transition-delay: 0.3s; }
        .animate-on-scroll.delay-400 { transition-delay: 0.4s; }
        .animate-on-scroll.delay-500 { transition-delay: 0.5s; }
        .animate-on-scroll.delay-600 { transition-delay: 0.6s; }

        @keyframes bounce-indicator {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .scroll-indicator {
          animation: bounce-indicator 2s infinite;
        }

        @media (max-width: 768px) {
          .animate-on-scroll {
            transform: translateY(20px) scale(0.98);
          }
          .animate-on-scroll.animate-out {
            transform: translateY(-30px) scale(0.9);
            filter: blur(1px);
          }
        }
      `}</style>

      {/* Hero Section */}
<section className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-white pt-20 pb-20 overflow-hidden">
{/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/cta-grid.svg')] bg-center bg-no-repeat bg-cover opacity-20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-[url('/cloud.svg')] bg-repeat-x bg-bottom opacity-30"></div>
<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 rounded-3xl overflow-hidden">
<div className="text-center">
<div className="mx-auto px-2 sm:px-5 mb-8 sm:mb-16 animate-on-scroll">
<h1 className="text-3xs sm:text-6xl md:text-8xl lg:text-[160px] font-bold leading-[100%] tracking-[-2px] text-white uppercase mb-4 sm:mb-8 mt-12">
Plan with
<span className="block text-right">Ease</span>
</h1>
</div>
{/* Hero Content Grid */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
<div className="flex flex-col gap-4 sm:gap-8 max-w-md animate-on-scroll delay-200">
<div className="flex flex-col gap-4">
<p className="text-white text-sm sm:text-base lg:text-[18px] font-semibold uppercase text-left px-2 sm:px-0">
Elevate your event beyond the ordinary. Seamless, smart, and
designed to impress at every turn.
</p>
</div>
</div>
{/* Main Image */}
<div className="relative animate-on-scroll delay-300 flex justify-center items-center">
<img
src="/Hand-Image-p-1080.png"
alt="Platform Preview"
className="max-w-[200px] sm:max-w-xs md:max-w-md mx-auto"
/>
{/* Floating Cards */}
<div className="absolute -left-20 top-1/4 transform -rotate-12 hidden lg:block">
<div className="bg-white rounded-3xl rounded-bl-none p-6 shadow-lg">
<p className="text-black text-sm font-bold">
Lightning Fast Performance
</p>
</div>
</div>
<div className="absolute -right-8 top-1/2 transform rotate-12 hidden lg:block">
<div className="bg-white rounded-3xl rounded-br-none p-4 shadow-lg max-w-36">
<p className="text-black text-sm font-bold">
Mobile Optimized
</p>
</div>
</div>
</div>
{/* CTA */}
<div className="flex flex-col gap-4 sm:gap-8 max-w-md animate-on-scroll delay-400">
<div className="flex flex-col gap-4 sm:gap-6">
<p className="text-white py-2 sm:py-5 text-sm sm:text-base lg:text-lg text-left font-semibold uppercase px-2 sm:px-0">
Get started with effortless event management.
</p>
<div className="flex flex-col sm:flex-row gap-4 px-2 sm:px-0">
<a
href="/sign-up"
className="bg-white text-black sm:ml-10 px-4 py-3 sm:py-5 rounded-full font-medium hover:bg-gray-100 hover:scale-105 duration-300 transition-all inline-flex items-center justify-center gap-2"
>
<span>Start Planning</span>
<div className="w-4 h-6 flex items-center justify-center">
<ArrowDownCircle className="w-4 h-4" />
</div>
</a>
</div>
</div>
</div>
</div>
</div>
</div>
{/* Bottom Gradient Overlay */}
<div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-30"></div>
</section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            <div className="bg-gradient-to-b from-blue-500 to-white bg-center bg-no-repeat rounded-3xl flex flex-col justify-end items-center pt-16 sm:pt-24 lg:pt-36 px-4 sm:px-5 pb-0 overflow-hidden animate-on-scroll">
              <img src="/CTA-Device.svg" alt="Feature Preview" className="w-full max-w-2xl rounded-t-3xl shadow-2xl" />
            </div>
            <div className="flex flex-col gap-8 sm:gap-12 lg:gap-20 lg:pr-24 animate-on-scroll delay-200">
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[120%] tracking-[-1px] sm:tracking-[-2.5px] text-black">
                  Beautiful Design Made Simple
                </h2>
                <p className="text-base sm:text-lg leading-[170%] text-neutral-600">
                  Craft Memorable Online Invitations
                </p>
              </div>
              <div className="flex flex-col gap-8 sm:gap-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex flex-col gap-4 sm:gap-6 items-start animate-on-scroll delay-${300 + index * 100}`}
                    >
                      <div className="bg-white rounded-full rounded-bl-none p-2 shadow-lg">
                        <div className="bg-blue-800 rounded-full flex items-center justify-center w-12 h-12 sm:w-15 sm:h-15 text-white">
                          {feature.icon}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:gap-3">
                        <h3 className="text-lg sm:text-xl font-bold text-black">{feature.title}</h3>
                        <p className="text-sm sm:text-base text-neutral-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a
                  href="/features"
                  className="bg-black text-white px-6 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors inline-flex items-center w-fit animate-on-scroll delay-600"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 animate-on-scroll">
        <div className="max-w-[90%] mx-auto bg-gradient-to-br from-blue-500 via-blue-700 to-blue-400 backdrop-blur-lg rounded-3xl shadow-xl p-6 sm:p-8 md:p-12 lg:p-16">
          <div className="flex bg-[url('/grid-1.svg')] flex-col gap-12 sm:gap-16 lg:gap-20">
            <div className="text-center max-w-2xl mx-auto animate-on-scroll">
              <div className="flex flex-col gap-4">
                <span className="text-blue-100 text-base sm:text-lg font-medium">Features</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[120%] tracking-[-1px] sm:tracking-[-2.5px] text-white">
                  Everything You Need
                </h2>
                <p className="text-base sm:text-lg mb-6 leading-[170%] text-white">
                  Powerful features designed to help you create amazing websites
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 sm:gap-6 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-on-scroll">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-black">Google Maps</h3>
                </div>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Seamlessly display event locations with integrated Google Maps.
                </p>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 sm:gap-6 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-on-scroll">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-black">Photo Galleries</h3>
                </div>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Share your favorite event photos in a sleek gallery format.
                </p>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 sm:gap-6 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-on-scroll">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <Music className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-black">Background Music</h3>
                </div>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Add a personal touch to your invitations with music integration.
                </p>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 sm:gap-6 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-on-scroll">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-xl">
                    <CalendarSearch className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-black">Set Reminder</h3>
                </div>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Let guests easily add your event to their own Google Calendar for automatic reminders.
                </p>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 sm:gap-6 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-on-scroll sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-xl">
                    <MessagesSquare className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-black">Guest Messages</h3>
                </div>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  Allow guests to leave messages, well-wishes, or congratulations on the invitation page.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-12 animate-on-scroll">
          <div className="flex flex-col items-center gap-2 text-blue-600">
            <span className="text-sm font-medium">See Our Pricing</span>
            <div className="scroll-indicator">
              <ChevronDown className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] text-neutral-600">
      <section id="pricing" className="animate-on-scroll">
        <DefaultPricing/>
      </section>
    </div>

      {/* Reviews Section */}
      <section id="reviews" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-on-scroll">
            <span className="text-blue-600 text-base sm:text-lg font-medium">Reviews</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[120%] tracking-[-1px] sm:tracking-[-2.5px] text-black mt-4 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-base sm:text-lg leading-[170%] text-neutral-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what real customers have to say about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {reviews.map((review, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-on-scroll delay-${200 + index * 100}`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 text-sm sm:text-base">"{review.content}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar || "/placeholder.svg"}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-black text-sm sm:text-base">{review.name}</h4>
                    <p className="text-gray-500 text-xs sm:text-sm">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 bg-[url('/placeholder.svg?height=400&width=1200')] bg-center bg-no-repeat bg-cover rounded-3xl pt-16 sm:pt-24 lg:pt-36 px-6 sm:px-12 lg:px-20 pb-0 flex flex-col lg:flex-row justify-between items-end gap-8 lg:gap-0 overflow-hidden animate-on-scroll">
            <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 max-w-lg">
              <div className="flex flex-col gap-6 sm:gap-8">
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[120%] tracking-[-1px] sm:tracking-[-2.5px] text-black">
                    Ready to Get Started?
                  </h2>
                  <p className="text-base sm:text-lg leading-[170%] text-neutral-600">
                    Join thousands of satisfied customers who have transformed their online presence
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                      <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-black text-sm sm:text-base font-semibold">Free 14-day trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                      <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-black text-sm sm:text-base font-semibold">No credit card required</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <a
                    href="/sign-up"
                    className="bg-black text-white px-6 sm:px-8 py-4 sm:py-5 rounded-full font-medium hover:bg-gray-800 transition-colors text-center"
                  >
                    Start Planning
                  </a>
                  <a
                    href="/contact"
                    className="text-black px-6 sm:px-8 py-4 sm:py-5 rounded-full font-medium hover:bg-black hover:text-white transition-colors border border-black text-center"
                  >
                    Contact Sales
                  </a>
                </div>
              </div>
            </div>
            <div className="max-w-xs sm:max-w-md lg:-mb-[10%] animate-on-scroll delay-200 self-center lg:self-end">
              <img src="/placeholder.svg?height=400&width=400" alt="CTA Device" className="w-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
