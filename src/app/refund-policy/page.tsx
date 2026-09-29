import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Refund Policy | Campus Eats',
  description: 'Transaction and Refund Scope Disclosure for Campus Eats.',
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/40 to-yellow-50 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 sm:p-10 text-gray-800 space-y-8">
          <div>
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full mb-3">
              Payment & Transaction Scope
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Refund & Cancellation Policy
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Last updated: September 2026 • Clarifying payment scope for Campus Eats users
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              1. Non-Processing of Food Transactions
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-900 text-sm space-y-2">
              <p className="font-bold">Important Notice Regarding Food Purchases:</p>
              <p className="text-xs sm:text-sm leading-relaxed text-blue-800">
                Campus Eats currently operates strictly as a <strong>dining discovery, menu catalog, and student review directory</strong>. The platform does NOT handle online ordering, collect payments, charge student cards, or process financial transactions for any food or beverages.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              2. Transaction Responsibility
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              All financial transactions for food and drinks take place directly between you (the student/customer) and the respective independent campus outlet (e.g., Green Nox, Snap Eats, House of Chow, Domino&apos;s, Subway, Quench, Maggi Point, Southern Stories) at their physical campus counters or via their designated payment terminals.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Because Campus Eats does not collect or process payments, <strong>Campus Eats cannot and does not issue refunds, credits, or charge reversals</strong> for purchases made at campus dining outlets.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              3. Vendor Disputes & Resolution
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              If you experience issues with food quality, order delays, overcharging, or incorrect billing at a campus outlet, please address your request directly to the outlet management at the counter at Bennett University. Each outlet maintains its own vendor policies regarding cancellations and cash/UPI refunds.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">
              4. Future Policy Updates
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              In the event that digital ordering or payment processing capabilities are introduced directly within Campus Eats in the future, this policy will be comprehensively updated prior to launch to detail cancellation timeframes, payment gateway refund processing, and support escalation protocols.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
