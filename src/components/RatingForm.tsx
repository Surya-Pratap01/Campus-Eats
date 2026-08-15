'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface RatingFormProps {
  menuItemId: string
  existingRating?: any
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
    }
    setLoading(false)
  }

  const StarInput = ({ value, onChange, label }: { value: number, onChange: (val: number) => void, label: string }) => {
    const [hoverValue, setHoverValue] = useState(0)
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
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
              className={`text-2xl transition-all duration-200 transform hover:scale-110 active:scale-95 min-w-[28px] focus:outline-none focus:ring-2 focus:ring-orange-500 rounded ${
                star <= (hoverValue || value) 
                  ? 'text-yellow-500 scale-105' 
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
            >
              {star <= (hoverValue || value) ? '★' : '☆'}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StarInput value={taste} onChange={setTaste} label="Taste" />
        <StarInput value={hygiene} onChange={setHygiene} label="Hygiene" />
        <StarInput value={quantity} onChange={setQuantity} label="Quantity" />
        <StarInput value={valueForMoney} onChange={setValueForMoney} label="Value for Money" />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Comment (optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 300))}
          placeholder="Share your experience..."
          rows={3}
          maxLength={300}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
        />
        <p className="text-sm text-gray-500 mt-1">{comment.length}/300 characters</p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : existingRating ? 'Update Rating' : 'Submit Rating'}
        </button>

        {existingRating && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  )
}
