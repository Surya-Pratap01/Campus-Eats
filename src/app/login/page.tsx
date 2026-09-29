'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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
        router.push('/')
        router.refresh()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign in. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50/40 to-yellow-50 px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-black text-orange-600 mb-1.5 flex items-center justify-center gap-2">
              <span>🍽️</span>
              <span>CampusEats</span>
            </h1>
            <p className="text-gray-600 text-sm">Rate & discover the best food on campus</p>
          </div>

          {/* Mode Switcher Tabs */}
          {mode !== 'forgot_password' && (
            <div className="flex border border-gray-200 rounded-xl p-1 mb-6 bg-gray-50">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 min-h-[44px] py-2.5 text-sm font-bold rounded-lg transition active:scale-95 ${
                  mode === 'login'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`flex-1 min-h-[44px] py-2.5 text-sm font-bold rounded-lg transition active:scale-95 ${
                  mode === 'signup'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {mode === 'forgot_password' && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Forgot Password</h2>
              <p className="text-gray-600 text-sm mt-1">
                Enter your Bennett University email to receive a password reset link.
              </p>
            </div>
          )}

          {mode === 'signup' && (
            <div className="bg-orange-50 border border-orange-200 text-orange-900 text-xs rounded-xl p-3 mb-4 leading-relaxed">
              <strong>Note:</strong> Create a separate Campus Eats password. Do not use your existing Bennett University portal password.
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Bennett University Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@bennett.edu.in"
                required
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-base text-gray-900 placeholder:text-gray-400 focus:text-gray-900"
              />
            </div>

            {mode !== 'forgot_password' && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot_password')}
                      className="min-h-[36px] flex items-center text-xs text-orange-600 hover:text-orange-700 font-semibold"
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
                    className="w-full px-4 py-3.5 pr-12 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-base text-gray-900 placeholder:text-gray-400 focus:text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 w-11 h-full flex items-center justify-center text-gray-400 hover:text-gray-600 text-lg transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                    className="w-full px-4 py-3.5 pr-12 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-base text-gray-900 placeholder:text-gray-400 focus:text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 w-11 h-full flex items-center justify-center text-gray-400 hover:text-gray-600 text-lg transition"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
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
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-sm active:scale-98 flex items-center justify-center"
            >
              {loading
                ? mode === 'signup'
                  ? 'Creating Account...'
                  : mode === 'forgot_password'
                  ? 'Sending Reset Link...'
                  : 'Signing In...'
                : mode === 'signup'
                ? 'Create Account'
                : mode === 'forgot_password'
                ? 'Send Reset Link'
                : 'Login'}
            </button>
          </form>

          {mode === 'forgot_password' ? (
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="min-h-[44px] px-4 inline-flex items-center text-sm text-orange-600 hover:text-orange-700 font-semibold"
              >
                ← Back to Login
              </button>
            </div>
          ) : (
            <p className="text-center text-xs text-gray-500 mt-6">
              Only @bennett.edu.in emails are allowed
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
