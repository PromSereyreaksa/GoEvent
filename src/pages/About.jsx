"use client";

import { Target, Award, Heart, Linkedin, Twitter, Mail } from "lucide-react";
import { useState, useEffect } from "react";

export default function About() {
  const [hoveredMember, setHoveredMember] = useState(null);

  const values = [
    {
      icon: <Target className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Our Mission",
      description:
        "To make event planning simple, seamless, and smart through an easy-to-use SaaS platform.",
    },
    {
      icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Our Values",
      description:
        "To be the go-to platform for organizing events of any size—trusted, efficient, and loved by users.",
    },
    {
      icon: <Award className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Our Vision",
      description:
        "To be the leading platform for creating stunning websites that make a lasting impact.",
    },
  ];

  const team = [
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
      image: "/phanith.JPG?height=128&width=128",
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
      image: "reaksa.jpg?height=400&width=400",
      bio: "Frontend developer with expertise in modern web technologies and performance optimization.",
      longBio:
        "Frontend developer with expertise in modern web technologies and performance optimization. Reaksa ensures our platform runs smoothly and efficiently.",
      skills: ["React", "Node.js", "Performance Optimization"],
      social: {
        linkedin: "#",
        github: "#",
        email: "mike@goevent.com",
      },
    },
  ];
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
      `}</style>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-white pt-16 sm:pt-20 pb-32 sm:pb-40 lg:pb-160 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-1.svg')] bg-center bg-no-repeat bg-cover opacity-20 scale-110 sm:scale-100"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:mt-20">
          <div className="text-center animate-on-scroll">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[110%] sm:leading-[115%] tracking-[-1px] sm:tracking-[-2px] text-white mb-4 sm:mb-6">
              About GoEvent
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white max-w-2xl lg:max-w-3xl mx-auto px-4 animate-on-scroll delay-200">
              GoEvent can help you create digital invitation, that will help you
              lessen the time and stress that you spend on managing your event.
            </p>
          </div>
        </div>

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
                Founded in 2020, Narith's Beautiful Site began as a passion
                project to solve the common problem of creating professional
                websites without the complexity of traditional web development.
              </p>
              <p className="text-neutral-600 mb-4 sm:mb-6 text-sm sm:text-base">
                What started as a small team of designers and developers has
                grown into a platform trusted by thousands of businesses
                worldwide. We've helped companies of all sizes create stunning
                online presences that drive real results.
              </p>
              <p className="text-neutral-600 text-sm sm:text-base">
                Today, we continue to innovate and push the boundaries of what's
                possible in web design, always keeping our users' needs at the
                center of everything we do.
              </p>
            </div>
            <div className="w-full lg:w-auto lg:max-w-lg lg:-mt-9 animate-on-scroll delay-200 order-1 lg:order-2">
              <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-auto">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="Our team working"
                  className="w-full h-full lg:h-auto object-cover rounded-2xl sm:rounded-3xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[120%] tracking-[-1.5px] sm:tracking-[-2.5px] text-black mb-3 sm:mb-4">
              What Drives Us
            </h2>
            <p className="text-lg sm:text-xl text-neutral-600">
              Our core values guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {values.map((value, index) => (
              <div
                key={index}
                className={`bg-gray-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-center flex flex-col gap-4 sm:gap-6 lg:gap-8 items-center animate-on-scroll delay-${
                  200 + index * 100
                }`}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-15 sm:h-15 bg-blue-800 text-white rounded-xl sm:rounded-2xl">
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
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
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
                {team.map((member, index) => (
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
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      <a
                        href={`mailto:${member.social.email}`}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Mail className="w-5 h-5" />
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
{/*             
              { number: "10K+", label: "Happy Customers" },
              { number: "50K+", label: "Websites Created" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" }
            */}
            <div className={`animate-on-scroll delay-${200}`}>
              <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">
                10K+
              </div>
              <div className="text-blue-100 text-sm sm:text-base">
                Happy Customers
              </div>
            </div>
            <div className={`animate-on-scroll delay-${300}`}>
              <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">
                50K+
              </div>
              <div className="text-blue-100 text-sm sm:text-base">
                Websites Created
              </div>
            </div>
            <div className={`animate-on-scroll delay-${400}`}>
              <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">
                99.9%
              </div>
              <div className="text-blue-100 text-sm sm:text-base">Uptime</div>
            </div>
            <div className={`animate-on-scroll delay-${500}`}>
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
