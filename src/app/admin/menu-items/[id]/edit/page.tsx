'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { ArrowLeft } from 'lucide-react'

export default function EditMenuItemPage() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const loadMenuItem = async () => {
      const { data: item, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error || !item) {
        setError('Failed to load menu item')
      } else {
        setName(item.name)
        setCategory(item.category)
        setPhotoUrl(item.photo_url || '')
        setPrice(item.price ? String(item.price) : '')
      }
      setLoading(false)
    }

    loadMenuItem()
  }, [supabase, params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const { error } = await supabase
      .from('menu_items')
      .update({
        name,
        category,
        photo_url: photoUrl || null,
        price: price ? parseFloat(price) : null,
      })
      .eq('id', params.id)

    if (error) {
      setError(error.message)
    } else {
      router.push(`/admin/outlets/${(await supabase.from('menu_items').select('outlet_id').eq('id', params.id).single()).data?.outlet_id}/menu`)
    }

    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this menu item? This will also delete all ratings for this item.')) return

    const { data: item } = await supabase
      .from('menu_items')
      .select('outlet_id')
      .eq('id', params.id)
      .single()

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', params.id)

    if (error) {
      setError(error.message)
    } else {
      router.push(`/admin/outlets/${item?.outlet_id}/menu`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FBFA]">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-[#728783]">Loading...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0FBFA]">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-[#0D9488] hover:text-[#0f766e] font-semibold transition gap-1.5 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#D5EAE7] p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Menu Item</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Item Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 focus:text-gray-900 border border-[#D5EAE7] rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 focus:text-gray-900 border border-[#D5EAE7] rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
              >
                <option value="">Select a category</option>
                <option value="Beverages">Beverages</option>
                <option value="Snacks">Snacks</option>
                <option value="Meals">Meals</option>
                <option value="Desserts">Desserts</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Chinese">Chinese</option>
                <option value="South Indian">South Indian</option>
                <option value="North Indian">North Indian</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                min="0"
                placeholder="e.g., 50"
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 focus:text-gray-900 border border-[#D5EAE7] rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
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
                className="w-full px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 focus:text-gray-900 border border-[#D5EAE7] rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition"
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
                disabled={saving}
                className="flex-1 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold py-3 px-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xs active:scale-98"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition active:scale-98"
              >
                Delete Item
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
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
