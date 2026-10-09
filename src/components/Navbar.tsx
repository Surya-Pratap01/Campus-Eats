'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Utensils, MapPin, LayoutDashboard, Home as HomeIcon, Compass, Store, User, LogIn, X } from 'lucide-react'

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || null)
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle()
        
        setIsAdmin(profile?.is_admin || false)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email || null)
      } else {
        setUserEmail(null)
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsProfileSheetOpen(false)
    router.push('/login')
  }

  const isHomeActive = pathname === '/'
  const isExploreActive = pathname === '/explore'
  const isAdminActive = pathname.startsWith('/admin')
  const isLoginActive = pathname.startsWith('/login')

  return (
    <>
      {/* Top App Bar (Mobile & Desktop) */}
      <header className="bg-[#F0FBFA]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(13,148,136,0.06)] border-b border-[#D5EAE7] sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo and Campus Subtitle (Refinement 1: Clean Lucide icons) */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2.5 py-1 -ml-1 px-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                aria-label="Campus Eats Bennett University"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E6F7F5] border border-[#D5EAE7] flex items-center justify-center text-[#0D9488] shadow-2xs">
                  <Utensils className="w-5 h-5 text-[#0D9488]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0D9488] leading-none">
                    Campus Eats
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#728783] flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                    <span>Bennett University, Greater Noida</span>
                  </span>
                </div>
              </Link>

              {/* Campus Active indicator (desktop) */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-[#E6F7F5] text-[#0D9488] border border-[#D5EAE7] rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse"></span>
                <span>Campus Dining Active</span>
              </div>
            </div>

            {/* Desktop Navigation Links (Refinement 2: Clean Admin link & balanced spacing) */}
            <nav className="hidden sm:flex items-center space-x-1 md:space-x-2">
              <Link
                href="/"
                className={`px-3.5 py-2 rounded-xl font-semibold text-sm transition min-h-[44px] flex items-center ${
                  isHomeActive
                    ? 'text-[#0D9488] bg-[#E6F7F5]'
                    : 'text-[#728783] hover:text-[#1F2937] hover:bg-[#E6F7F5]/50'
                }`}
              >
                Home
              </Link>

              <Link
                href="/explore"
                prefetch={true}
                className={`px-3.5 py-2 rounded-xl font-semibold text-sm transition min-h-[44px] flex items-center ${
                  isExploreActive
                    ? 'text-[#0D9488] bg-[#E6F7F5]'
                    : 'text-[#728783] hover:text-[#1F2937] hover:bg-[#E6F7F5]/50'
                }`}
              >
                Explore Outlets
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className={`px-3.5 py-2 rounded-xl font-semibold text-sm transition min-h-[44px] flex items-center gap-1.5 ${
                    isAdminActive
                      ? 'text-[#0D9488] bg-[#E6F7F5]'
                      : 'text-[#728783] hover:text-[#1F2937] hover:bg-[#E6F7F5]/50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-[#0D9488]" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {userEmail ? (
                <div className="flex items-center space-x-3 pl-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0D9488] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                      {userEmail.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[#1F2937] text-xs font-medium max-w-[150px] truncate hidden md:inline" title={userEmail}>
                      {userEmail}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-[#E6F7F5] hover:bg-[#D5EAE7] text-[#0D9488] px-3.5 py-2 rounded-xl font-bold text-xs transition min-h-[44px] flex items-center"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-4 py-2 rounded-xl font-bold text-sm transition shadow-sm min-h-[44px] flex items-center"
                >
                  Sign In
                </Link>
              )}
            </nav>

            {/* Mobile Top Right Quick Action (< sm) */}
            <div className="sm:hidden flex items-center gap-2">
              {userEmail ? (
                <button
                  type="button"
                  onClick={() => setIsProfileSheetOpen(true)}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-[#E6F7F5] text-[#0D9488] font-bold text-sm border border-[#D5EAE7] active:scale-95 transition"
                  aria-label="Open user profile"
                >
                  {userEmail.charAt(0).toUpperCase()}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="min-h-[44px] px-4 flex items-center bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar (< sm) */}
      <aside aria-label="Mobile Navigation" className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D5EAE7] pb-safe sm:hidden shadow-[0_-4px_16px_rgba(13,148,136,0.08)]">
        <div className="flex items-stretch justify-around h-16 px-2">
          {/* Home Tab */}
          <Link
            href="/"
            className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
              isHomeActive
                ? 'text-[#0D9488] font-bold'
                : 'text-[#728783] hover:text-[#1F2937]'
            }`}
          >
            <HomeIcon className="w-5 h-5 mb-1" />
            <span className="text-[11px] leading-tight">Home</span>
          </Link>

          {/* Explore / Food Search Tab */}
          <Link
            href="/explore"
            prefetch={true}
            className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
              isExploreActive
                ? 'text-[#0D9488] font-bold'
                : 'text-[#728783] hover:text-[#1F2937]'
            }`}
          >
            <Compass className="w-5 h-5 mb-1" />
            <span className="text-[11px] leading-tight">Explore</span>
          </Link>

          {/* Admin Tab (If Admin) or Quick Outlets link */}
          {isAdmin ? (
            <Link
              href="/admin"
              className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
                isAdminActive
                  ? 'text-[#0D9488] font-bold'
                  : 'text-[#728783] hover:text-[#1F2937]'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mb-1" />
              <span className="text-[11px] leading-tight">Admin</span>
            </Link>
          ) : (
            <Link
              href="/#outlets"
              className="flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 text-[#728783] hover:text-[#1F2937] transition-colors"
            >
              <Store className="w-5 h-5 mb-1" />
              <span className="text-[11px] leading-tight">Outlets</span>
            </Link>
          )}

          {/* Profile / Account Tab */}
          {userEmail ? (
            <button
              type="button"
              onClick={() => setIsProfileSheetOpen(true)}
              className="flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 text-[#728783] hover:text-[#1F2937] transition-colors"
            >
              <User className="w-5 h-5 mb-1" />
              <span className="text-[11px] leading-tight">Profile</span>
            </button>
          ) : (
            <Link
              href="/login"
              className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
                isLoginActive
                  ? 'text-[#0D9488] font-bold'
                  : 'text-[#728783] hover:text-[#1F2937]'
              }`}
            >
              <LogIn className="w-5 h-5 mb-1" />
              <span className="text-[11px] leading-tight">Login</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Profile Bottom Sheet / Drawer */}
      {isProfileSheetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
          onClick={() => setIsProfileSheetOpen(false)}
        >
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl relative animate-in slide-in-from-bottom duration-200 pb-safe sm:pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top drag handle indicator for mobile sheet */}
            <div className="w-12 h-1.5 bg-[#D5EAE7] rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex items-center justify-between pb-4 border-b border-[#D5EAE7]">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-[#E6F7F5] text-[#0D9488] border border-[#D5EAE7] flex items-center justify-center text-lg font-bold">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#728783] font-medium">Logged in as</p>
                  <p className="text-sm font-semibold text-[#1F2937] truncate max-w-[200px]">
                    {userEmail}
                  </p>
                  {isAdmin && (
                    <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 bg-[#E6F7F5] text-[#0D9488] border border-[#D5EAE7] rounded-full">
                      Admin Access
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileSheetOpen(false)}
                className="w-11 h-11 flex items-center justify-center text-[#728783] hover:text-[#1F2937] rounded-full hover:bg-[#E6F7F5]"
                aria-label="Close profile drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-4">
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsProfileSheetOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-[#E6F7F5] hover:bg-[#D5EAE7] text-[#0D9488] font-bold rounded-xl text-sm transition min-h-[48px]"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Open Admin Panel</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold rounded-xl text-sm transition shadow-sm min-h-[48px]"
              >
                <span>Sign Out</span>
              </button>

              <button
                type="button"
                onClick={() => setIsProfileSheetOpen(false)}
                className="w-full py-3 px-4 bg-[#F0FBFA] text-[#728783] font-medium rounded-xl text-sm transition hover:bg-[#E6F7F5] min-h-[44px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

