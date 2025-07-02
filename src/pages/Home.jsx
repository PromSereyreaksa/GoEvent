"use client";
import PricingSection from "../components/Pricing-Section";

export function DefaultPricing() {
  return <PricingSection />
}

import {
  ArrowRight,
  Users,
  Award,
  Zap,
  ArrowDownCircle,
  ArrowDownNarrowWideIcon,
  ArrowDownLeftSquare,
  ArrowDownSquare,
  CalendarHeart,
  User2Icon,
  GroupIcon,
  UserPlus2,
  User,
  Check,
  ListChecks,
  MessagesSquare,
  AlarmCheck,
  CalendarSearch,
  MapPin,
  Image,
  Music,
} from "lucide-react";
import { useEffect } from "react";

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
      description:
        "Intuitive design that makes it easy for anyone to use and navigate.",
    },
    {
      icon: <ListChecks className="w-8 h-8" />,
      title: "Real-time Guest RSVP & Check-in System",
      description: "Recognized for excellence in design and user experience.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechCorp",
      content:
        "This platform has transformed how we do business. Highly recommended!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Designer, Creative Studio",
      content:
        "Beautiful design and excellent functionality. Everything we needed.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Marketing Director",
      content: "The best investment we've made for our online presence.",
      rating: 5,
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
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] text-neutral-600">
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
      <section className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-white pt-20 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-1-2.svg')] bg-center bg-no-repeat bg-cover opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className="text-center">
            <div className="mx-auto px-5 mb-16 animate-on-scroll">
              <h1 className="text-[160px] mr-5 md:text-8xl lg:text-[160px] font-bold leading-[100%] tracking-[-2px] text-white uppercase mb-8">
                Plan with
                <span className="block text-right">Ease</span>
              </h1>
            </div>

            {/* Hero Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start max-w-6xl mx-auto">
              <div className="flex flex-col gap-8 max-w-md animate-on-scroll delay-200">
                <div className="flex flex-col gap-4">
                  <p className="text-white text-[18px] font-semibold uppercase max-[479px]:text-[16px] text-left ">
                    Elevate your event beyond the ordinary. Seamless, smart, and
                    designed to impress at every turn.
                  </p>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative animate-on-scroll delay-300">
                <img
                  src="/Hand-Image.png"
                  alt="Platform Preview"
                  className="max-w-2xl mx-auto "
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
                    <p className="text-black text-sm  font-bold">
                      Mobile Optimized
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-8 max-w-md animate-on-scroll delay-400">
                <div className="flex flex-col gap-6">
                  <p className="text-white py-5 text-lg text-left font-semibold uppercase">
                    Get started with effortless event management.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="/sign-up"
                      className="bg-white text-black ml-10 px-4 py-5 rounded-full font-medium hover:bg-gray-100 hover:translate-y-[-15px] duration-300 transition-all inline-flex items-center justify-center gap-2"
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

      {/* Counter Section */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-start gap-10">
            <div className="flex-1 min-w-[400px] animate-on-scroll">
              <div className="flex flex-col gap-4 max-w-lg">
                <h2 className="text-5xl md:text-6xl font-semibold leading-[120%] tracking-[-2.5px] text-black">
                  Trusted by Industry Leaders
                </h2>
                <p className="text-lg leading-[170%] text-neutral-600 w-[95%]">
                  Join thousands of businesses who have transformed their online
                  presence with our platform.
                </p>
              </div>
            </div>
            <div className="flex gap-20 animate-on-scroll delay-200">
              <div className="flex flex-col gap-2">
                <div className="text-6xl font-bold text-black">10K+</div>
                <div className="text-neutral-600">Happy Customers</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-6xl font-bold text-black">50K+</div>
                <div className="text-neutral-600">Websites Created</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Feature Section */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="bg-gradient-to-b from-blue-500 to-white bg-[url('/placeholder.svg?height=400&width=400')] bg-center bg-no-repeat rounded-3xl flex flex-col justify-end items-center pt-36 px-5 pb-0 overflow-hidden animate-on-scroll">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Feature Preview"
                className="w-full rounded-t-3xl shadow-2xl"
              />
            </div>
            <div className="flex flex-col gap-20 pr-24 animate-on-scroll delay-200">
              <div className="flex flex-col gap-4">
                <h2 className="text-5xl md:text-6xl font-semibold leading-[120%] tracking-[-2.5px] text-black">
                  Beautiful Design Made Simple
                </h2>
                <p className="text-lg leading-[170%] text-neutral-600">
                  Craft Memorable Online Invitations
                </p>
              </div>
              <div className="flex flex-col gap-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex flex-col gap-6 items-start animate-on-scroll delay-${
                        300 + index * 100
                      }`}
                    >
                      <div className="bg-white rounded-full rounded-bl-none p-2 shadow-lg">
                        <div className="bg-blue-800 rounded-full flex items-center justify-center w-15 h-15 text-white">
                          {feature.icon}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <h3 className="text-xl font-bold text-black">
                          {feature.title}
                        </h3>
                        <p className="text-base text-neutral-600">
                          {feature.description}
                        </p>
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

      {/* Features Grid */}
      <section className="py-32 px-8">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col gap-20">
      <div className="text-center max-w-3xl mx-auto animate-on-scroll">
        <div className="flex flex-col gap-4">
          <span className="text-blue-500 text-lg font-medium">
            Features
          </span>
          <h2 className="text-5xl md:text-6xl font-semibold leading-[120%] tracking-[-2.5px] text-black">
            Everything You Need
          </h2>
          <p className="text-lg leading-[170%] text-neutral-600">
            Powerful features designed to help you create amazing websites
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-3xl p-8 flex flex-col gap-6 hover:shadow-lg transition-shadow duration-300 animate-on-scroll delay-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-black">
              Google Maps
            </h3>
          </div>
          <p className="text-neutral-600 leading-relaxed">
            Seamlessly display event locations with integrated Google Maps.
          </p>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8 flex flex-col gap-6 hover:shadow-lg transition-shadow duration-300 animate-on-scroll delay-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <Image className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-black">
              Photo Galleries
            </h3>
          </div>
          <p className="text-neutral-600 leading-relaxed">
            Share your favorite event photos in a sleek gallery format.
          </p>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8 flex flex-col gap-6 hover:shadow-lg transition-shadow duration-300 animate-on-scroll delay-400">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Music className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-black">
              Background Music
            </h3>
          </div>
          <p className="text-neutral-600 leading-relaxed">
            Add a personal touch to your invitations with music integration.
          </p>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8 flex flex-col gap-6 hover:shadow-lg transition-shadow duration-300 animate-on-scroll delay-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl">
              <CalendarSearch className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-black">
              Set Reminder
            </h3>
          </div>
          <p className="text-neutral-600 leading-relaxed">
            Let guests easily add your event to their own Google Calendar for automatic reminders.
          </p>
        </div>

        <div className="bg-gray-50 rounded-3xl p-8 flex flex-col gap-6 hover:shadow-lg transition-shadow duration-300 animate-on-scroll delay-600 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-xl">
              <MessagesSquare className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold text-black">
              Guest Messages
            </h3>
          </div>
          <p className="text-neutral-600 leading-relaxed">
            Allow guests to leave messages, well-wishes, or congratulations on the invitation page.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
<section className="animate-on-scroll" >
 <DefaultPricing />
</section>
      {/* CTA Section */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 bg-[url('/placeholder.svg?height=400&width=1200')] bg-center bg-no-repeat bg-cover rounded-3xl pt-36 px-20 pb-0 flex justify-between items-end overflow-hidden animate-on-scroll">
            <div className="flex flex-col gap-10 max-w-lg">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <h2 className="text-5xl md:text-6xl font-semibold leading-[120%] tracking-[-2.5px] text-black">
                    Ready to Get Started?
                  </h2>
                  <p className="text-lg leading-[170%] text-neutral-600 w-[90%]">
                    Join thousands of satisfied customers who have transformed
                    their online presence
                  </p>
                </div>
                <div className="flex flex-col gap-8">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-black"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-black text-base font-semibold">
                        Free 14-day trial
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-black"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-black text-base font-semibold">
                        No credit card required
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <a
                      href="/sign-up"
                      className="bg-black text-white px-8 py-5 rounded-full font-medium hover:bg-gray-800 transition-colors"
                    >
                      Start Planning
                    </a>
                    <a
                      href="/contact"
                      className="text-black px-8 py-5 rounded-full font-medium hover:bg-black hover:text-white transition-colors border border-black"
                    >
                      Contact Sales
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-md -mb-[10%] animate-on-scroll delay-200">
              <img
                src="/placeholder.svg?height=400&width=400"
                alt="CTA Device"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>
      
    </div>
    
  );
}
