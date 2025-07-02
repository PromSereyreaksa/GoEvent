export default function Footer() {
  return (
    <footer className="bg-white py-20 px-8 font-['Plus_Jakarta_Sans']">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quick Links */}
            <div className="flex flex-col gap-7 items-start">
              <p className="text-black text-base font-semibold">Quick links</p>
              <div className="flex flex-col gap-2 items-start">
                <a
                  href="/"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  Home
                </a>
                <a
                  href="/about"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  About Us
                </a>
                <a
                  href="/features"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  Features
                </a>
                <a
                  href="/pricing"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="/reviews"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  Reviews
                </a>
                <a
                  href="/blog"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  Blog
                </a>
              </div>
            </div>

            {/* Job Categories */}
            <div className="flex flex-col gap-7 items-start">
              <p className="text-black text-base font-semibold">
                Job categories
              </p>
              <div className="flex flex-col gap-2 items-start">
                <a
                  href="#"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  Technology & IT
                </a>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  Marketing & Sales
                </a>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  Design & Creative
                </a>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  Real Estate
                </a>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  Healthcare & Science
                </a>
                <a
                  href="#"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  Business & Finance
                </a>
              </div>
            </div>

            {/* Support & Resources */}
            <div className="flex flex-col gap-7 items-start">
              <p className="text-black text-base font-semibold">
                Support & resources
              </p>
              <div className="flex flex-col gap-2 items-start">
                <a
                  href="/contact"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  Help Center
                </a>
                <a
                  href="/about"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="/privacy-policy"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms-and-conditions"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  Terms & Conditions
                </a>
                <a
                  href="/license"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  License
                </a>
                <a
                  href="/changelog"
                  className="text-neutral-600 hover:text-blue-500 transition-colors"
                >
                  Changelog
                </a>
              </div>
            </div>

            {/* Contact Us */}
            <div className="flex flex-col gap-7 items-start">
              <p className="text-black text-base font-semibold">Contact us</p>
              <div className="flex flex-col gap-2 items-start">
                <p className="text-neutral-600">
                  Address: 123 Job Street, New York, NY 10001
                </p>
                <div className="flex gap-1.25 items-center">
                  <p className="text-neutral-600">Email:</p>
                  <a
                    href="mailto:support@upwize.com"
                    className="text-neutral-600 hover:text-blue-500 transition-colors"
                  >
                    support@upwize.com
                  </a>
                </div>
                <div className="flex gap-1.25 items-center">
                  <p className="text-neutral-600">Phone:</p>
                  <a
                    href="tel:+1(123)456-7890"
                    className="text-neutral-600 hover:text-blue-500 transition-colors"
                  >
                    +1 (123) 456-7890
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <a href="/" className="inline-block">
              <img src="/logo.svg" alt="Footer Logo" className="h-10" />
            </a>
            <div className="border-t border-black/10 flex flex-wrap justify-between items-center pt-8">
              <div className="flex flex-wrap gap-10 items-center">
                <a
                  href="https://x.com/"
                  className="text-neutral-600 hover:text-blue-500 transition-colors font-semibold"
                >
                  Twitter
                </a>
                <a
                  href="https://www.linkedin.com/"
                  className="text-neutral-600 hover:text-blue-500 transition-colors font-semibold"
                >
                  Linkedin
                </a>
                <a
                  href="https://www.instagram.com/"
                  className="text-neutral-600 hover:text-blue-500 transition-colors font-semibold"
                >
                  Instagram
                </a>
                <a
                  href="/contact"
                  className="text-neutral-600 hover:text-blue-500 transition-colors font-semibold"
                >
                  Support
                </a>
              </div>
              <div className="flex flex-wrap gap-10 justify-center items-center">
                <a
                  href="/privacy-policy"
                  className="text-neutral-600 hover:text-blue-500 transition-colors font-semibold"
                >
                  Privacy
                </a>
                <a
                  href="/terms-and-conditions"
                  className="text-neutral-600 hover:text-blue-500 transition-colors font-semibold"
                >
                  Terms of use
                </a>
                <p className="text-neutral-600 text-base font-semibold">
                  upwize © 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
