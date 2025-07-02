import { Target, Award, Heart } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Our Mission",
      description:
        "To empower businesses with beautiful, functional websites that drive growth and success.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Our Values",
      description:
        "We believe in quality, innovation, and putting our customers first in everything we do.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Our Vision",
      description:
        "To be the leading platform for creating stunning websites that make a lasting impact.",
    },
  ];

  const team = [
    {
      name: "Narith Johnson",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Passionate about creating beautiful web experiences with over 10 years in the industry.",
    },
    {
      name: "Sarah Chen",
      role: "Head of Design",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Award-winning designer focused on user experience and visual storytelling.",
    },
    {
      name: "Mike Rodriguez",
      role: "Lead Developer",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Full-stack developer with expertise in modern web technologies and performance optimization.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans']">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-white pt-20 pb-96 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/4-p-1080.png')] bg-center bg-no-repeat bg-cover opacity-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold leading-[115%] tracking-[-2px] text-white mb-6">
              About Our Story
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              We started with a simple mission: to make beautiful, professional
              websites accessible to everyone, regardless of technical
              expertise.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-20"></div>
      </section>

      {/* Story Section */}
      <section className="py-32 px-8 -mt-80">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start gap-20">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-semibold leading-[120%] tracking-[-2.5px] text-black mb-6">
                Our Journey
              </h2>
              <p className="text-neutral-600 mb-6">
                Founded in 2020, Narith's Beautiful Site began as a passion
                project to solve the common problem of creating professional
                websites without the complexity of traditional web development.
              </p>
              <p className="text-neutral-600 mb-6">
                What started as a small team of designers and developers has
                grown into a platform trusted by thousands of businesses
                worldwide. We've helped companies of all sizes create stunning
                online presences that drive real results.
              </p>
              <p className="text-neutral-600">
                Today, we continue to innovate and push the boundaries of what's
                possible in web design, always keeping our users' needs at the
                center of everything we do.
              </p>
            </div>
            <div className="w-full max-w-lg -mt-9">
              <img
                src="/4-p-800.png"
                alt="Our team working"
                className="rounded-3xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-semibold leading-[120%] tracking-[-2.5px] text-black mb-4">
              What Drives Us
            </h2>
            <p className="text-xl text-neutral-600">
              Our core values guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-3xl text-center flex flex-col gap-8 items-center"
              >
                <div className="inline-flex items-center justify-center w-15 h-15 bg-blue-800 text-white rounded-2xl">
                  {value.icon}
                </div>
                <div className="flex flex-col gap-4 text-center items-center">
                  <h3 className="text-xl font-semibold text-black">
                    {value.title}
                  </h3>
                  <p className="text-neutral-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-20">
            {/* Mission */}
            <div className="flex justify-start items-center gap-20">
              <div className="w-1/2">
                <img
                  src="/4-p-500.png"
                  alt="Mission"
                  className="rounded-3xl w-full"
                />
              </div>
              <div className="flex flex-col gap-4 w-2/5">
                <h2 className="text-5xl font-semibold leading-[120%] tracking-[-2.5px] text-black">
                  Our Mission
                </h2>
                <p className="text-neutral-600">
                  We believe that every business deserves a beautiful,
                  professional website that represents their brand and drives
                  growth. Our mission is to democratize web design and make it
                  accessible to everyone.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="flex justify-start items-center gap-20">
              <div className="flex flex-col gap-4 w-2/5">
                <h2 className="text-5xl font-semibold leading-[120%] tracking-[-2.5px] text-black">
                  Our Vision
                </h2>
                <p className="text-neutral-600">
                  To become the world's leading platform for website creation,
                  empowering millions of businesses to establish their online
                  presence and achieve their digital goals.
                </p>
              </div>
              <div className="w-1/2">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Vision"
                  className="rounded-3xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-semibold leading-[120%] tracking-[-2.5px] text-black mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-neutral-600">
              The passionate people behind our platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="flex flex-col gap-4 items-start">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full rounded-2xl object-cover"
                />
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-black">
                    {member.name}
                  </h3>
                  <p className="text-sm text-neutral-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-6xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-6xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-100">Websites Created</div>
            </div>
            <div>
              <div className="text-6xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
            <div>
              <div className="text-6xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
