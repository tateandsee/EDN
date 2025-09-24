'use client'

import { useState, useEffect } from 'react'
import { useSearch } from '@/contexts/search-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X, Clock, Star, Eye, Download, TrendingUp, History } from 'lucide-react'
import { ResponsiveContainer, ResponsiveText } from '@/components/ui/responsive'

export default function SearchPage() {
  const { 
    query, 
    setQuery, 
    results, 
    isLoading, 
    filters, 
    setFilters, 
    searchHistory, 
    trendingSearches, 
    search, 
    addToHistory,
    clearHistory 
  } = useSearch()
  
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState(query)

  useEffect(() => {
    setSearchInput(query)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      search(searchInput.trim())
    }
  }

  const handleQuickSearch = (searchTerm: string) => {
    setSearchInput(searchTerm)
    search(searchTerm)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'content':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'marketplace':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'platform':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <ResponsiveContainer>
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Search className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Search</h1>
              <p className="text-muted-foreground">Find content, users, and marketplace items</p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for anything..."
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                disabled={!searchInput.trim()}
              >
                Search
              </Button>
            </div>
          </form>

          {/* Filter Toggle */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {filters.type !== 'all' || filters.dateRange !== 'all' || filters.sortBy !== 'relevance' ? (
                <span className="w-2 h-2 bg-primary rounded-full"></span>
              ) : null}
            </Button>
            
            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2">
              {filters.type !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.type}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilters({ type: 'all' })}
                  />
                </Badge>
              )}
              {filters.dateRange !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.dateRange}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilters({ dateRange: 'all' })}
                  />
                </Badge>
              )}
              {filters.sortBy !== 'relevance' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Sort: {filters.sortBy}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilters({ sortBy: 'relevance' })}
                  />
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Search Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Types</option>
                    <option value="content">Content</option>
                    <option value="user">Users</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="platform">Platforms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters({ dateRange: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ sortBy: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Search Suggestions */}
        {!query && !isLoading && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Recent Searches */}
            {searchHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Recent Searches
                  </CardTitle>
                  <div className="flex justify-between items-center">
                    <CardDescription>Your recent search activity</CardDescription>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="text-red-500 hover:text-red-700"
                    >
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((term, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickSearch(term)}
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        {term}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trending Searches */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Searches
                </CardTitle>
                <CardDescription>Popular searches right now</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSearch(term)}
                      className="flex items-center gap-1"
                    >
                      <TrendingUp className="h-3 w-3" />
                      {term}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Results */}
        <div className="bg-white rounded-lg border">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : query ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <ResponsiveText variant="heading" className="mb-1">
                    Search Results
                  </ResponsiveText>
                  <ResponsiveText variant="body" className="text-muted-foreground">
                    Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                  </ResponsiveText>
                </div>
              </div>

              {results.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <ResponsiveText variant="heading" className="text-muted-foreground mb-2">
                    No Results Found
                  </ResponsiveText>
                  <ResponsiveText variant="body" className="text-muted-foreground">
                    Try adjusting your search terms or filters
                  </ResponsiveText>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((result) => (
                    <Card 
                      key={result.id} 
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => window.location.href = result.url}
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {result.thumbnail && (
                            <div className="flex-shrink-0">
                              <img
                                src={result.thumbnail}
                                alt={result.title}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">{result.title}</h3>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getTypeColor(result.type)}`}
                                  >
                                    {result.type}
                                  </Badge>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                  {result.description}
                                </p>
                                
                                {result.tags && result.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {result.tags.slice(0, 4).map((tag, index) => (
                                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                        {tag}
                                      </span>
                                    ))}
                                    {result.tags.length > 4 && (
                                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                        +{result.tags.length - 4}
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <ResponsiveText variant="heading" className="text-muted-foreground mb-2">
                Start Searching
              </ResponsiveText>
              <ResponsiveText variant="body" className="text-muted-foreground">
                Enter a search term above to find content, users, and more
              </ResponsiveText>
            </div>
          )}
        </div>
      </div>
    </ResponsiveContainer>
  )
}