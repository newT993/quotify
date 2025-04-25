"use client"
import { useState, useEffect } from 'react'
import { ArrowPathIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
const POPULAR_TAGS = [
  { id: 'daily', label: 'Quote of the Day' },
  { id: 'inspiration', label: 'Inspirational' },
  { id: 'funny', label: 'Funny' },
  { id: 'love', label: 'Love' },
  { id: 'simplicity', label: 'Simplicity' }
];
export default function QuoteGenerator() {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [bgLoaded, setBgLoaded] = useState(false)
  const [bgUrl, setBgUrl] = useState(null)
  const [photographer, setPhotographer] = useState(null)
  const [photographerUrl, setPhotographerUrl] = useState(null)
  const [selectedTag, setSelectedTag] = useState('daily')

  const fetchBackground = async (query = 'nature') => {
    try {
      const response = await fetch(`/api/unsplash?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch background');
      const data = await response.json();
      setPhotographer(data.photographer);
      setPhotographerUrl(data.photographerUrl);
      return data.url;
    } catch (error) {
      console.error('Error fetching background:', error);
      return null;
    }
  }

  const fetchQuote = async (tag = selectedTag || 'daily') => {
    setError(null)
    setLoading(true)
    setBgLoaded(false)
    try {
      const [quoteResponse, bgUrl] = await Promise.all([
        fetch(`/api/quote${tag === 'daily' ? '' : `?tag=${encodeURIComponent(tag)}`}`),
        fetchBackground(tag)
      ]);
      
      if (!quoteResponse.ok) throw new Error('Failed to fetch quote');
      const quoteData = await quoteResponse.json();

      if (bgUrl) {
        const img = new Image();
        setBgUrl(bgUrl);
        img.src = bgUrl;
        img.onload = () => {
          setBgLoaded(true);
        };
      }

      setQuote(quoteData);
      setAnimate(true);
    } catch (error) {
      setError(error.message || 'Failed to fetch quote. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = async () => {
    if (!quote) return
    try {
      // Update to use FavQs API response format
      await navigator.clipboard.writeText(`${quote.body} - ${quote.author}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  useEffect(() => {
    fetchQuote()
  }, [selectedTag])

  return (
    <div className="max-w-2xl mx-auto  p-4">
        <div className="fixed inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{ 
              backgroundImage: `url(${bgUrl || '/image1.png'})`,
              opacity: bgLoaded ? 1 : 0,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
          
          {photographer && (
            <div className="absolute bottom-2 right-2 text-xs text-white/70">
              Photo by{' '}
              <a 
                href={photographerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                {photographer}
              </a>
              {' '}on Unsplash
            </div>
          )}
        </div>
      <div className="  bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 rounded-lg p-6 relative">
        <div className="mb-6 flex flex-wrap gap-2">
          {POPULAR_TAGS.map(tag => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTag === tag.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            <p>{error}</p>
            <button
              onClick={fetchQuote}
              className="mt-2 text-red-700 underline hover:text-red-900"
            >
              Try Again
            </button>
          </div>
        )}

        {copied && (
          <div className="absolute top-2 right-2 bg-green-100 text-green-700 px-3 py-1 rounded-lg">
            Copied!
          </div>
        )}

        {quote ? (
          <div 
            className={`transition-opacity duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`}
            onTransitionEnd={() => setAnimate(false)}
          >
            <blockquote className="text-xl italic mb-4">
              "{quote.body}"
            </blockquote>
            <p className="text-right font-semibold">- {quote.author}</p>
            {quote.tags && quote.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {quote.tags.map(tag => (
                  <span key={tag} className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          !error && <p className="text-center">Loading initial quote...</p>
        )}

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => fetchQuote(selectedTag)}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generating...' : 'New Quote'}
          </button>

          <button
            onClick={copyToClipboard}
            disabled={!quote}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded flex items-center gap-2"
          >
            <ClipboardDocumentIcon className="w-5 h-5" />
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}