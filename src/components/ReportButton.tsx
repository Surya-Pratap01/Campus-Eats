'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
        className={`text-sm font-medium transition ${
          isReported 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-red-500 hover:text-red-600'
        }`}
      >
        {loading ? 'Reporting...' : isReported ? '✓ Reported' : '🚩 Report'}
      </button>
      {message && (
        <p className="text-xs mt-1 text-gray-500">{message}</p>
      )}
    </div>
  )
}
