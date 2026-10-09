'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Utensils, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        setError(updateError.message)
      } else {
        setMessage('Password updated successfully! Redirecting to home...')
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 1500)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FBFA] px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-[#D5EAE7]">
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F7F5] border border-[#D5EAE7] flex items-center justify-center text-[#0D9488] shadow-2xs mb-3">
              <Utensils className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0D9488] tracking-tight">
              Campus Eats
            </h1>
            <h2 className="text-lg font-bold text-gray-800 mt-2">Set New Password</h2>
            <p className="text-[#728783] text-xs sm:text-sm mt-1">
              Enter your new Campus Eats password below
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full px-4 py-3.5 pr-12 bg-white border border-[#D5EAE7] rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition text-base text-gray-900 placeholder:text-gray-400 focus:text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 w-11 h-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-new-password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-new-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3.5 pr-12 bg-white border border-[#D5EAE7] rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition text-base text-gray-900 placeholder:text-gray-400 focus:text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 w-11 h-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3.5 px-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-xs active:scale-98 flex items-center justify-center"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/login"
              className="min-h-[44px] px-4 inline-flex items-center text-sm text-[#0D9488] hover:text-[#0f766e] font-semibold gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
