import { Star, Quote } from "lucide-react"

export default function Reviews() {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CEO, TechStart Inc.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      date: "2 weeks ago",
      title: "Exceptional platform for our business",
      content:
        "This platform has completely transformed how we present our business online. The templates are beautiful, the customization options are endless, and the support team is incredibly responsive. We've seen a 40% increase in conversions since launching our new site.",
      helpful: 24,
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Creative Director, Design Studio",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      date: "1 month ago",
      title: "Perfect for creative professionals",
      content:
        "As a designer, I'm very particular about aesthetics and functionality. This platform delivers on both fronts. The design tools are intuitive, and the final results look professional and polished. My clients are always impressed with the websites I create using this platform.",
      helpful: 18,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      date: "3 weeks ago",
      title: "Easy to use, professional results",
      content:
        "I had no web design experience before using this platform, but I was able to create a professional-looking website for my bakery in just a few hours. The drag-and-drop interface is so intuitive, and the templates are gorgeous. Highly recommend!",
      helpful: 31,
    },
    {
      id: 4,
      name: "David Park",
      role: "Marketing Manager",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4,
      date: "1 week ago",
      title: "Great features and analytics",
      content:
        "The built-in analytics and SEO tools have been game-changers for our marketing efforts. We can track everything in real-time and make data-driven decisions. The only minor issue is that some advanced features could be more intuitive, but overall it's an excellent platform.",
      helpful: 12,
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Freelance Consultant",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      date: "2 months ago",
      title: "Outstanding customer support",
      content:
        "What sets this platform apart is the incredible customer support. Whenever I've had questions or needed help, the support team has been quick to respond and incredibly helpful. The platform itself is also top-notch with regular updates and new features.",
      helpful: 27,
    },
    {
      id: 6,
      name: "James Wilson",
      role: "E-commerce Store Owner",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      date: "3 weeks ago",
      title: "Perfect for e-commerce",
      content:
        "Running an online store has never been easier. The e-commerce features are comprehensive, the checkout process is smooth, and the inventory management tools are exactly what I needed. Sales have increased significantly since switching to this platform.",
      helpful: 19,
    },
  ]

  const stats = [
    { label: "Average Rating", value: "4.9/5", subtext: "Based on 2,847 reviews" },
    { label: "Customer Satisfaction", value: "98%", subtext: "Would recommend to others" },
    { label: "Support Response", value: "< 2 hours", subtext: "Average response time" },
    { label: "Active Users", value: "50K+", subtext: "Websites created" },
  ]

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              What Our Customers
              <span className="text-primary-600"> Are Saying</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what real customers have to say about their experience with our
              platform.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.subtext}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Customer Reviews</h2>
            <p className="text-xl text-gray-600">Real feedback from real customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-start space-x-4 mb-6">
                  <img
                    src={review.avatar || "/placeholder.svg"}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{review.name}</h3>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{review.role}</p>
                    <div className="flex items-center space-x-1">{renderStars(review.rating)}</div>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-3">{review.title}</h4>

                <div className="relative mb-6">
                  <Quote className="absolute top-0 left-0 w-6 h-6 text-primary-200 -translate-x-1 -translate-y-1" />
                  <p className="text-gray-600 pl-6">{review.content}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Was this helpful?</span>
                  <span>{review.helpful} people found this helpful</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Join Thousands of Satisfied Customers
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Start your free trial today and see why our customers love what we do
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/sign-up"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </a>
            <a
              href="/contact"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
