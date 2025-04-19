'use client'
import { useState, useEffect } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

export default function QuoteGenerator() {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchQuote = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/quote')
      const data = await response.json()
      setQuote(data[0]) 
    } catch (error) {
      console.error('Error fetching quote:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchQuote()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-4 text-gray-50">
      <div className="bg-white text-gray-700 rounded-lg shadow-lg p-6">
        {quote ? (
          <>
            <blockquote className="text-xl italic mb-4">
              "{quote.q}"
            </blockquote>
            <p className="text-right font-semibold">- {quote.a}</p>
          </>
        ) : (
          <p className="text-center">Loading initial quote...</p>
        )}
        
        <button
          onClick={fetchQuote}
          disabled={loading}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center mx-auto"
        >
          <ArrowPathIcon className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Generating...' : 'New Quote'}
        </button>
      </div>
    </div>
  )
}