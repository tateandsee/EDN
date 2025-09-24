'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Search, Filter, X, Clock, Star, Eye, Download } from 'lucide-react'

export interface SearchResult {
  id: string
  type: 'content' | 'user' | 'marketplace' | 'platform'
  title: string
  description: string
  thumbnail?: string
  tags?: string[]
  author?: string
  createdAt: Date
  views?: number
  downloads?: number
  rating?: number
  url: string
}

export interface SearchFilters {
  type: 'all' | 'content' | 'user' | 'marketplace' | 'platform'
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year'
  sortBy: 'relevance' | 'newest' | 'oldest' | 'popular' | 'rating'
  tags: string[]
  author?: string
  minRating?: number
  hasThumbnail?: boolean
}

interface SearchContextType {
  query: string
  setQuery: (query: string) => void
  results: SearchResult[]
  isLoading: boolean
  filters: SearchFilters
  setFilters: (filters: Partial<SearchFilters>) => void
  searchHistory: string[]
  addToHistory: (query: string) => void
  clearHistory: () => void
  trendingSearches: string[]
  search: (query: string, filters?: Partial<SearchFilters>) => Promise<void>
  clearResults: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFiltersState] = useState<SearchFilters>({
    type: 'all',
    dateRange: 'all',
    sortBy: 'relevance',
    tags: []
  })
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [trendingSearches] = useState([
    'AI generated art',
    'face cloning',
    '4K images',
    'video creation',
    'virtual try-on',
    'NSFW content',
    'SFW content',
    'marketplace items'
  ])

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory')
    if (saved) {
      setSearchHistory(JSON.parse(saved))
    }
  }, [])

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
  }, [searchHistory])

  const addToHistory = (newQuery: string) => {
    const trimmed = newQuery.trim()
    if (!trimmed) return

    setSearchHistory(prev => {
      // Remove if already exists
      const filtered = prev.filter(q => q !== trimmed)
      // Add to beginning, keep only last 10
      return [trimmed, ...filtered].slice(0, 10)
    })
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  const setFilters = (newFilters: Partial<SearchFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }

  const clearResults = () => {
    setResults([])
    setQuery('')
  }

  const search = async (searchQuery: string, searchFilters?: Partial<SearchFilters>) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    setQuery(searchQuery)

    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'content',
          title: 'Stunning AI-Generated Portrait',
          description: 'Beautiful 4K portrait created with advanced AI technology',
          thumbnail: '/placeholder-image.jpg',
          tags: ['portrait', 'AI', '4K', 'art'],
          author: 'AI Artist',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          views: 15420,
          downloads: 892,
          rating: 4.8,
          url: '/content/1'
        },
        {
          id: '2',
          type: 'marketplace',
          title: 'Premium Face Cloning Service',
          description: 'Professional face cloning with 95% accuracy guarantee',
          thumbnail: '/placeholder-image.jpg',
          tags: ['face cloning', 'AI', 'premium'],
          author: 'FaceClone Pro',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
          views: 8750,
          downloads: 234,
          rating: 4.9,
          url: '/marketplace/2'
        },
        {
          id: '3',
          type: 'user',
          title: 'Digital Creator Pro',
          description: 'Professional content creator specializing in AI-generated art',
          thumbnail: '/placeholder-avatar.jpg',
          tags: ['creator', 'artist', 'AI'],
          author: 'Digital Creator Pro',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          views: 25600,
          rating: 4.7,
          url: '/user/3'
        },
        {
          id: '4',
          type: 'content',
          title: 'Cinematic AI Video',
          description: '60fps cinematic video with advanced AI effects',
          thumbnail: '/placeholder-video.jpg',
          tags: ['video', 'cinematic', 'AI', '60fps'],
          author: 'Video Master',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
          views: 32100,
          downloads: 567,
          rating: 4.6,
          url: '/content/4'
        },
        {
          id: '5',
          type: 'platform',
          title: 'OnlyFans Integration',
          description: 'Seamless integration with OnlyFans platform',
          tags: ['OnlyFans', 'integration', 'platform'],
          author: 'EDN AI',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          views: 45200,
          rating: 4.5,
          url: '/platforms/onlyfans'
        }
      ]

      // Filter results based on search query
      const filtered = mockResults.filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )

      // Apply additional filters
      const finalFilters = { ...filters, ...searchFilters }
      let finalResults = filtered

      if (finalFilters.type !== 'all') {
        finalResults = finalResults.filter(r => r.type === finalFilters.type)
      }

      // Sort results
      switch (finalFilters.sortBy) {
        case 'newest':
          finalResults.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          break
        case 'oldest':
          finalResults.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          break
        case 'popular':
          finalResults.sort((a, b) => (b.views || 0) - (a.views || 0))
          break
        case 'rating':
          finalResults.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
        default:
          // relevance - keep original order
          break
      }

      setResults(finalResults)
      addToHistory(searchQuery)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SearchContext.Provider value={{
      query,
      setQuery,
      results,
      isLoading,
      filters,
      setFilters,
      searchHistory,
      addToHistory,
      clearHistory,
      trendingSearches,
      search,
      clearResults
    }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

// Search Components
export function SearchBar() {
  const { query, setQuery, search, isLoading, searchHistory, addToHistory, clearHistory, trendingSearches } = useSearch()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      search(query.trim())
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const suggestions = [...searchHistory, ...trendingSearches].slice(0, 8)
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const selectedSuggestion = suggestions[selectedIndex]
      setQuery(selectedSuggestion)
      search(selectedSuggestion)
      setShowSuggestions(false)
      setSelectedIndex(-1)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  const suggestions = [...searchHistory, ...trendingSearches].slice(0, 8)

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search content, users, marketplace..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setShowSuggestions(false)
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {searchHistory.length > 0 && (
            <div className="p-2 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Recent Searches</span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Clear
                </button>
              </div>
              {searchHistory.map((item, index) => (
                <button
                  key={`history-${index}`}
                  onClick={() => {
                    setQuery(item)
                    search(item)
                    setShowSuggestions(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded ${
                    selectedIndex === index ? 'bg-primary/10' : ''
                  }`}
                >
                  <Clock className="inline-block w-3 h-3 mr-2 text-gray-400" />
                  {item}
                </button>
              ))}
            </div>
          )}
          
          <div className="p-2">
            <span className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Trending</span>
            {trendingSearches.map((item, index) => (
              <button
                key={`trending-${index}`}
                onClick={() => {
                  setQuery(item)
                  search(item)
                  setShowSuggestions(false)
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded ${
                  selectedIndex === searchHistory.length + index ? 'bg-primary/10' : ''
                }`}
              >
                <Search className="inline-block w-3 h-3 mr-2 text-gray-400" />
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function SearchFilters() {
  const { filters, setFilters } = useSearch()

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
      <select
        value={filters.type}
        onChange={(e) => setFilters({ type: e.target.value as any })}
        className="px-3 py-1 border border-gray-300 rounded text-sm"
      >
        <option value="all">All Types</option>
        <option value="content">Content</option>
        <option value="user">Users</option>
        <option value="marketplace">Marketplace</option>
        <option value="platform">Platforms</option>
      </select>

      <select
        value={filters.dateRange}
        onChange={(e) => setFilters({ dateRange: e.target.value as any })}
        className="px-3 py-1 border border-gray-300 rounded text-sm"
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>

      <select
        value={filters.sortBy}
        onChange={(e) => setFilters({ sortBy: e.target.value as any })}
        className="px-3 py-1 border border-gray-300 rounded text-sm"
      >
        <option value="relevance">Most Relevant</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="popular">Most Popular</option>
        <option value="rating">Highest Rated</option>
      </select>
    </div>
  )
}

export function SearchResults() {
  const { results, isLoading, query } = useSearch()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!query) {
    return (
      <div className="text-center py-8">
        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Start Searching</h3>
        <p className="text-gray-500">Enter a search term to find content, users, and more</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Results Found</h3>
        <p className="text-gray-500">Try adjusting your search terms or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
      </div>
      
      {results.map((result) => (
        <SearchResultCard key={result.id} result={result} />
      ))}
    </div>
  )
}

function SearchResultCard({ result }: { result: SearchResult }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'content':
        return 'bg-blue-100 text-blue-800'
      case 'user':
        return 'bg-green-100 text-green-800'
      case 'marketplace':
        return 'bg-purple-100 text-purple-800'
      case 'platform':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
         onClick={() => window.location.href = result.url}>
      <div className="flex gap-4">
        {result.thumbnail && (
          <div className="flex-shrink-0">
            <img
              src={result.thumbnail}
              alt={result.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{result.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(result.type)}`}>
                  {result.type}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{result.description}</p>
              
              {result.tags && result.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {result.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {result.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{result.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {result.author && (
              <span>By {result.author}</span>
            )}
            {result.views && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatNumber(result.views)}
              </span>
            )}
            {result.downloads && (
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {formatNumber(result.downloads)}
              </span>
            )}
            {result.rating && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-yellow-400" />
                {result.rating}
              </span>
            )}
            <span>{result.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}