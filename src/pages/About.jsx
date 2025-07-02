import { Target, Award, Heart } from "lucide-react"

export default function About() {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Our Mission",
      description: "To empower businesses with beautiful, functional websites that drive growth and success.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Our Values",
      description: "We believe in quality, innovation, and putting our customers first in everything we do.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Our Vision",
      description: "To be the leading platform for creating stunning websites that make a lasting impact.",
    },
  ]

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
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">About Our Story</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We started with a simple mission: to make beautiful, professional websites accessible to everyone,
              regardless of technical expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">Our Journey</h2>
              <p className="text-gray-600 mb-6">
                Founded in 2020, Narith's Beautiful Site began as a passion project to solve the common problem of
                creating professional websites without the complexity of traditional web development.
              </p>
              <p className="text-gray-600 mb-6">
                What started as a small team of designers and developers has grown into a platform trusted by thousands
                of businesses worldwide. We've helped companies of all sizes create stunning online presences that drive
                real results.
              </p>
              <p className="text-gray-600">
                Today, we continue to innovate and push the boundaries of what's possible in web design, always keeping
                our users' needs at the center of everything we do.
              </p>
            </div>
            <div>
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Our team working"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">What Drives Us</h2>
            <p className="text-xl text-gray-600">Our core values guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-lg mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The passionate people behind our platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-48 h-48 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-primary-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-primary-100">Websites Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-primary-100">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-primary-100">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
