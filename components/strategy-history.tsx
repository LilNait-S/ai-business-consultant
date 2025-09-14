import React, { useState, useEffect } from 'react'
import { getUserStrategies, searchStrategies, deleteStrategy } from '../services/supabase-service'
import type { SavedStrategy } from '../types'

interface StrategyHistoryProps {
  onSelectStrategy: (strategy: SavedStrategy) => void
  onNewStrategy: () => void
}

export function StrategyHistory({ onSelectStrategy, onNewStrategy }: StrategyHistoryProps) {
  const [strategies, setStrategies] = useState<SavedStrategy[]>([])
  const [filteredStrategies, setFilteredStrategies] = useState<SavedStrategy[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStrategies()
  }, [])

  useEffect(() => {
    filterStrategies()
  }, [searchQuery, strategies])

  const loadStrategies = async () => {
    try {
      setIsLoading(true)
      const data = await getUserStrategies()
      setStrategies(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load strategies')
    } finally {
      setIsLoading(false)
    }
  }

  const filterStrategies = async () => {
    if (!searchQuery.trim()) {
      setFilteredStrategies(strategies)
      return
    }

    try {
      const results = await searchStrategies(searchQuery)
      setFilteredStrategies(results)
    } catch (err) {
      // Fallback to local filtering if search fails
      const filtered = strategies.filter(strategy =>
        strategy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        strategy.discovery_data.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        strategy.discovery_data.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredStrategies(filtered)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      await deleteStrategy(id)
      await loadStrategies()
    } catch (err: any) {
      alert(err.message || 'Failed to delete strategy')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your strategies...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadStrategies}
          className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Strategies</h2>
        <button
          onClick={onNewStrategy}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          + New Strategy
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search strategies by title, company, or industry..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {filteredStrategies.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchQuery ? 'No strategies found' : 'No strategies yet'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? 'Try adjusting your search terms.'
              : 'Get started by creating your first strategic plan.'}
          </p>
          {!searchQuery && (
            <button
              onClick={onNewStrategy}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Create Your First Strategy
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStrategies.map((strategy) => (
            <div
              key={strategy.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {strategy.title}
                </h3>
                <button
                  onClick={() => handleDelete(strategy.id, strategy.title)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete strategy"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {strategy.discovery_data.companyName && (
                  <p><strong>Company:</strong> {strategy.discovery_data.companyName}</p>
                )}
                {strategy.discovery_data.industry && (
                  <p><strong>Industry:</strong> {strategy.discovery_data.industry}</p>
                )}
                <p><strong>Timeline:</strong> {strategy.discovery_data.timeline}</p>
                <p><strong>Created:</strong> {formatDate(strategy.created_at)}</p>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                <span>
                  {strategy.strategic_plan.strategy.quickWins.length + 
                   strategy.strategic_plan.strategy.strategicInitiatives.length + 
                   strategy.strategic_plan.strategy.transformationalBets.length} initiatives
                </span>
                {strategy.updated_at !== strategy.created_at && (
                  <span>Updated {formatDate(strategy.updated_at)}</span>
                )}
              </div>

              <button
                onClick={() => onSelectStrategy(strategy)}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-md transition-colors"
              >
                View Strategy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}