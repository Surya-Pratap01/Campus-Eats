import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl" role="img" aria-label="Campus Eats Logo">🍽️</span>
              <span className="text-xl font-black text-orange-600 tracking-tight">CampusEats</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm">
              Independent student-developed dining discovery directory operated by Surya Pratap Singh Rathod for the Bennett University campus community.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-gray-600">
            <Link href="/privacy-policy" className="hover:text-orange-600 transition">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-orange-600 transition">
              Terms & Conditions
            </Link>
            <Link href="/cookie-policy" className="hover:text-orange-600 transition">
              Cookie Policy
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} Campus Eats • Independent Student-Developed Project
          </p>
          <div className="bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-1 rounded-md text-[11px] font-medium">
            <span className="font-semibold">[NOTICE]:</span> Independent student project. Not owned or operated by Bennett University. Contact:{' '}
            <a href="mailto:suryarathore051@gmail.com" className="underline font-semibold hover:text-amber-900">
              suryarathore051@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
