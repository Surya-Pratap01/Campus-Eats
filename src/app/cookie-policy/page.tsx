import Navbar from '@/components/Navbar'
import { Check } from 'lucide-react'

export const metadata = {
  title: 'Cookie Policy | Campus Eats',
  description: 'Technical Cookie and Session Storage Disclosure for Campus Eats.',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#F0FBFA] flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-[#D5EAE7] p-6 sm:p-10 text-[#1F2937] space-y-8">
          <div>
            <span className="inline-block px-3 py-1 bg-[#E6F7F5] text-[#0D9488] border border-[#D5EAE7] text-xs font-bold rounded-full mb-3">
              Technical Storage Audit
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1F2937] tracking-tight">
              Cookie & Session Storage Policy
            </h1>
            <p className="text-sm text-[#728783] mt-2">
              Last updated: September 2026 • Accurate audit of storage mechanisms used by Campus Eats
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              1. What are Cookies & Local Storage?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Cookies and local browser storage are small text fragments stored on your device when you visit a web application. They allow the application to remember who you are across different pages so you do not have to re-enter your password on every request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              2. Technical Audit: Cookies Actually Used
            </h2>
            <p className="text-sm text-gray-600">
              Campus Eats exclusively uses <strong>strictly necessary authentication and security storage</strong>. An exhaustive audit of our codebase reveals the following:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Identifier / Name</th>
                    <th className="p-3">Type & Source</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  <tr>
                    <td className="p-3 font-mono font-semibold text-gray-900">sb-*-auth-token</td>
                    <td className="p-3">HTTP Cookie / Supabase SSR</td>
                    <td className="p-3">Maintains encrypted user authentication session across page requests</td>
                    <td className="p-3 text-green-700 font-semibold">Strictly Necessary</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold text-gray-900">supabase.auth.token</td>
                    <td className="p-3">Browser LocalStorage</td>
                    <td className="p-3">Persists client session state to enable seamless client-side navigation</td>
                    <td className="p-3 text-green-700 font-semibold">Strictly Necessary</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              3. Absence of Tracking & Marketing Cookies
            </h2>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 text-sm space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-700" />
                Zero Advertising or Cross-Site Tracking
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-emerald-800">
                Campus Eats does NOT use Google Analytics, Meta Pixels, advertising SDKs, commercial trackers, or third-party behavioral cookies. Because we only use strictly necessary session cookies essential for core account functionality, no invasive cookie tracking banner is required.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              4. How to Manage Browser Cookies
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              You can configure your browser to block or alert you about cookies. However, please note that blocking essential authentication cookies will prevent you from signing in to Campus Eats and submitting ratings.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
