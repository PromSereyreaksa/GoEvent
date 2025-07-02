import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function Contact() {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: "hello@narithsite.com",
      subtext: "We'll respond within 24 hours",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      subtext: "Mon-Fri 9AM-6PM EST",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: "123 Business Street",
      subtext: "New York, NY 10001",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: "Mon-Fri: 9AM-6PM",
      subtext: "Weekend: 10AM-4PM",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans']">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-white pt-20 pb-96 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-center bg-no-repeat bg-cover opacity-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-start">
            <div className="max-w-lg pt-15">
              <h1 className="text-6xl md:text-8xl font-bold leading-[115%] tracking-[-2px] text-white mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-white">
                Have questions about our platform? We'd love to hear from you.
                Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl w-full max-w-2xl p-10 overflow-hidden">
              <h2 className="text-2xl font-bold text-black mb-6">
                Send us a Message
              </h2>
              <form className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-8">
                    <label
                      htmlFor="firstName"
                      className="text-base font-semibold text-black"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                      placeholder="John"
                    />
                  </div>
                  <div className="flex flex-col gap-8">
                    <label
                      htmlFor="lastName"
                      className="text-base font-semibold text-black"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-base font-semibold text-black"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="subject"
                    className="text-base font-semibold text-black"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="message"
                    className="text-base font-semibold text-black"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-400 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <div className="flex items-center gap-2.5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-black">
                    I agree to the{" "}
                    <a
                      href="/terms-and-conditions"
                      className="text-blue-600 hover:text-blue-500 underline"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white px-6 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2"
                >
                  Send Message
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-20"></div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-8 -mt-80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-15">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-5xl font-semibold leading-[120%] tracking-[-2.5px] text-black mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-neutral-600">
                We're here to help and answer any question you might have
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-4">
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {info.title}
                  </h3>
                  <p className="text-black font-medium mb-1">{info.details}</p>
                  <p className="text-sm text-neutral-600">{info.subtext}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-semibold leading-[120%] tracking-[-2.5px] text-black mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-neutral-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-2">
                How quickly do you respond to inquiries?
              </h3>
              <p className="text-neutral-600">
                We typically respond to all inquiries within 24 hours during
                business days. For urgent matters, please call us directly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-2">
                Do you offer technical support?
              </h3>
              <p className="text-neutral-600">
                Yes, we provide comprehensive technical support for all our
                customers. Our support team is available via email, chat, and
                phone.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200">
              <h3 className="text-lg font-semibold text-black mb-2">
                Can I schedule a demo?
              </h3>
              <p className="text-neutral-600">
                We'd be happy to show you our platform in action. Contact us to
                schedule a personalized demo at your convenience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
