'use client'

import { useState, useEffect } from 'react'

interface TestItem {
  id: string
  title: string
  thumbnail: string
  category: string
  isNsfw: boolean
}

export default function TestImagesPage() {
  const [items, setItems] = useState<TestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/marketplace/items?category=NSFW&limit=6')
        if (response.ok) {
          const data = await response.json()
          setItems(data.items || [])
        } else {
          setError('Failed to fetch items')
        }
      } catch (err) {
        setError('Error fetching items')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', {
      src: e.currentTarget.src,
      alt: e.currentTarget.alt,
      error: e.nativeEvent
    })
  }

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('Image loaded successfully:', {
      src: e.currentTarget.src.substring(0, 50) + '...',
      alt: e.currentTarget.alt
    })
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Image Display Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
            <p className="text-sm text-gray-600 mb-4">Category: {item.category} | NSFW: {item.isNsfw ? 'Yes' : 'No'}</p>
            
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No thumbnail available
                </div>
              )}
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              <p>Thumbnail length: {item.thumbnail?.length || 0}</p>
              <p>Thumbnail type: {item.thumbnail?.split(';')[0].split(':')[1] || 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}