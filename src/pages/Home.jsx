import { ArrowRight, Star, Users, Award, Zap } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description:
        "Optimized for speed and performance with modern web technologies.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "User Friendly",
      description:
        "Intuitive design that makes it easy for anyone to use and navigate.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Award Winning",
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

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] text-neutral-600">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-white pt-20 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-1-2.svg')] bg-center bg-no-repeat bg-cover opacity-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className="text-center">
            <div className="max-w-4xl mx-auto mb-16">
              <h1 class="text-[var(--neutral-04)] text-[160px] leading-[115%] font-bold tracking-[-2px] 
            max-[991px]:text-[82px] 
            max-[767px]:text-[62px] max-[767px]:tracking-[-1.5px] 
            max-[479px]:text-[48px] max-[479px]:tracking-[-1px]">
  Plan With
                <span className="block text-right">Ease</span>
</h1>
            </div>

            {/* Hero Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start max-w-6xl mx-auto">
              <div className="flex flex-col gap-8 max-w-md">
                <div className="flex flex-col gap-4">
                  <p class="text-white text-[18px] font-semibold uppercase max-[479px]:text-[16px] text-left ">
                    Elevate your event beyond the ordinary. Seamless, smart, and designed to impress at every turn.
                  </p>
                 
                </div>
              </div>

              {/* Main Image */}
              <div className="relative">
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
                    <p className="text-black text-sm font-bold">
                      Mobile Optimized
                    </p>
                    <img
                      src="/placeholder.svg?height=60&width=60"
                      alt="Mobile"
                      className="absolute -top-6 -left-1 w-16 h-16"
                    />
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-8 max-w-md">
                <div className="flex flex-col gap-6">
                  <p className="text-white text-lg text-left font-semibold uppercase">
                    Get started with effortless event management.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="/sign-up"
                      className="bg-white text-black px-8 py-5 rounded-full font-medium hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <span>Start Free Trial</span>
                      <div className="w-6 h-6 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-20"></div>
      </section>

      {/* Counter Section */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-start gap-10">
            <div className="flex-1 min-w-[400px]">
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

            <div className="flex gap-20">
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
            <div className="bg-gradient-to-b from-blue-500 to-white bg-[url('/placeholder.svg?height=400&width=400')] bg-center bg-no-repeat rounded-3xl flex flex-col justify-end items-center pt-36 px-5 pb-0 overflow-hidden">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Feature Preview"
                className="w-full rounded-t-3xl shadow-2xl"
              />
            </div>

            <div className="flex flex-col gap-20 pr-24">
              <div className="flex flex-col gap-4">
                <h2 className="text-5xl md:text-6xl font-semibold leading-[120%] tracking-[-2.5px] text-black">
                  Beautiful Design Made Simple
                </h2>
                <p className="text-lg leading-[170%] text-neutral-600">
                  Create stunning websites with our intuitive drag-and-drop
                  builder. No coding required.
                </p>
              </div>

              <div className="flex flex-col gap-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-6 items-start"
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
                  className="bg-black text-white px-6 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors inline-flex items-center w-fit"
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
            <div className="text-center max-w-3xl mx-auto">
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

            <div className="flex flex-col gap-6">
              <div className="flex gap-6">
                <div className="bg-gray-50 bg-[url('/placeholder.svg?height=200&width=400')] bg-center bg-no-repeat rounded-3xl p-10 pb-7 flex flex-col gap-10 w-[42%]">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-semibold text-black">
                      Drag & Drop Builder
                    </h3>
                    <p className="text-neutral-600">
                      Create beautiful layouts with our intuitive visual editor
                    </p>
                  </div>
                  <img
                    src="/placeholder.svg?height=200&width=400"
                    alt="Builder"
                    className="rounded-3xl w-full shadow-sm"
                  />
                </div>

                <div className="bg-gray-50 bg-[url('/placeholder.svg?height=200&width=400')] bg-center bg-no-repeat rounded-3xl p-10 pb-7 flex flex-col gap-10 w-[58%]">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-semibold text-black">
                      Mobile Responsive
                    </h3>
                    <p className="text-neutral-600">
                      Your website looks perfect on every device
                    </p>
                  </div>
                  <img
                    src="/placeholder.svg?height=200&width=500"
                    alt="Mobile"
                    className="rounded-3xl w-full shadow-sm"
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="bg-gray-50 bg-[url('/placeholder.svg?height=200&width=400')] bg-center bg-no-repeat rounded-3xl p-10 pb-7 flex flex-col gap-10 w-[57%]">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-semibold text-black">
                      Advanced Analytics
                    </h3>
                    <p className="text-neutral-600">
                      Track your website performance with detailed insights
                    </p>
                  </div>
                  <img
                    src="/placeholder.svg?height=200&width=500"
                    alt="Analytics"
                    className="rounded-3xl w-full shadow-sm"
                  />
                </div>

                <div className="bg-gray-50 bg-[url('/placeholder.svg?height=200&width=400')] bg-center bg-no-repeat rounded-3xl p-10 pb-7 flex flex-col gap-10 w-[43%]">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-semibold text-black">
                      SEO Optimized
                    </h3>
                    <p className="text-neutral-600">
                      Built-in SEO tools to help you rank higher
                    </p>
                  </div>
                  <img
                    src="/placeholder.svg?height=200&width=400"
                    alt="SEO"
                    className="rounded-3xl w-full shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-blue-500 py-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-20">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex flex-col gap-4">
                <h2 className="text-5xl md:text-6xl font-semibold leading-[120%] tracking-[-2.5px] text-white">
                  What Our Customers Say
                </h2>
                <p className="text-lg leading-[170%] text-blue-100">
                  Don't just take our word for it
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-3xl relative overflow-hidden"
                >
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="Testimonial"
                    className="w-full opacity-0"
                  />
                  <div className="absolute inset-0 flex flex-col justify-between p-8">
                    <div className="flex flex-col gap-6">
                      <p className="text-black text-base font-semibold">
                        "{testimonial.content}"
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-15 h-15 rounded-full overflow-hidden">
                        <img
                          src="/placeholder.svg?height=60&width=60"
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-black text-base font-semibold">
                          {testimonial.name}
                        </p>
                        <p className="text-neutral-600 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 bg-[url('/placeholder.svg?height=400&width=1200')] bg-center bg-no-repeat bg-cover rounded-3xl pt-36 px-20 pb-0 flex justify-between items-end overflow-hidden">
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
                      Start Free Trial
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

            <div className="max-w-md -mb-[10%]">
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
