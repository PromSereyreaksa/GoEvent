"use client";
import { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  Target,
  AlertCircle,
} from "lucide-react";
import { teamAPI } from "../utils/api";

export default function About() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await teamAPI.getMembers();
        setTeamMembers([]);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);

  // Add scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToTeam = () => {
    const teamSection = document.getElementById("team-section");
    if (teamSection) {
      teamSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const values = [
    {
      icon: <Target className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Easy Planning",
      description:
        "Streamlined tools to plan every detail of your event with precision and ease, making complex coordination simple.",
    },
    {
      icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Guest Management",
      description:
        "Effortlessly manage invitations, RSVPs, and guest communications in one centralized platform.",
    },
    {
      icon: <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Premium Experience",
      description:
        "Create memorable experiences with our premium features and extensive customization options.",
    },
  ];

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

        .animate-on-scroll.delay-500 {
          transition-delay: 0.5s;
        }

        .animate-on-scroll.delay-600 {
          transition-delay: 0.6s;
        }

        .hero-gradient {
          background: linear-gradient(
            135deg,
            #3b82f6 0%,
            #2563eb 50%,
            #ffffff 100%
          );
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
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955)
            infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          80%,
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative hero-gradient pt-16 sm:pt-20 pb-32 sm:pb-40 lg:pb-48 overflow-hidden min-h-screen flex items-center">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-1.svg')] bg-center bg-no-repeat bg-cover opacity-20 scale-110 sm:scale-100"></div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="floating-element absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="floating-element absolute bottom-40 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mt-12 lg:px-8 w-full">
          <div className="text-center animate-on-scroll">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[110%] sm:leading-[115%] tracking-[-1px] sm:tracking-[-2px] text-white mb-6 sm:mb-8 animate-on-scroll delay-100">
              Behind Every Great Event
              <br />
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Is a Passionate Team
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl lg:max-w-3xl mx-auto px-4 mb-10 sm:mb-12 animate-on-scroll delay-200 leading-relaxed">
              At GoEvent, we help people plan unforgettable events with ease and
              creativity. Our platform brings simplicity to celebrations, making
              every moment memorable and stress-free.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-on-scroll delay-300">
              <button
                onClick={scrollToTeam}
                className="group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 inline-flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto justify-center"
              >
                <Users className="w-5 h-5" />
                Meet Our Team
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 inline-flex items-center gap-3 w-full sm:w-auto justify-center">
                <Calendar className="w-5 h-5" />
                Start Planning
              </button>
            </div>

            {/* Stats or Social Proof */}
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 justify-center items-center mt-16 sm:mt-20 animate-on-scroll delay-400">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {loading ? "--" : teamMembers.length}
                </div>
                <div className="text-white/70 text-sm">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  15
                </div>
                <div className="text-white/70 text-sm">Events Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  30
                </div>
                <div className="text-white/70 text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-20"></div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 sm:gap-12 lg:gap-20">
            <div className="w-full lg:max-w-2xl animate-on-scroll order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[120%] tracking-[-1.5px] sm:tracking-[-2.5px] text-black mb-4 sm:mb-6">
                Our Journey
              </h2>
              <p className="text-neutral-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Founded with a vision to revolutionize event planning, we began
                as a passionate team dedicated to solving the complexities of
                organizing memorable experiences. What started as a simple idea
                has grown into a comprehensive platform trusted by event
                planners worldwide.
              </p>
              <p className="text-neutral-600 mb-4 sm:mb-6 text-sm sm:text-base">
                From intimate birthday parties to corporate conferences, we've
                helped thousands of organizers create seamless events that
                exceed expectations. Our platform combines cutting-edge
                technology with intuitive design to make event planning
                accessible to everyone.
              </p>
              <p className="text-neutral-600 text-sm sm:text-base">
                Today, we continue to innovate and expand our capabilities,
                always keeping our users' success at the heart of everything we
                do. Every feature we build is designed to make your event
                planning journey smoother and more enjoyable.
              </p>
            </div>
            <div className="w-full lg:w-auto lg:max-w-lg lg:-mt-9 animate-on-scroll delay-200 order-1 lg:order-2">
              <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-auto">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="Our team working on event planning"
                  className="w-full h-full lg:h-auto object-cover rounded-2xl sm:rounded-3xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[120%] tracking-[-1.5px] sm:tracking-[-2.5px] text-black mb-3 sm:mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600">
              We provide everything you need for successful events
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {values.map((value, index) => (
              <div
                key={index}
                className={`bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl text-center flex flex-col gap-4 sm:gap-6 lg:gap-8 items-center shadow-sm hover:shadow-lg transition-shadow animate-on-scroll delay-${
                  200 + index * 100
                }`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 text-blue-600 rounded-xl sm:rounded-2xl">
                  {value.icon}
                </div>
                <div className="flex flex-col gap-3 sm:gap-4 text-center items-center">
                  <h3 className="text-lg sm:text-xl font-semibold text-black">
                    {value.title}
                  </h3>
                  <p className="text-neutral-600 text-sm sm:text-base">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        id="team-section"
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            {/* Left Sidebar - Order 2 on mobile, 1 on desktop */}
            <div className="lg:col-span-4 order-2 lg:order-1 animate-on-scroll">
              <div className="lg:sticky lg:top-8 text-center lg:text-left">
                <p className="text-blue-600 font-medium text-sm mb-4">
                  Our team
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Leadership Team
                </h2>
                <p className="text-gray-600 text-base lg:text-lg mb-8 max-w-md mx-auto lg:mx-0">
                  We're a cross-disciplinary team that loves to create great
                  experiences for our customers.
                </p>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center lg:justify-start">
                  <button className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors text-center">
                    About our culture
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-500 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors">
                    Join our team
                  </button>
                </div>
              </div>
            </div>

            {/* Team Grid - Order 1 on mobile, 2 on desktop */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Failed to load team members
                  </h3>
                  <p className="text-gray-600 mb-4">{error}</p>
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
                    <div
                      key={index}
                      className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      {/* Profile Image */}
                      <div className="mb-6">
                        <img
                          src={
                            member.avatar
                              ? member.avatar.startsWith("http")
                                ? member.avatar
                                : `${import.meta.env.VITE_API_URL || "https://snwv9cpm-8000.asse.devtunnels.ms"}${member.avatar}`
                              : "/placeholder.svg?height=128&width=128"
                          }
                          alt={member.name}
                          className="w-32 h-32 rounded-full mx-auto object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=128&width=128";
                          }}
                        />
                      </div>
                      {/* Member Info */}
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {member.name}
                        </h3>
                        <p className="text-blue-600 font-medium mb-3">
                          {member.role}
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {member.description}
                        </p>
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
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
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
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
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
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 text-gray-400 rounded-full mb-4">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No team members found
                  </h3>
                  <p className="text-gray-600">
                    Team members will appear here once they're added.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Trusted by Event Planners Worldwide
            </h2>
            <p className="text-blue-100 text-lg">
              Join thousands of successful event organizers
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="animate-on-scroll delay-200">
              <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">
                10K+
              </div>
              <div className="text-blue-100 text-sm sm:text-base">
                Events Created
              </div>
            </div>
            <div className="animate-on-scroll delay-300">
              <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">
                50K+
              </div>
              <div className="text-blue-100 text-sm sm:text-base">
                Happy Customers
              </div>
            </div>
            <div className="animate-on-scroll delay-400">
              <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">
                99.9%
              </div>
              <div className="text-blue-100 text-sm sm:text-base">Uptime</div>
            </div>
            <div className="animate-on-scroll delay-500">
              <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">
                24/7
              </div>
              <div className="text-blue-100 text-sm sm:text-base">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
