'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Star } from 'lucide-react'

interface ExistingRating {
  id?: string
  taste?: number
  hygiene?: number
  quantity?: number
  value_for_money?: number
  comment?: string | null
}

interface RatingFormProps {
  menuItemId: string
  existingRating?: ExistingRating | null
  onRatingSubmitted?: () => void
}

export default function RatingForm({ menuItemId, existingRating, onRatingSubmitted }: RatingFormProps) {
  const [taste, setTaste] = useState(existingRating?.taste || 0)
  const [hygiene, setHygiene] = useState(existingRating?.hygiene || 0)
  const [quantity, setQuantity] = useState(existingRating?.quantity || 0)
  const [valueForMoney, setValueForMoney] = useState(existingRating?.value_for_money || 0)
  const [comment, setComment] = useState(existingRating?.comment || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    if (taste === 0 || hygiene === 0 || quantity === 0 || valueForMoney === 0) {
      setMessage('Please rate all dimensions')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setMessage('You must be logged in to rate')
      setLoading(false)
      return
    }

    const ratingData = {
      menu_item_id: menuItemId,
      student_id: user.id,
      taste,
      hygiene,
      quantity,
      value_for_money: valueForMoney,
      comment: comment || null,
    }

    const { error } = await supabase
      .from('ratings')
      .upsert(ratingData, {
        onConflict: 'menu_item_id,student_id',
      })

    if (error) {
      setMessage('Error submitting rating. Please try again.')
    } else {
      setMessage(existingRating ? 'Rating updated successfully!' : 'Rating submitted successfully!')
      onRatingSubmitted?.()
      router.refresh()
      // Clear form after successful submission
      if (!existingRating) {
        setTaste(0)
        setHygiene(0)
        setQuantity(0)
        setValueForMoney(0)
        setComment('')
      }
    }

    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your rating?')) return

    setLoading(true)
    const { error } = await supabase
      .from('ratings')
      .delete()
      .eq('menu_item_id', menuItemId)
      .eq('student_id', (await supabase.auth.getUser()).data.user?.id)

    if (error) {
      setMessage('Error deleting rating. Please try again.')
    } else {
      setMessage('Rating deleted successfully!')
      setTaste(0)
      setHygiene(0)
      setQuantity(0)
      setValueForMoney(0)
      setComment('')
      onRatingSubmitted?.()
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StarInput value={taste} onChange={setTaste} label="Taste" />
        <StarInput value={quantity} onChange={setQuantity} label="Quantity" />
        <StarInput value={valueForMoney} onChange={setValueForMoney} label="Value for Money" />
        <StarInput value={hygiene} onChange={setHygiene} label="Hygiene" />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
          Comment (optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 300))}
          placeholder="Share your experience..."
          rows={3}
          maxLength={300}
          className="w-full px-4 py-3 bg-white border border-[#D5EAE7] rounded-xl focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition text-base text-gray-900 placeholder:text-gray-400 focus:text-gray-900 resize-none"
        />
        <p className="text-sm text-gray-500 mt-1">{comment.length}/300 characters</p>
      </div>

      {message && (
        <div className={`p-3.5 rounded-xl text-sm ${message.includes('Error') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-[#E6F7F5] border border-[#0D9488]/20 text-[#0D9488]'}`}>
          {message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 min-h-[48px] bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3.5 px-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xs active:scale-98 flex items-center justify-center text-sm"
        >
          {loading ? 'Submitting...' : existingRating ? 'Update Rating' : 'Submit Rating'}
        </button>

        {existingRating && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="min-h-[48px] bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3.5 px-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed border border-red-200 active:scale-98 flex items-center justify-center text-sm"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  )
}

function StarInput({ value, onChange, label }: { value: number; onChange: (val: number) => void; label: string }) {
  const [hoverValue, setHoverValue] = useState(0)
  
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        <span className="text-xs font-bold text-[#0D9488] sm:hidden">
          {(hoverValue || value) > 0 ? `${hoverValue || value} / 5` : 'Not rated'}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            onFocus={() => setHoverValue(star)}
            onBlur={() => setHoverValue(0)}
            aria-label={`Rate ${label} ${star} out of 5`}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 transform active:scale-90 focus:outline-none focus:ring-2 focus:ring-[#0D9488] ${
              star <= (hoverValue || value) 
                ? 'bg-amber-50/50 sm:bg-transparent' 
                : 'hover:bg-amber-50/30'
            }`}
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= (hoverValue || value)
                  ? 'text-amber-500 fill-amber-500'
                  : 'text-gray-300 hover:text-amber-400'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
