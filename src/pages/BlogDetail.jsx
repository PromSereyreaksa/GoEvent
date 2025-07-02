"use client"

import { useParams, Link } from "react-router-dom"
import { Calendar, User, ArrowLeft, Share2, Heart, MessageCircle } from "lucide-react"

export default function BlogDetail() {
  const { id } = useParams()

  // Mock blog post data - in a real app, you'd fetch this based on the ID
  const post = {
    id: Number.parseInt(id),
    title: "The Future of Web Design: Trends to Watch in 2024",
    content: `
      <p>The world of web design is constantly evolving, and 2024 promises to bring some exciting new trends that will reshape how we think about digital experiences. As we move forward, it's crucial for designers and business owners to stay ahead of these trends to create websites that not only look great but also provide exceptional user experiences.</p>

      <h2>1. AI-Powered Design Tools</h2>
      <p>Artificial Intelligence is revolutionizing the design process. From automated layout suggestions to intelligent color palette generation, AI tools are making it easier than ever to create professional-looking websites. These tools don't replace human creativity but rather enhance it, allowing designers to focus on strategy and user experience while AI handles the repetitive tasks.</p>

      <h2>2. Immersive 3D Elements</h2>
      <p>Three-dimensional design elements are becoming more accessible and practical for web use. With improved browser capabilities and faster internet speeds, we're seeing more websites incorporate 3D graphics, animations, and interactive elements that create engaging, memorable experiences for users.</p>

      <h2>3. Sustainable Web Design</h2>
      <p>Environmental consciousness is extending to web design. Sustainable web design focuses on creating websites that consume less energy, load faster, and have a smaller carbon footprint. This includes optimizing images, reducing server requests, and choosing green hosting providers.</p>

      <h2>4. Voice User Interface Integration</h2>
      <p>As voice assistants become more prevalent, websites are beginning to incorporate voice navigation and interaction capabilities. This trend is particularly important for accessibility and provides an alternative way for users to interact with web content.</p>

      <h2>5. Micro-Interactions and Animations</h2>
      <p>Small, purposeful animations and micro-interactions are becoming essential for creating engaging user experiences. These subtle design elements provide feedback, guide users through processes, and add personality to websites without overwhelming the user.</p>

      <h2>Conclusion</h2>
      <p>The future of web design is bright and full of possibilities. By staying informed about these trends and thoughtfully incorporating them into your projects, you can create websites that not only meet current standards but also prepare for the future of digital interaction.</p>
    `,
    image: "/placeholder.svg?height=400&width=800",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    category: "Design Trends",
    readTime: "8 min read",
    tags: ["Web Design", "Trends", "2024", "AI", "3D Design", "Sustainability"],
  }

  const relatedPosts = [
    {
      id: 2,
      title: "10 Essential SEO Tips for Better Website Rankings",
      image: "/placeholder.svg?height=200&width=300",
      date: "March 12, 2024",
    },
    {
      id: 3,
      title: "How to Choose the Perfect Color Palette for Your Brand",
      image: "/placeholder.svg?height=200&width=300",
      date: "March 10, 2024",
    },
    {
      id: 4,
      title: "Mobile-First Design: Why It Matters More Than Ever",
      image: "/placeholder.svg?height=200&width=300",
      date: "March 8, 2024",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
              <span className="text-gray-500 text-sm">{post.readTime}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">{post.title}</h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{post.date}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>24</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>8</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
          />
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                to={`/blog/${relatedPost.id}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={relatedPost.image || "/placeholder.svg"}
                  alt={relatedPost.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{relatedPost.title}</h3>
                  <p className="text-sm text-gray-500">{relatedPost.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
