import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { pricingAPI } from "../utils/api";

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await pricingAPI.getPlans();
        setPlans(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

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

      {/* Pricing Cards */}
      <section className="py-20 px-8 -mt-80">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20 text-lg text-gray-500">
              Loading pricing plans...
            </div>
          ) : error ? (
            <div className="text-center py-20 text-lg text-red-500">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={plan.id || index}
                  className={`relative bg-white shadow-xl rounded-3xl p-10 flex flex-col gap-10 border border-gray-200 ${
                    plan.popular ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col gap-4 items-center">
                    <h3 className="text-2xl font-bold text-black mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-base text-neutral-600 text-center mb-2">
                      {plan.description}
                    </p>
                    <div className="flex items-end gap-1">
                      <span className="text-5xl font-bold text-black">
                        {plan.price}
                      </span>
                      <span className="text-neutral-600 mb-1">
                        {plan.period || "/month"}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features &&
                      plan.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center text-base text-gray-700"
                        >
                          <Check className="w-5 h-5 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    {plan.notIncluded &&
                      plan.notIncluded.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center text-base text-gray-400"
                        >
                          <X className="w-5 h-5 text-gray-300 mr-2" />
                          {feature}
                        </li>
                      ))}
                  </ul>
                  <button
                    className={`w-full py-4 px-6 rounded-full font-semibold transition-colors text-lg ${
                      plan.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                        : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    {plan.buttonText || "Get Started"}
                  </button>
                </div>
              ))}
            </div>
          )}
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
