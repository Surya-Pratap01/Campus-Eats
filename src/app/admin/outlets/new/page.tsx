'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { ArrowLeft } from 'lucide-react'

export default function NewOutletPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase
      .from('outlets')
      .insert({
        name,
        description: description || null,
        photo_url: photoUrl || null,
        location: location || null,
      })

    if (error) {
      setError(error.message)
    } else {
      router.push('/admin')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F0FBFA]">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin')}
            className="inline-flex items-center text-[#0D9488] hover:text-[#0f766e] font-semibold transition gap-1.5 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Admin
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#D5EAE7] p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Outlet</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Outlet Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 border border-[#D5EAE7] rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 border border-[#D5EAE7] rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition resize-none"
              />
            </div>

            <div>
              <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Photo URL
              </label>
              <input
                id="photoUrl"
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 border border-[#D5EAE7] rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location on Campus
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Near Block A, Ground Floor"
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 border border-[#D5EAE7] rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold py-3 px-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xs active:scale-98"
              >
                {loading ? 'Creating...' : 'Create Outlet'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition active:scale-98"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
