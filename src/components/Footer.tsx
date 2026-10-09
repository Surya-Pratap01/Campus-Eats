import Link from 'next/link'
import { Utensils } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#E6F7F5] border-t border-[#D5EAE7] mt-auto py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-[#D5EAE7]">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#D5EAE7] flex items-center justify-center text-[#0D9488]">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-[#0D9488] tracking-tight">Campus Eats</span>
            </div>
            <p className="text-xs sm:text-sm text-[#728783] mt-2 max-w-sm leading-relaxed">
              Independent student-developed dining discovery directory operated by Surya Pratap Singh Rathod for the Bennett University campus community.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-[#728783]">
            <Link href="/privacy-policy" className="hover:text-[#0D9488] transition">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-[#0D9488] transition">
              Terms & Conditions
            </Link>
            <Link href="/cookie-policy" className="hover:text-[#0D9488] transition">
              Cookie Policy
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-[#728783]">
          <p>
            © {new Date().getFullYear()} Campus Eats • Independent Student-Developed Project
          </p>
          <div className="bg-white text-[#0D9488] border border-[#D5EAE7] px-3 py-1.5 rounded-lg text-[11px] font-medium shadow-2xs">
            <span className="font-bold">[NOTICE]:</span> Independent student project. Not owned or operated by Bennett University. Contact:{' '}
            <a href="mailto:suryarathore051@gmail.com" className="underline font-bold hover:text-[#0F766E]">
              suryarathore051@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
