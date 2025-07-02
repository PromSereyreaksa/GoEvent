import { Check, X } from "lucide-react"

export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "$9",
      period: "/month",
      description: "Perfect for personal projects and small websites",
      features: [
        "5 websites",
        "10GB storage",
        "Basic templates",
        "SSL certificate",
        "Email support",
        "Mobile responsive",
      ],
      notIncluded: ["Advanced analytics", "Priority support", "Custom domain", "E-commerce features"],
      popular: false,
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Ideal for growing businesses and professionals",
      features: [
        "25 websites",
        "100GB storage",
        "Premium templates",
        "SSL certificate",
        "Priority support",
        "Mobile responsive",
        "Advanced analytics",
        "Custom domain",
        "SEO tools",
        "Social media integration",
      ],
      notIncluded: ["White label", "API access"],
      popular: true,
      buttonText: "Start Free Trial",
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited websites",
        "Unlimited storage",
        "All templates",
        "SSL certificate",
        "24/7 phone support",
        "Mobile responsive",
        "Advanced analytics",
        "Custom domain",
        "SEO tools",
        "Social media integration",
        "White label",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
      ],
      notIncluded: [],
      popular: false,
      buttonText: "Contact Sales",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that's right for your needs. All plans include our core features with no hidden fees or
              long-term contracts.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-lg shadow-sm border-2 p-8 ${
                  plan.popular ? "border-primary-500 ring-2 ring-primary-200" : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <X className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? "bg-primary-600 text-white hover:bg-primary-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Pricing FAQ</h2>
            <p className="text-xl text-gray-600">Common questions about our pricing</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll
                prorate any billing differences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                We offer a 14-day free trial for all plans. No credit card required to start your trial.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
