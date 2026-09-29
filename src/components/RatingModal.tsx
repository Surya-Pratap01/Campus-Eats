'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface RatingProfile {
  email: string | null
  full_name: string | null
}

interface CommunityReview {
  id: string
  taste: number
  quantity: number
  value_for_money: number
  hygiene: number
  comment: string | null
  created_at: string
  profiles: RatingProfile | null
}

export interface MenuItemForRating {
  id: string
  name: string
  category?: string
  price?: number
}

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  item: MenuItemForRating | null
  onRatingSubmitted?: () => void
}

function StarRatingInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (val: number) => void
}) {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 border-b border-gray-100 last:border-b-0 gap-1.5 sm:gap-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        <span className="text-xs font-bold text-orange-600 sm:hidden">
          {(hoverValue || value) > 0 ? `${hoverValue || value} / 5` : 'Not rated'}
        </span>
      </div>
      <div className="flex items-center justify-between sm:justify-end space-x-1 sm:space-x-1.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= (hoverValue || value)
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(0)}
              aria-label={`Rate ${label} ${star} of 5`}
              className={`w-11 h-11 flex items-center justify-center text-3xl sm:text-2xl rounded-xl transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                active ? 'text-amber-400 bg-amber-50/50 sm:bg-transparent' : 'text-gray-300'
              }`}
            >
              {active ? '★' : '☆'}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function RatingModalDialog({
  item,
  onClose,
  onRatingSubmitted,
}: {
  item: MenuItemForRating
  onClose: () => void
  onRatingSubmitted?: () => void
}) {
  const [taste, setTaste] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [valueForMoney, setValueForMoney] = useState(0)
  const [hygiene, setHygiene] = useState(0)
  const [comment, setComment] = useState('')
  const [existingRatingId, setExistingRatingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [itemReviews, setItemReviews] = useState<CommunityReview[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (user && isMounted) {
          const { data: userRating } = await supabase
            .from('ratings')
            .select('id, taste, quantity, value_for_money, hygiene, comment')
            .eq('menu_item_id', item.id)
            .eq('student_id', user.id)
            .maybeSingle()

          if (userRating && isMounted) {
            setExistingRatingId(userRating.id)
            setTaste(userRating.taste || 0)
            setQuantity(userRating.quantity || 0)
            setValueForMoney(userRating.value_for_money || 0)
            setHygiene(userRating.hygiene || 0)
            setComment(userRating.comment || '')
          }
        }

        const { data: reviews } = await supabase
          .from('ratings')
          .select(`
            id,
            taste,
            quantity,
            value_for_money,
            hygiene,
            comment,
            created_at,
            profiles (email, full_name)
          `)
          .eq('menu_item_id', item.id)
          .order('created_at', { ascending: false })

        if (isMounted) {
          setItemReviews((reviews as unknown as CommunityReview[]) || [])
        }
      } catch (err) {
        console.error('Error fetching rating data:', err)
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [item.id, supabase])

  // Prevent background scrolling while modal is open, and restore on unmount
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (taste === 0 || quantity === 0 || valueForMoney === 0 || hygiene === 0) {
      setError('Please rate all 4 categories (Taste, Quantity, Value for Money, Hygiene).')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('You must be signed in to submit a rating.')
        setLoading(false)
        return
      }

      const ratingPayload = {
        menu_item_id: item.id,
        student_id: user.id,
        taste,
        quantity,
        value_for_money: valueForMoney,
        hygiene,
        comment: comment.trim() || null,
      }

      const { error: submitError } = await supabase
        .from('ratings')
        .upsert(ratingPayload, {
          onConflict: 'menu_item_id,student_id',
        })

      if (submitError) {
        setError(submitError.message || 'Failed to submit rating. Please try again.')
      } else {
        onRatingSubmitted?.()
        router.refresh()
        onClose()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected error occurred.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove your rating?')) return

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error: deleteError } = await supabase
        .from('ratings')
        .delete()
        .eq('menu_item_id', item.id)
        .eq('student_id', user.id)

      if (deleteError) {
        setError('Failed to delete rating.')
      } else {
        onRatingSubmitted?.()
        router.refresh()
        onClose()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete rating.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 relative animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 motion-reduce:animate-none pb-safe sm:pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle Bar Indicator */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Close Button - Minimum 44x44px Hit Target */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 flex items-center justify-center text-gray-400 hover:text-gray-600 transition text-2xl font-bold rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-10">
          <h2 id="modal-headline" className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
            {existingRatingId ? 'Edit Your Rating' : `Rate ${item.name}`}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-gray-500">
            {item.category && <span>{item.category}</span>}
            {item.category && item.price && <span>•</span>}
            {item.price ? <span className="font-semibold text-orange-600">₹{item.price}</span> : null}
          </div>
        </div>

        {/* Rating Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-3.5 sm:p-4 border border-gray-100">
            <StarRatingInput label="Taste" value={taste} onChange={setTaste} />
            <StarRatingInput label="Quantity" value={quantity} onChange={setQuantity} />
            <StarRatingInput label="Value for Money" value={valueForMoney} onChange={setValueForMoney} />
            <StarRatingInput label="Hygiene" value={hygiene} onChange={setHygiene} />
          </div>

          <div>
            <label htmlFor="modal-comment" className="block text-sm font-semibold text-gray-700 mb-1">
              Review (optional)
            </label>
            <textarea
              id="modal-comment"
              rows={3}
              maxLength={300}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your experience with this food..."
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-base text-gray-900 placeholder:text-gray-400 focus:text-gray-900 resize-none"
            />
            <p className="text-right text-xs text-gray-400 mt-1">{comment.length}/300</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-4 rounded-xl transition disabled:opacity-50 text-sm shadow-sm min-h-[48px] flex items-center justify-center active:scale-98"
            >
              {loading
                ? 'Submitting...'
                : existingRatingId
                ? 'Update Review'
                : 'Submit Review'}
            </button>

            {existingRatingId && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3.5 px-4 rounded-xl transition disabled:opacity-50 text-sm border border-red-200 min-h-[48px] flex items-center justify-center active:scale-98"
              >
                Delete
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition text-sm min-h-[44px] flex items-center justify-center active:scale-98"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Existing Community Reviews */}
        {itemReviews.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-200">
            <h3 className="font-bold text-gray-800 text-sm mb-3">
              Community Reviews ({itemReviews.length})
            </h3>
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {itemReviews.map((rev) => {
                const avg = (
                  (rev.taste + rev.quantity + rev.value_for_money + rev.hygiene) / 4
                ).toFixed(1)
                return (
                  <div key={rev.id} className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800 truncate max-w-[180px]">
                        {rev.profiles?.full_name || rev.profiles?.email || 'Student'}
                      </span>
                      <span className="text-orange-600 font-bold">★ {avg}</span>
                    </div>
                    <div className="text-gray-500 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px]">
                      <span>Taste: {rev.taste}</span>
                      <span>Qty: {rev.quantity}</span>
                      <span>VFM: {rev.value_for_money}</span>
                      <span>Hygiene: {rev.hygiene}</span>
                    </div>
                    {rev.comment && <p className="text-gray-700 pt-1 leading-relaxed">{rev.comment}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RatingModal({
  isOpen,
  onClose,
  item,
  onRatingSubmitted,
}: RatingModalProps) {
  if (!isOpen || !item) return null

  return (
    <RatingModalDialog
      item={item}
      onClose={onClose}
      onRatingSubmitted={onRatingSubmitted}
    />
  )
}
