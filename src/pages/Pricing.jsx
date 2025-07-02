import { Check, X } from "lucide-react";

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
      notIncluded: [
        "Advanced analytics",
        "Priority support",
        "Custom domain",
        "E-commerce features",
      ],
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
  ];

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans']">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-white pt-20 pb-96 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-1.svg?height=800&width=1200')] bg-center bg-no-repeat bg-cover opacity-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold leading-[115%] tracking-[-2px] text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Choose the plan that's right for your needs. All plans include our
              core features with no hidden fees or long-term contracts.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-20"></div>
      </section>

      {/* Pricing Toggle */}
      <section className="py-16 px-8 -mt-80">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-16">
            <div className="bg-gray-50 backdrop-blur-lg rounded-full p-2 flex items-center gap-8">
              <div className="bg-white rounded-full px-3 py-2 flex items-center gap-2 cursor-pointer">
                <span className="text-black text-base font-semibold">
                  Monthly
                </span>
              </div>
              <div className="rounded-full px-3 py-2 flex items-center gap-2 cursor-pointer">
                <span className="text-black text-base font-semibold">
                  Yearly
                </span>
                <span className="bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-semibold">
                  Save 20%
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-gray-50 bg-[url('/placeholder.svg?height=200&width=400')] bg-right-top bg-no-repeat rounded-3xl p-10 pb-13 flex flex-col gap-12 overflow-hidden ${
                  plan.popular ? "bg-none" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-10">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-semibold text-black">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {plan.description}
                      </p>
                    </div>
                    {plan.popular && (
                      <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs font-bold uppercase">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="flex items-end">
                    <span className="text-6xl font-bold text-black">
                      {plan.price}
                    </span>
                    <span className="text-neutral-600 ml-1 mb-1.5">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-10">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <div className="w-6 h-6 flex items-center justify-center mr-2">
                          <Check className="w-4 h-4 text-green-500" />
                        </div>
                        <span className="text-neutral-600 text-base">
                          {feature}
                        </span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <div className="w-6 h-6 flex items-center justify-center mr-2">
                          <X className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-gray-400 text-base">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-4 px-6 rounded-full font-semibold transition-colors ${
                      plan.popular
                        ? "bg-black text-white hover:bg-gray-800"
                        : "bg-white text-black border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-32 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-semibold leading-[120%] tracking-[-2.5px] text-black mb-4">
              Pricing FAQ
            </h2>
            <p className="text-xl text-neutral-600">
              Common questions about our pricing
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl">
              <h3 className="text-lg font-semibold text-black mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-neutral-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately, and we'll prorate any billing
                differences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl">
              <h3 className="text-lg font-semibold text-black mb-2">
                Is there a free trial?
              </h3>
              <p className="text-neutral-600">
                We offer a 14-day free trial for all plans. No credit card
                required to start your trial.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl">
              <h3 className="text-lg font-semibold text-black mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-neutral-600">
                We accept all major credit cards, PayPal, and bank transfers for
                Enterprise customers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
