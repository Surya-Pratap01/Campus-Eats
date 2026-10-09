'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Utensils, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const validateBennettEmail = (emailStr: string): boolean => {
    return emailStr.trim().toLowerCase().endsWith('@bennett.edu.in')
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const cleanEmail = email.trim().toLowerCase()

    // Bennett University email restriction
    if (!validateBennettEmail(cleanEmail)) {
      setError('Please use your Bennett University email address.')
      return
    }

    if (mode === 'forgot_password') {
      setLoading(true)
      try {
        const redirectUrl = `${window.location.origin}/auth/callback?next=/auth/reset-password`
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: redirectUrl,
        })

        if (resetError) {
          setError(resetError.message)
        } else {
          setMessage(`Password reset link sent to ${cleanEmail}! Check your Bennett email inbox.`)
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to send password reset email. Please try again.'
        setError(message)
      } finally {
        setLoading(false)
      }
      return
    }

    // Password validation for login and signup
    if (!password) {
      setError('Please enter your password.')
      return
    }

    if (mode === 'signup') {
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
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
        })

        if (signUpError) {
          if (signUpError.message.toLowerCase().includes('already registered')) {
            setError('An account with this email already exists. Please log in.')
          } else {
            setError(signUpError.message)
          }
        } else if (data.session) {
          setMessage('Account created! Redirecting...')
          router.push('/')
          router.refresh()
        } else {
          setMessage('Account created successfully! You can now log in.')
          setMode('login')
          setPassword('')
          setConfirmPassword('')
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to create account. Please try again.'
        setError(message)
      } finally {
        setLoading(false)
      }
      return
    }

    // Login mode
    setLoading(true)
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (signInError) {
        if (signInError.message.toLowerCase().includes('invalid login credentials')) {
          setError('Invalid Bennett email or password. Please make sure you have created an account first.')
        } else {
          setError(signInError.message)
        }
      } else if (data.user) {
        // Immediate clean navigation to home with authenticated cookies; keep loading=true to prevent duplicate clicks
        window.location.href = '/'
        return
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign in. Please try again.'
      setError(message)
      setLoading(false)
    } finally {
      // If we errored out, re-enable button
      if (error) {
        setLoading(false)
      }
    }
  }

  const switchMode = (newMode: 'login' | 'signup' | 'forgot_password') => {
    setMode(newMode)
    setError('')
    setMessage('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FBFA] px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-[#D5EAE7]">
          {/* Logo Treatment (Refinement: Lucide Utensils + Clean Typography) */}
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F7F5] border border-[#D5EAE7] flex items-center justify-center text-[#0D9488] shadow-2xs mb-3">
              <Utensils className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0D9488] tracking-tight">
              Campus Eats
            </h1>
            <p className="text-[#728783] text-xs sm:text-sm mt-1">
              Rate & discover the best food across Bennett University
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          {mode !== 'forgot_password' && (
            <div className="flex border border-[#D5EAE7] rounded-xl p-1 mb-6 bg-[#E6F7F5]/50">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 min-h-[44px] py-2.5 text-sm font-bold rounded-lg transition active:scale-95 ${
                  mode === 'login'
                    ? 'bg-white text-[#0D9488] shadow-xs'
                    : 'text-[#728783] hover:text-[#1F2937]'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`flex-1 min-h-[44px] py-2.5 text-sm font-bold rounded-lg transition active:scale-95 ${
                  mode === 'signup'
                    ? 'bg-white text-[#0D9488] shadow-xs'
                    : 'text-[#728783] hover:text-[#1F2937]'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {mode === 'forgot_password' && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#1F2937]">Forgot Password</h2>
              <p className="text-[#728783] text-sm mt-1">
                Enter your Bennett University email to receive a password reset link.
              </p>
            </div>
          )}

          {mode === 'signup' && (
            <div className="bg-[#E6F7F5] border border-[#D5EAE7] text-[#0D9488] text-xs rounded-xl p-3 mb-4 leading-relaxed font-medium">
              <strong className="font-bold">Note:</strong> Create a separate Campus Eats password. Do not use your existing Bennett University portal password.
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1F2937] mb-1.5">
                Bennett University Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@bennett.edu.in"
                required
                className="w-full px-4 py-3.5 bg-[#F8FDFA] border border-[#D5EAE7] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition text-base text-[#1F2937] placeholder:text-[#728783]/60 focus:text-[#1F2937]"
              />
            </div>

            {mode !== 'forgot_password' && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="password" className="block text-sm font-semibold text-[#1F2937]">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot_password')}
                      className="min-h-[36px] flex items-center text-xs text-[#0D9488] hover:text-[#0F766E] font-semibold transition"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Create a password (min. 6 characters)' : 'Enter your password'}
                    required
                    minLength={6}
                    className="w-full px-4 py-3.5 pr-12 bg-[#F8FDFA] border border-[#D5EAE7] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition text-base text-[#1F2937] placeholder:text-[#728783]/60 focus:text-[#1F2937]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 w-11 h-full flex items-center justify-center text-[#728783] hover:text-[#0D9488] focus:outline-none focus:ring-2 focus:ring-[#0D9488] rounded-xl transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#1F2937] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3.5 pr-12 bg-[#F8FDFA] border border-[#D5EAE7] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition text-base text-[#1F2937] placeholder:text-[#728783]/60 focus:text-[#1F2937]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 w-11 h-full flex items-center justify-center text-[#728783] hover:text-[#0D9488] focus:outline-none focus:ring-2 focus:ring-[#0D9488] rounded-xl transition"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-[#E6F7F5] border border-[#0D9488]/30 text-[#0D9488] px-4 py-3 rounded-xl text-sm font-medium">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3.5 px-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-sm active:scale-98 flex items-center justify-center"
            >
              {loading
                ? mode === 'signup'
                  ? 'Creating Account...'
                  : mode === 'forgot_password'
                  ? 'Sending Reset Link...'
                  : 'Signing in...'
                : mode === 'signup'
                ? 'Create Account'
                : mode === 'forgot_password'
                ? 'Send Reset Link'
                : 'Login'}
            </button>

            {mode === 'signup' && (
              <p className="text-xs text-[#728783] text-center leading-relaxed mt-3">
                By creating an account, you acknowledge that you have read and agree to our{' '}
                <Link
                  href="/terms-and-conditions"
                  className="text-[#0D9488] hover:text-[#0F766E] underline font-semibold transition"
                >
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy-policy"
                  className="text-[#0D9488] hover:text-[#0F766E] underline font-semibold transition"
                >
                  Privacy Policy
                </Link>.
              </p>
            )}
          </form>

          {mode === 'forgot_password' ? (
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="min-h-[44px] px-4 inline-flex items-center text-sm text-[#0D9488] hover:text-[#0F766E] font-semibold transition gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
            </div>
          ) : (
            <p className="text-center text-xs text-[#728783] mt-6">
              Only @bennett.edu.in emails are allowed
            </p>
          )}

          {/* Legal Links (Always accessible and clickable on mobile & desktop) */}
          <div className="mt-6 pt-4 border-t border-[#D5EAE7] flex items-center justify-center gap-4 text-xs text-[#728783]">
            <Link
              href="/terms-and-conditions"
              className="text-[#0D9488] hover:text-[#0F766E] underline font-semibold transition py-1"
            >
              Terms & Conditions
            </Link>
            <span className="text-[#D5EAE7]">•</span>
            <Link
              href="/privacy-policy"
              className="text-[#0D9488] hover:text-[#0F766E] underline font-semibold transition py-1"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
