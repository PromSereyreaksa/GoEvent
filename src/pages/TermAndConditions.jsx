const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-white font-['Plus_Jakarta_Sans'] pt-10 pb-56 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-center bg-no-repeat bg-cover opacity-20"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-8">
        <div className="bg-white rounded-3xl shadow-sm p-12 -mt-50">
          <h1 className="text-5xl font-bold leading-[115%] tracking-[-2px] text-black mb-12">Terms and Conditions</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-600 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold leading-[140%] tracking-[-1px] text-black mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-neutral-600 mb-4 text-lg leading-[170%]">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this
                agreement.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold leading-[140%] tracking-[-1px] text-black mb-4">2. Use License</h2>
              <p className="text-neutral-600 mb-4 text-lg leading-[170%]">
                Permission is granted to temporarily download one copy of the materials on our website for personal,
                non-commercial transitory viewing only.
              </p>
              <p className="text-neutral-600 mb-4 text-lg leading-[170%]">
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-5 text-neutral-600 space-y-2 text-lg leading-[170%]">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold leading-[140%] tracking-[-1px] text-black mb-4">3. Disclaimer</h2>
              <p className="text-neutral-600 mb-4 text-lg leading-[170%]">
                The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or
                implied, and hereby disclaim and negate all other warranties including without limitation, implied
                warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
                intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold leading-[140%] tracking-[-1px] text-black mb-4">4. Limitations</h2>
              <p className="text-neutral-600 mb-4 text-lg leading-[170%]">
                In no event shall our company or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on our website.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold leading-[140%] tracking-[-1px] text-black mb-4">
                5. Privacy Policy
              </h2>
              <p className="text-neutral-600 mb-4 text-lg leading-[170%]">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
                website, to understand our practices.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold leading-[140%] tracking-[-1px] text-black mb-4">
                6. Governing Law
              </h2>
              <p className="text-neutral-600 mb-4 text-lg leading-[170%]">
                These terms and conditions are governed by and construed in accordance with the laws and you irrevocably
                submit to the exclusive jurisdiction of the courts in that state or location.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-semibold leading-[140%] tracking-[-1px] text-black mb-4">
                7. Contact Information
              </h2>
              <p className="text-neutral-600 text-lg leading-[170%]">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="mt-4 p-6 bg-gray-50 rounded-2xl">
                <p className="text-neutral-600 text-lg leading-[170%]">
                  Email: legal@narithsite.com
                  <br />
                  Phone: +1 (555) 123-4567
                  <br />
                  Address: 123 Business St, City, State 12345
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions
