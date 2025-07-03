"use client"

import { useEffect, useState } from "react"
import { Users, Sparkles, ArrowRight, Target, AlertCircle } from "lucide-react"

export default function About() {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching team members...") // Debug log

        const response = await fetch("https://snwv9cpm-8000.asse.devtunnels.ms/api/team-members/")

        console.log("Response status:", response.status) // Debug log

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Fetched data:", data) // Debug log

        setTeamMembers(data)
      } catch (err) {
        console.error("Error fetching team members:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

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

  const scrollToTeam = () => {
    const teamSection = document.getElementById("team-section")
    if (teamSection) {
      teamSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Easy Planning",
      description:
        "Streamlined tools to plan every detail of your event with precision and ease, making complex coordination simple.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Guest Management",
      description: "Effortlessly manage invitations, RSVPs, and guest communications in one centralized platform.",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Premium Experience",
      description: "Create memorable experiences with our premium features and extensive customization options.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-white pt-20 pb-20 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-1.svg')] bg-center bg-no-repeat bg-cover opacity-20"></div>

        {/* Floating Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold leading-[100%] tracking-[-2px] text-white mb-8 animate-on-scroll">
              Behind Every Great Event Is a <span className="block text-right">Passionate Team</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-12 animate-on-scroll">
              At GoEvent, we help people plan unforgettable events with ease and creativity. Our platform brings
              simplicity to celebrations, making every moment memorable and stress-free.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-on-scroll">
              <button
                onClick={scrollToTeam}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                Meet Our Team
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Start Planning
              </button>
            </div>

            {/* Stats or Social Proof */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-on-scroll">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{loading ? "--" : teamMembers.length}</div>
                <div className="text-white/80 text-sm">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">15</div>
                <div className="text-white/80 text-sm">Events Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">30</div>
                <div className="text-white/80 text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-20"></div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-8 animate-on-scroll">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Our Journey</h2>
          </div>
          <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed">
            <p className="mb-6">
              Founded with a vision to revolutionize event planning, we began as a passionate team dedicated to solving
              the complexities of organizing memorable experiences. What started as a simple idea has grown into a
              comprehensive platform trusted by event planners worldwide.
            </p>
            <p className="mb-6">
              From intimate birthday parties to corporate conferences, we've helped thousands of organizers create
              seamless events that exceed expectations. Our platform combines cutting-edge technology with intuitive
              design to make event planning accessible to everyone.
            </p>
            <p>
              Today, we continue to innovate and expand our capabilities, always keeping our users' success at the heart
              of everything we do. Every feature we build is designed to make your event planning journey smoother and
              more enjoyable.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-8 bg-gray-50 animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600">We provide everything you need for successful events</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-blue-600 mb-6">{value.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team-section" className="py-20 px-4 sm:px-8 animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Left Sidebar - Order 2 on mobile, 1 on desktop */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-8">
                <div className="mb-8">
                  <span className="text-blue-600 font-semibold">Our team</span>
                  <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Leadership Team</h2>
                  <p className="text-gray-600 mb-6">
                    We're a cross-disciplinary team that loves to create great experiences for our customers.
                  </p>
                </div>
                <div className="space-y-4">
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    About our culture →
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-700 font-medium">
                    Join our team →
                  </a>
                </div>
              </div>
            </div>

            {/* Team Grid - Order 1 on mobile, 2 on desktop */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              {/* Debug Info */}
              <div className="mb-4 p-4 bg-gray-100 rounded-lg text-sm">
                <div>Loading: {loading ? "Yes" : "No"}</div>
                <div>Error: {error || "None"}</div>
                <div>Team Members Count: {teamMembers.length}</div>
                <div>API Response: {JSON.stringify(teamMembers).substring(0, 100)}...</div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-20">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load team members</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Team Members Grid */}
              {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      {/* Profile Image */}
                      <div className="mb-6">
                        <img
                          src={member.profile_image || "/placeholder.svg?height=128&width=128"}
                          alt={member.name}
                          className="w-32 h-32 rounded-full mx-auto object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=128&width=128"
                          }}
                        />
                      </div>

                      {/* Member Info */}
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                        <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                      </div>

                      {/* Social Links */}
                      <div className="flex justify-center space-x-4">
                        {member.facebook_url && (
                          <a
                            href={member.facebook_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </a>
                        )}
                        {member.telegram_url && (
                          <a
                            href={member.telegram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && teamMembers.length === 0 && (
                <div className="text-center py-20">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No team members found</h3>
                  <p className="text-gray-600">Team members will appear here once they're added.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-8 bg-blue-600 animate-on-scroll">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Trusted by Event Planners Worldwide</h2>
          <p className="text-xl text-blue-100 mb-16">Join thousands of successful event organizers</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Events Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
