import { Link } from "react-router-dom"
import { ArrowRight, Star, Users, Award, Zap } from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized for speed and performance with modern web technologies.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "User Friendly",
      description: "Intuitive design that makes it easy for anyone to use and navigate.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Award Winning",
      description: "Recognized for excellence in design and user experience.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechCorp",
      content: "This platform has transformed how we do business. Highly recommended!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Designer, Creative Studio",
      content: "Beautiful design and excellent functionality. Everything we needed.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Marketing Director",
      content: "The best investment we've made for our online presence.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
              Beautiful Websites
              <span className="text-primary-600"> Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create stunning, professional websites that convert visitors into customers. Our platform combines
              beautiful design with powerful functionality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/sign-up"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/features"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="mt-16">
            <img
              src="/placeholder.svg?height=400&width=800"
              alt="Platform Preview"
              className="mx-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to create and manage beautiful websites
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Don't just take our word for it</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their online presence
          </p>
          <Link
            to="/sign-up"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
