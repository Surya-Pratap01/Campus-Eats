'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Flag, Check } from 'lucide-react'

interface ReportButtonProps {
  ratingId: string
  isReported: boolean
  onReportChange?: (reported: boolean) => void
}

export default function ReportButton({ ratingId, isReported, onReportChange }: ReportButtonProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleReport = async () => {
    if (isReported) {
      setMessage('This comment has already been reported')
      return
    }

    setLoading(true)
    setMessage('')

    const { error } = await supabase
      .from('ratings')
      .update({ reported: true })
      .eq('id', ratingId)

    if (error) {
      setMessage('Error reporting comment. Please try again.')
    } else {
      setMessage('Comment reported successfully!')
      onReportChange?.(true)
    }

    setLoading(false)
  }

  return (
    <div>
      <button
        onClick={handleReport}
        disabled={loading || isReported}
        className={`min-h-[44px] px-2.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center active:scale-95 ${
          isReported 
            ? 'text-gray-400 cursor-not-allowed bg-gray-50' 
            : 'text-red-500 hover:text-red-700 hover:bg-red-50'
        }`}
      >
        {loading ? (
          'Reporting...'
        ) : isReported ? (
          <span className="inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> Reported
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5" /> Report
          </span>
        )}
      </button>
      {message && (
        <p className="text-xs mt-1 text-gray-500">{message}</p>
      )}
    </div>
  )
}
