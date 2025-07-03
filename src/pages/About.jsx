"use client";

import { useEffect } from "react";
import { Calendar, Users, Sparkles, ArrowRight, Target } from "lucide-react";

export default function About() {
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
                  9
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                {[
                  {
                    name: "Narith Chesda",
                    role: "Founder",
                    image: "/placeholder.svg?height=128&width=128",
                    bio: "Ex CDO at Fynd. Co-founder of BrandBoost and Co-pilot",
                    social: {
                      linkedin: "#",
                      twitter: "#",
                      email: "narith@goevent.com",
                    },
                  },
                  {
                    name: "Sarah Chen",
                    role: "Co-founder & CTO",
                    image: "/placeholder.svg?height=128&width=128",
                    bio: "Ex CTO @Apple. Former ML head at Tesla",
                    social: {
                      linkedin: "#",
                      twitter: "#",
                      email: "sarah@goevent.com",
                    },
                  },
                  {
                    name: "Mike Rodriguez",
                    role: "CPO",
                    image: "/placeholder.svg?height=128&width=128",
                    bio: "Former designer at BrandBoost. Founding designer at Bellex",
                    social: {
                      linkedin: "#",
                      twitter: "#",
                      email: "mike@goevent.com",
                    },
                  },
                  {
                    name: "Carlos Braithwaite",
                    role: "COO",
                    image: "/placeholder.svg?height=128&width=128",
                    bio: "Ex operations head at Daily Avenue Marts",
                    social: {
                      linkedin: "#",
                      twitter: "#",
                      email: "carlos@goevent.com",
                    },
                  },
                  {
                    name: "Kosal Sophanith",
                    role: "UI/UX Designer",
                    image: "/placeholder.svg?height=128&width=128",
                    bio: "Ex CMO at Uxcel",
                    social: {
                      linkedin: "#",
                      twitter: "#",
                      email: "olivia@goevent.com",
                    },
                  },
                  {
                    name: "Prom Sereyreaksa",
                    role: "Frontend Developer",
                    image: "/placeholder.svg?height=400&width=400",
                    bio: "Frontend developer with expertise in modern web technologies and performance optimization.",
                    social: {
                      linkedin: "#",
                      github: "#",
                      email: "mike@goevent.com",
                    },
                  },
                ].map((member, index) => (
                  <div
                    key={index}
                    className={`text-center animate-on-scroll delay-${
                      200 + index * 100
                    }`}
                  >
                    {/* Profile Image */}
                    <div className="relative mb-6">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto rounded-full overflow-hidden">
                        <img
                          src={
                            member.image ||
                            "/placeholder.svg?height=128&width=128" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={member.name}
                          className="w-full h-full object-cover mix-blend-multiply opacity-80"
                        />
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-medium text-sm mb-3">
                        {member.role}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center gap-4">
                      {member.social.twitter && (
                        <a
                          href={member.social.twitter}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      )}
                      {member.social.github && (
                        <a
                          href={member.social.github}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </a>
                      )}
                      <a
                        href={`mailto:${member.social.email}`}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
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
