import { CheckCircle, Zap, Shield, Smartphone, Palette, BarChart3, Globe, Headphones } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast Performance",
      description: "Optimized for speed with advanced caching and CDN integration for instant loading times.",
      benefits: ["99.9% uptime guarantee", "Global CDN network", "Advanced caching"],
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile-First Design",
      description: "Every template is fully responsive and optimized for all devices and screen sizes.",
      benefits: ["Responsive design", "Touch-friendly interface", "Mobile optimization"],
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Customizable Templates",
      description: "Choose from hundreds of professionally designed templates and customize them to match your brand.",
      benefits: ["500+ templates", "Drag & drop editor", "Brand customization"],
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-level security with SSL certificates, regular backups, and advanced threat protection.",
      benefits: ["SSL certificates", "Daily backups", "Malware protection"],
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Track your website performance with detailed analytics and insights.",
      benefits: ["Real-time analytics", "Conversion tracking", "Performance insights"],
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "SEO Optimization",
      description: "Built-in SEO tools to help your website rank higher in search results.",
      benefits: ["SEO-friendly URLs", "Meta tag optimization", "Sitemap generation"],
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team.",
      benefits: ["Live chat support", "Email support", "Knowledge base"],
    },
  ]

  const comparisonFeatures = [
    { feature: "Custom Domain", basic: true, pro: true, enterprise: true },
    { feature: "SSL Certificate", basic: true, pro: true, enterprise: true },
    { feature: "Templates", basic: "50+", pro: "200+", enterprise: "500+" },
    { feature: "Storage", basic: "10GB", pro: "100GB", enterprise: "Unlimited" },
    { feature: "Bandwidth", basic: "100GB", pro: "Unlimited", enterprise: "Unlimited" },
    { feature: "Email Accounts", basic: "5", pro: "25", enterprise: "Unlimited" },
    { feature: "Analytics", basic: false, pro: true, enterprise: true },
    { feature: "Priority Support", basic: false, pro: true, enterprise: true },
    { feature: "White Label", basic: false, pro: false, enterprise: true },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="text-primary-600"> Modern Websites</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create, manage, and grow your online presence. From design tools to advanced
              analytics, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-lg mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Compare Our Plans</h2>
            <p className="text-xl text-gray-600">Choose the plan that's right for your needs</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Basic</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Pro</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonFeatures.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.feature}</td>
                      <td className="px-6 py-4 text-center text-sm">
                        {typeof item.basic === "boolean" ? (
                          item.basic ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-400">—</span>
                          )
                        ) : (
                          <span className="text-gray-600">{item.basic}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        {typeof item.pro === "boolean" ? (
                          item.pro ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-400">—</span>
                          )
                        ) : (
                          <span className="text-gray-600">{item.pro}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        {typeof item.enterprise === "boolean" ? (
                          item.enterprise ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-400">—</span>
                          )
                        ) : (
                          <span className="text-gray-600">{item.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Start your free trial today and see how our features can transform your online presence
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
              Contact Sales
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
