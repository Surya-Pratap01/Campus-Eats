import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Terms & Conditions | Campus Eats',
  description: 'Terms of Use and User Guidelines for Campus Eats at Bennett University.',
}

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/40 to-yellow-50 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 sm:p-10 text-gray-800 space-y-8">
          <div>
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full mb-3">
              User Agreement
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Last updated: September 2026 • Governing use of Campus Eats at Bennett University
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              1. Acceptance of Terms
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              By accessing, browsing, or creating an account on Campus Eats (&ldquo;Platform&rdquo;), you agree to comply with and be bound by these Terms & Conditions. If you do not agree to these terms, please do not use the Platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              2. Eligibility & Bennett Email Requirement
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              To submit ratings, post reviews, or access personalized features, you must create an account using a valid <strong>Bennett University email address (<code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-800">@bennett.edu.in</code>)</strong>. You are responsible for safeguarding your login credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              3. Review & Rating Code of Conduct
            </h2>
            <p className="text-sm text-gray-600">
              Campus Eats relies on genuine peer feedback. When rating or reviewing food items, you agree to adhere to the following standards:
            </p>
            <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600 space-y-2">
              <li><strong>Authentic Experience:</strong> You may only rate items you have personally ordered and consumed on campus.</li>
              <li><strong>Prohibition of Fake Reviews:</strong> Creating fabricated reviews, participating in coordinated rating campaigns, or submitting malicious ratings to damage an outlet&apos;s reputation is strictly prohibited.</li>
              <li><strong>No Harassment or Profanity:</strong> Review comments must not contain defamatory, abusive, sexually explicit, hate speech, or threatening content directed at campus vendors or fellow students.</li>
              <li><strong>Editorial Moderation:</strong> Campus Eats administrators reserve the right to review, hide, or permanently delete any rating or comment that violates these terms.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              4. Disclaimer on Menus, Pricing & Availability
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Campus Eats is an <strong>independent student discovery directory</strong>. All menu items, pricing, opening hours, and food preparation are managed independently by third-party campus food operators and vendors (e.g., Green Nox, Snap Eats, House of Chow, Domino&apos;s, Subway, Quench, Maggi Point, Southern Stories).
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              While we strive to keep menus and prices current, vendors may adjust prices, taxes, or item availability without notice. Campus Eats makes no warranties regarding the accuracy or availability of any item listed on the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              5. Intellectual Property
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              The Campus Eats interface, design, code, and compilations are protected by copyright and intellectual property laws. Third-party brand names and trademarks (such as Domino&apos;s Pizza or Subway) belong to their respective owners and are referenced solely for identification purposes within the Bennett University campus context.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              6. Limitation of Liability
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Campus Eats does not prepare, sell, or deliver food, nor do we process food payments. In no event shall Campus Eats or its maintainers be liable for food safety, quality, allergic reactions, billing discrepancies, or vendor disputes occurring at campus outlets.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              7. Platform Identity & Governing Framework
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-700 space-y-2.5">
              <p><strong>Platform:</strong> Campus Eats (Campus Dining Discovery)</p>
              <p>
                <strong>Operator & Maintainer:</strong> Campus Eats is currently operated and maintained by{' '}
                <strong>Surya Pratap Singh Rathod</strong> as an independent student-developed project.
              </p>
              <p>
                <strong>Support & Inquiries:</strong>{' '}
                <a href="mailto:suryarathore051@gmail.com" className="text-orange-600 font-semibold hover:underline">
                  suryarathore051@gmail.com
                </a>
              </p>
              <p className="text-xs text-gray-600 pt-2 border-t border-gray-200 leading-relaxed">
                <strong>Disclaimer of University Ownership:</strong> Campus Eats is an independent student project created for the campus dining community. It is not owned, operated, managed, or legally affiliated with Bennett University.
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>Governing Law & Jurisdiction:</strong> Applicable governing law and formal legal jurisdiction will be finalized and announced prior to any commercial or public launch.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
