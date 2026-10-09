import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Privacy Policy | Campus Eats',
  description: 'Digital Personal Data Protection Notice for Campus Eats at Bennett University.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F0FBFA] flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-[#D5EAE7] p-6 sm:p-10 text-[#1F2937] space-y-8">
          <div>
            <span className="inline-block px-3 py-1 bg-[#E6F7F5] text-[#0D9488] border border-[#D5EAE7] text-xs font-bold rounded-full mb-3">
              DPDP Act, 2023 & DPDP Rules, 2025 Notice
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1F2937] tracking-tight">
              Privacy Policy & Data Notice
            </h1>
            <p className="text-sm text-[#728783] mt-2">
              Last updated: September 2026 • Effective for all users of Campus Eats at Bennett University
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              1. Overview and Purpose
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Campus Eats (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;platform&rdquo;) operates an informational dining directory and student review application for students and faculty of Bennett University, Greater Noida. This Privacy Notice is issued in accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and the <strong>Digital Personal Data Protection Rules, 2025</strong>.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              This notice explains what personal data we collect, why we collect it, how it is stored, and your rights as a Data Principal under Indian law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              2. Data We Actually Collect
            </h2>
            <p className="text-sm text-gray-600">
              We practice strict data minimization. We only collect personal data strictly required to deliver our student food rating and menu service:
            </p>
            <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600 space-y-2">
              <li>
                <strong>Bennett University Email Address:</strong> Used solely to verify eligible student/faculty membership (<code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-800">@bennett.edu.in</code>) and authenticate your account.
              </li>
              <li>
                <strong>Account Credentials & Identifiers:</strong> Your password is stored securely by Supabase Auth using industry-standard hashing algorithms (bcrypt/argon2). We never store or view raw plaintext passwords.
              </li>
              <li>
                <strong>Profile Information:</strong> Optional display name or student identifier associated with your profile, and role indicators (<code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-800">is_admin</code>).
              </li>
              <li>
                <strong>User-Generated Ratings & Reviews:</strong> The quantitative scores (Taste, Hygiene, Quantity, Value for Money), optional comments, and timestamps you submit for campus dishes.
              </li>
              <li>
                <strong>Technical Session Data:</strong> Essential encrypted session tokens stored in strictly necessary cookies to keep you signed in across page visits.
              </li>
            </ul>
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 mt-2">
              <strong>Data Not Collected:</strong> We do NOT collect phone numbers, physical home addresses, government ID cards, location GPS coordinates, payment card details, biometric data, or financial information.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              3. Purpose and Legal Grounds of Processing
            </h2>
            <p className="text-sm text-gray-600">
              Your personal data is processed exclusively for the following specified purposes:
            </p>
            <ol className="list-decimal pl-5 text-sm sm:text-base text-gray-600 space-y-1.5">
              <li>To create and manage your Campus Eats account.</li>
              <li>To verify that food ratings and reviews originate from verified Bennett University campus members.</li>
              <li>To display community averages and help fellow students make informed meal choices.</li>
              <li>To allow administrators to moderate reported abusive or false reviews.</li>
              <li>To maintain platform security and prevent unauthorized access.</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              4. Data Storage & Infrastructure Providers
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Campus Eats relies on reputable cloud infrastructure providers:
            </p>
            <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600 space-y-2">
              <li>
                <strong>Supabase Inc.</strong>: Used for database hosting (PostgreSQL with Row Level Security) and user authentication.
              </li>
              <li>
                <strong>Next.js / Cloud Hosting:</strong> Web application hosting providing edge computing and secure HTTPS transmission.
              </li>
            </ul>
            <p className="text-sm text-gray-600 leading-relaxed">
              We do NOT sell, rent, trade, or share student personal data with commercial advertisers, data brokers, or external marketing entities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              5. Rights of Data Principals (Under DPDP Act 2023)
            </h2>
            <p className="text-sm text-gray-600">
              As a Data Principal under Indian law, you have the following enforceable rights:
            </p>
            <ul className="list-disc pl-5 text-sm sm:text-base text-gray-600 space-y-1.5">
              <li><strong>Right to Access:</strong> View the personal data and reviews associated with your account.</li>
              <li><strong>Right to Correction & Updating:</strong> Correct inaccurate information in your profile or edit your submitted ratings.</li>
              <li><strong>Right to Erasure / Deletion:</strong> Request the deletion of your account and all associated review data.</li>
              <li><strong>Right of Grievance Redressal:</strong> Submit complaints regarding data processing to our designated Grievance Officer.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              6. Data Retention and Account Deletion
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              We retain account data as long as your Campus Eats account remains active. If you graduate, leave Bennett University, or delete your account, your authentication record and personal identifiers are removed from our active database. Submitted ratings may be retained in an anonymized, aggregated format to preserve overall dish rating calculations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              7. Grievance Redressal & Contact Information
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              For any privacy inquiries, requests to exercise your Data Principal rights (access, correction, erasure), or data grievances under the DPDP Act 2023, please contact our designated grievance point of contact:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-700 space-y-2.5">
              <p>
                <strong>Operating Entity:</strong> Campus Eats is operated and maintained by{' '}
                <strong>Surya Pratap Singh Rathod</strong> as an independent student-developed project.
              </p>
              <p>
                <strong>Contact / Grievance Email:</strong>{' '}
                <a href="mailto:suryarathore051@gmail.com" className="text-[#0D9488] font-semibold hover:underline">
                  suryarathore051@gmail.com
                </a>
              </p>
              <p className="text-xs text-gray-500 pt-2 border-t border-gray-200 leading-relaxed">
                <strong>University Disclaimer:</strong> Campus Eats is an independent student project and is not owned, operated, or legally managed by Bennett University.
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>Governing Law & Jurisdiction:</strong> Formal legal jurisdiction and governing court venue will be finalized prior to commercial or public launch.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
