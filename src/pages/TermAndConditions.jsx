import React from 'react'

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8">
            Terms and Conditions
          </h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                By accessing and using this website, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Use License
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Permission is granted to temporarily download one copy of the materials on our website 
                for personal, non-commercial transitory viewing only.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Disclaimer
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The materials on our website are provided on an 'as is' basis. We make no warranties, 
                expressed or implied, and hereby disclaim and negate all other warranties including 
                without limitation, implied warranties or conditions of merchantability, fitness for 
                a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Limitations
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                In no event shall our company or its suppliers be liable for any damages (including, 
                without limitation, damages for loss of data or profit, or due to business interruption) 
                arising out of the use or inability to use the materials on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Privacy Policy
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs 
                your use of the website, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Governing Law
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                These terms and conditions are governed by and construed in accordance with the laws 
                and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Contact Information
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">
                  Email: legal@narithsite.com<br />
                  Phone: +1 (555) 123-4567<br />
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
