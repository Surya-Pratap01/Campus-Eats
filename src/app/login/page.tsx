'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    // Domain restriction
    if (!email.endsWith('@bennett.edu.in')) {
      setError('Only @bennett.edu.in email addresses are allowed')
      setLoading(false)
      return
    }

    const redirectUrl = `${window.location.origin}/auth/callback`
    
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      })

      if (error) {
        console.error('Auth error:', error)
        if (error.message.includes('Invalid redirect URL') || error.message.includes('redirect')) {
          setError(`Authentication error: The redirect URL (${redirectUrl}) is not configured in Supabase Dashboard. Please add this URL to your Supabase project's Authentication > URL Configuration > Redirect URLs.`)
        } else {
          setError(error.message)
        }
      } else {
        setMessage(`Magic link sent to ${email}! Check your Bennett email inbox (and spam folder).`)
      }
    } catch (err: any) {
      console.error('Supabase client error:', err)
      setError(err.message || 'Failed to initialize authentication. Please contact support.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-orange-600 mb-2">🍽️ CampusEats</h1>
            <p className="text-gray-600">Rate & discover the best food on campus</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Bennett University Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@bennett.edu.in"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending magic link...' : 'Send Magic Link'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Only @bennett.edu.in emails are allowed
          </p>
        </div>
      </div>
    </div>
  )
}
