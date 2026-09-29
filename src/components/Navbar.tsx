'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

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
      <nav className="bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link
              href="/"
              className="flex items-center space-x-2 py-2 -ml-2 px-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="CampusEats Home"
            >
              <span className="text-2xl sm:text-3xl" role="img" aria-label="Campus Eats Logo">🍽️</span>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-orange-600 leading-tight">
                  CampusEats
                </span>
                <span className="text-[10px] text-gray-500 font-medium hidden sm:block">
                  Bennett University
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (>= sm) */}
            <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-lg font-medium text-sm transition min-h-[44px] flex items-center ${
                  isHomeActive
                    ? 'text-orange-600 bg-orange-50 font-semibold'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>

              <Link
                href="/explore"
                prefetch={true}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition min-h-[44px] flex items-center ${
                  isExploreActive
                    ? 'text-orange-600 bg-orange-50 font-semibold'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                }`}
              >
                Explore
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition min-h-[44px] flex items-center ${
                    isAdminActive
                      ? 'text-orange-600 bg-orange-50 font-semibold'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                  }`}
                >
                  Admin Panel
                </Link>
              )}
              
              {userEmail ? (
                <div className="flex items-center space-x-3 pl-2 border-l border-gray-200">
                  <span className="text-gray-600 text-sm max-w-[200px] truncate" title={userEmail}>
                    {userEmail}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition shadow-xs min-h-[44px] flex items-center"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition shadow-xs min-h-[44px] flex items-center"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Top Right Quick Action (< sm) */}
            <div className="sm:hidden flex items-center">
              {userEmail ? (
                <button
                  type="button"
                  onClick={() => setIsProfileSheetOpen(true)}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold text-sm border border-orange-200 active:scale-95 transition"
                  aria-label="Open user profile"
                >
                  {userEmail.charAt(0).toUpperCase()}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="min-h-[44px] px-3.5 flex items-center bg-orange-600 text-white font-semibold text-xs rounded-xl shadow-xs active:scale-95 transition"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Fixed Bottom Navigation Bar (< sm) */}
      <aside aria-label="Mobile Navigation" className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 pb-safe sm:hidden shadow-lg">
        <div className="flex items-stretch justify-around h-16 px-2">
          {/* Home Tab */}
          <Link
            href="/"
            className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
              isHomeActive
                ? 'text-orange-600 font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span className="text-xl leading-none mb-1">🏠</span>
            <span className="text-[11px] leading-tight">Home</span>
          </Link>

          {/* Explore / Food Search Tab */}
          <Link
            href="/explore"
            prefetch={true}
            className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
              isExploreActive
                ? 'text-orange-600 font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span className="text-xl leading-none mb-1">🔍</span>
            <span className="text-[11px] leading-tight">Explore</span>
          </Link>

          {/* Admin Tab (If Admin) */}
          {isAdmin && (
            <Link
              href="/admin"
              className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
                isAdminActive
                  ? 'text-orange-600 font-semibold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <span className="text-xl leading-none mb-1">⚙️</span>
              <span className="text-[11px] leading-tight">Admin</span>
            </Link>
          )}

          {/* Profile / Account Tab */}
          {userEmail ? (
            <button
              type="button"
              onClick={() => setIsProfileSheetOpen(true)}
              className="flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <span className="text-xl leading-none mb-1">👤</span>
              <span className="text-[11px] leading-tight">Profile</span>
            </button>
          ) : (
            <Link
              href="/login"
              className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
                isLoginActive
                  ? 'text-orange-600 font-semibold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <span className="text-xl leading-none mb-1">🔑</span>
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
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-lg font-bold">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium">Logged in as</p>
                  <p className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">
                    {userEmail}
                  </p>
                  {isAdmin && (
                    <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                      Admin Access
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileSheetOpen(false)}
                className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-gray-700 text-xl font-bold rounded-full hover:bg-gray-100"
                aria-label="Close profile drawer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 pt-4">
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsProfileSheetOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl text-sm transition min-h-[48px]"
                >
                  <span>⚙️</span>
                  <span>Open Admin Panel</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition shadow-sm min-h-[48px]"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>

              <button
                type="button"
                onClick={() => setIsProfileSheetOpen(false)}
                className="w-full py-3 px-4 bg-gray-50 text-gray-600 font-medium rounded-xl text-sm transition hover:bg-gray-100 min-h-[44px]"
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

