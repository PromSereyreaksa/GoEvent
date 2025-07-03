"use client"

import { Check, X } from 'lucide-react'
import { useState, useEffect, useRef } from "react"

export default function PricingSection({
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that's right for your needs. All plans include our core features with no hidden fees or long-term contracts.",
  plans = [],
  showToggle = true,
  toggleOptions = {
    monthly: "Monthly",
    yearly: "Yearly",
    yearlyDiscount: "Save 20%",
    yearlyDiscountPercent: 0.2,
  },
  faqTitle = "Pricing FAQ",
  faqDescription = "Common questions about our pricing",
  faqs = [],
  className = "",
  heroClassName = "",
  cardsClassName = "",
  faqClassName = "",
  onPlanSelect,
  calculateYearlyPrice,
}) {
  const [isYearly, setIsYearly] = useState(false)
  const [visibleCards, setVisibleCards] = useState([])
  const sectionRef = useRef(null)
  const cardsRef = useRef(null)

  const defaultPlans = [
    {
      name: "Basic",
      monthlyPrice: 9,
      yearlyPrice: null,
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
      planId: "basic",
    },
    {
      name: "Pro",
      monthlyPrice: 29,
      yearlyPrice: null,
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
      planId: "pro",
    },
    {
      name: "Enterprise",
      monthlyPrice: 99,
      yearlyPrice: null,
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
      planId: "enterprise",
    },
  ]

  const defaultFaqs = [
    {
      question: "Can I change my plan anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
    },
    {
      question: "Is there a free trial?",
      answer: "We offer a 14-day free trial for all plans. No credit card required to start your trial.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.",
    },
  ]

  const displayPlans = plans.length > 0 ? plans : defaultPlans
  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs

  useEffect(() => {
  let scrollLocked = false
  let animationComplete = false

  const lockScroll = () => {
    document.body.style.overflow = 'hidden'
    scrollLocked = true
  }

  const unlockScroll = () => {
    document.body.style.overflow = 'unset'
    scrollLocked = false
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animationComplete) {
          // Add a small delay to ensure user has scrolled enough
          setTimeout(() => {
            if (!animationComplete) {
              lockScroll()
              
              // Animate cards one by one
              displayPlans.forEach((_, index) => {
                setTimeout(() => {
                  setVisibleCards(prev => [...prev, index])
                  
                  // Unlock scroll after last card animation
                  if (index === displayPlans.length - 1) {
                    setTimeout(() => {
                      unlockScroll()
                      animationComplete = true
                    }, 600)
                  }
                }, index * 200)
              })
            }
          }, 100) // 500ms delay to ensure all cards are visible
        }
      })
    },
    { 
      threshold: 0.5, // Higher threshold - 60% of container must be visible
      rootMargin: '-50px 0px' // Require container to be 50px inside viewport
    }
  )

  if (cardsRef.current) {
    observer.observe(cardsRef.current)
  }

  // Cleanup function
  return () => {
    observer.disconnect()
    if (scrollLocked) {
      unlockScroll()
    }
  }
}, [displayPlans.length])

  const getDisplayPrice = (plan) => {
    if (isYearly) {
      if (calculateYearlyPrice) {
        return calculateYearlyPrice(plan.monthlyPrice, plan)
      }
      const yearlyPrice = plan.yearlyPrice || plan.monthlyPrice * 12 * (1 - toggleOptions.yearlyDiscountPercent)
      return Math.round(yearlyPrice)
    }
    return plan.monthlyPrice
  }

  const getDisplayPeriod = (plan) => {
    return isYearly ? "/year" : plan.period || "/month"
  }

  const handlePlanClick = (plan) => {
    const planData = {
      ...plan,
      selectedPrice: getDisplayPrice(plan),
      selectedPeriod: getDisplayPeriod(plan),
      billingCycle: isYearly ? "yearly" : "monthly",
    }
    if (onPlanSelect) {
      onPlanSelect(planData)
    } else if (plan.onClick) {
      plan.onClick(planData)
    }
  }

  return (
    <div className={`bg-white font-['Plus_Jakarta_Sans'] ${className}`}>
      <style jsx>{`
        .pricing-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .pricing-scroll::-webkit-scrollbar {
          display: none;
        }
        .card-animate {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .card-animate.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>

      {/* Hero Section - REDUCED bottom padding */}
<section className={`pt-16 sm:pt-28 pb-6 sm:pb-12 px-4 sm:px-8 ${heroClassName}`}>
  <div className="absolute inset-0 bg-[url('/grid-1.svg?height=800&width=1200')] bg-center bg-no-repeat bg-cover opacity-20"></div>
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
    <div className="text-center">
      <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold leading-[115%] tracking-[-1px] sm:tracking-[-2px] text-gray-900 mb-4 sm:mb-6">{title}</h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-900 max-w-3xl mx-auto px-4 sm:px-0">{description}</p>
    </div>
  </div>
  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white via-white/90 to-transparent z-20"></div>
</section>

{/* Pricing Toggle - REDUCED padding and margin */}
{showToggle && (
  <section className="py-2 sm:py-4 px-4 sm:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-center mb-4 sm:mb-8">
        <div className="bg-gray-50 backdrop-blur-lg rounded-full p-2 flex items-center gap-2">
          <div
            className={`rounded-full px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 cursor-pointer transition-all ${
              !isYearly ? "bg-white shadow-sm" : "hover:bg-gray-100"
            }`}
            onClick={() => setIsYearly(false)}
          >
            <span className={`text-sm sm:text-base font-semibold ${!isYearly ? "text-black" : "text-gray-600"}`}>
              {toggleOptions.monthly}
            </span>
          </div>
          <div
            className={`rounded-full px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 cursor-pointer transition-all ${
              isYearly ? "bg-white shadow-sm" : "hover:bg-gray-100"
            }`}
            onClick={() => setIsYearly(true)}
          >
            <span className={`text-sm sm:text-base font-semibold ${isYearly ? "text-black" : "text-gray-600"}`}>
              {toggleOptions.yearly}
            </span>
            <span className="bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-semibold">
              {toggleOptions.yearlyDiscount}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
)}

{/* Pricing Cards - REDUCED top padding */}
<section className="pt-0 sm:pt-2 pb-10 sm:pb-20 px-4 sm:px-8">
  <div className="max-w-7xl mx-auto">
   
          {/* Desktop Grid */}
          <div ref={cardsRef} className={`hidden md:grid md:grid-cols-3 gap-8 ${cardsClassName}`}>
            {displayPlans.map((plan, index) => (
              <div
                key={index}
                className={`card-animate card-hover relative ${
                  plan.popular
                    ? "bg-white border-2 border-blue-500 shadow-xl"
                    : "bg-gray-50 bg-right-top bg-no-repeat border border-gray-200"
                } rounded-3xl p-8 flex flex-col gap-8 overflow-hidden ${
                  visibleCards.includes(index) ? 'visible' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-0.8 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-semibold text-black">{plan.name}</h3>
                    <p className="text-sm text-neutral-600">{plan.description}</p>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold text-black">${getDisplayPrice(plan)}</span>
                    <span className="text-neutral-600 mb-2">{getDisplayPeriod(plan)}</span>
                    {isYearly && (
                      <span className="text-sm text-green-600 font-medium mb-2">
                        Save ${Math.round(plan.monthlyPrice * 12 - getDisplayPrice(plan))}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-8 flex-grow">
                  <ul className="space-y-3 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <div className="w-5 h-5 flex items-center justify-center mr-3">
                          <Check className="w-4 h-4 text-green-500" />
                        </div>
                        <span className="text-neutral-700 text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded &&
                      plan.notIncluded.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <div className="w-5 h-5 flex items-center justify-center mr-3">
                            <X className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="text-gray-400 text-sm">{feature}</span>
                        </li>
                      ))}
                  </ul>
                  <button
                    className={`w-full py-4 px-6 rounded-full font-semibold transition-all ${
                      plan.popular
                        ? "bg-black text-white hover:bg-gray-800 shadow-lg"
                        : "bg-white text-black border-2 border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                    onClick={() => handlePlanClick(plan)}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Horizontal Scroll */}
          <div className="md:hidden">
            <div className="pricing-scroll overflow-x-auto pb-4">
              <div className="flex gap-6 px-2" style={{ width: `${displayPlans.length * 280 + (displayPlans.length - 1) * 24}px` }}>
                {displayPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={`card-animate card-hover relative flex-shrink-0 w-72 ${
                      plan.popular
                        ? "bg-white border-2 border-blue-500 shadow-xl"
                        : "bg-gray-50 bg-right-top bg-no-repeat border border-gray-200"
                    } rounded-3xl p-6 flex flex-col gap-6 overflow-hidden ${
                      visibleCards.includes(index) ? 'visible' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-0.8 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-semibold text-black">{plan.name}</h3>
                        <p className="text-xs text-neutral-600">{plan.description}</p>
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-black">${getDisplayPrice(plan)}</span>
                        <span className="text-neutral-600 mb-1 text-sm">{getDisplayPeriod(plan)}</span>
                        {isYearly && (
                          <span className="text-xs text-green-600 font-medium mb-1">
                            Save ${Math.round(plan.monthlyPrice * 12 - getDisplayPrice(plan))}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-6 flex-grow">
                      <ul className="space-y-2 flex-grow">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <div className="w-4 h-4 flex items-center justify-center mr-2">
                              <Check className="w-3 h-3 text-green-500" />
                            </div>
                            <span className="text-neutral-700 text-xs">{feature}</span>
                          </li>
                        ))}
                        {plan.notIncluded &&
                          plan.notIncluded.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center">
                              <div className="w-4 h-4 flex items-center justify-center mr-2">
                                <X className="w-3 h-3 text-gray-400" />
                              </div>
                              <span className="text-gray-400 text-xs">{feature}</span>
                            </li>
                          ))}
                      </ul>
                      <button
                        className={`w-full py-3 px-4 rounded-full font-semibold transition-all text-sm ${
                          plan.popular
                            ? "bg-black text-white hover:bg-gray-800 shadow-lg"
                            : "bg-white text-black border-2 border-gray-200 hover:border-gray-300 hover:shadow-md"
                        }`}
                        onClick={() => handlePlanClick(plan)}
                      >
                        {plan.buttonText}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {displayFaqs.length > 0 && (
        <section className={`bg-gray-50 py-10 sm:py-20 px-4 sm:px-8 ${faqClassName}`}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-[120%] tracking-[-1.5px] sm:tracking-[-2.5px] text-black mb-4">{faqTitle}</h2>
              <p className="text-base sm:text-lg text-neutral-600">{faqDescription}</p>
            </div>
            <div className="space-y-4">
              {displayFaqs.map((faq, index) => (
                <div key={index} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm">
                  <h3 className="text-base sm:text-lg font-semibold text-black mb-3">{faq.question}</h3>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}