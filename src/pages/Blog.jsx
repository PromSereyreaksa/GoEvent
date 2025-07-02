import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function Blog() {
  const featuredPost = {
    id: 1,
    title: "The Future of Web Design: Trends to Watch in 2024",
    excerpt:
      "Discover the latest trends shaping the web design landscape and how they can impact your business's online presence.",
    image: "/placeholder.svg?height=400&width=800",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    category: "Design Trends",
    readTime: "8 min read",
  };

  const blogPosts = [
    {
      id: 2,
      title: "10 Essential SEO Tips for Better Website Rankings",
      excerpt:
        "Learn the fundamental SEO strategies that can help your website rank higher in search engine results.",
      image: "/placeholder.svg?height=300&width=400",
      author: "Mike Chen",
      date: "March 12, 2024",
      category: "SEO",
      readTime: "6 min read",
    },
    {
      id: 3,
      title: "How to Choose the Perfect Color Palette for Your Brand",
      excerpt:
        "Color psychology and practical tips for selecting colors that represent your brand effectively.",
      image: "/placeholder.svg?height=300&width=400",
      author: "Emily Rodriguez",
      date: "March 10, 2024",
      category: "Branding",
      readTime: "5 min read",
    },
    {
      id: 4,
      title: "Mobile-First Design: Why It Matters More Than Ever",
      excerpt:
        "Understanding the importance of mobile-first approach in today's digital landscape.",
      image: "/placeholder.svg?height=300&width=400",
      author: "David Park",
      date: "March 8, 2024",
      category: "Mobile Design",
      readTime: "7 min read",
    },
    {
      id: 5,
      title: "Building Trust Through Website Security",
      excerpt:
        "Essential security measures every website owner should implement to protect their users.",
      image: "/placeholder.svg?height=300&width=400",
      author: "Lisa Thompson",
      date: "March 5, 2024",
      category: "Security",
      readTime: "9 min read",
    },
    {
      id: 6,
      title: "The Psychology of User Experience Design",
      excerpt:
        "How understanding user psychology can improve your website's conversion rates.",
      image: "/placeholder.svg?height=300&width=400",
      author: "James Wilson",
      date: "March 3, 2024",
      category: "UX Design",
      readTime: "6 min read",
    },
    {
      id: 7,
      title: "E-commerce Best Practices for Higher Conversions",
      excerpt:
        "Proven strategies to optimize your online store and increase sales.",
      image: "/placeholder.svg?height=300&width=400",
      author: "Anna Martinez",
      date: "March 1, 2024",
      category: "E-commerce",
      readTime: "8 min read",
    },
  ];

  const categories = [
    "All Posts",
    "Design Trends",
    "SEO",
    "Branding",
    "Mobile Design",
    "Security",
    "UX Design",
    "E-commerce",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Our Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest insights, tips, and trends in web
              design, development, and digital marketing.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8">
              Featured Article
            </h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.image || "/placeholder.svg"}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                      {featuredPost.category}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {featuredPost.author}
                      </span>
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {featuredPost.date}
                      </span>
                    </div>
                    <Link
                      to={`/blog/${featuredPost.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                    >
                      Read More
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  index === 0
                    ? "bg-primary-600 text-white"
                    : "bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8">
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src="/vite.svg"
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center"
                    >
                      Read More
                      <ArrowRight className="ml-1 w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and never miss our latest articles and
            insights
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <button className="bg-secondary-600 text-white px-6 py-3 rounded-r-lg hover:bg-secondary-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
