import React, { useState, useEffect } from 'react'
import { getUserStats } from '../services/supabase-service'
import { useAuth } from '../contexts/auth-context'
import type { UserStats } from '../types'

interface UserProfileProps {
  onBackToHistory: () => void
}

export function UserProfile({ onBackToHistory }: UserProfileProps) {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const data = await getUserStats()
      setStats(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load statistics')
    } finally {
      setIsLoading(false)
    }
  }

  const formatJoinDate = (user: any) => {
    const date = user?.created_at || user?.user_metadata?.created_at
    if (!date) return 'Unknown'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Profile & Statistics</h2>
        <button
          onClick={onBackToHistory}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
        >
          ← Back to Strategies
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {user?.user_metadata?.full_name || 'User'}
            </h3>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500">
              Member since {formatJoinDate(user)}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {isLoading ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadStats}
            className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      ) : stats ? (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.totalStrategies}
              </div>
              <div className="text-sm text-gray-600">Total Strategies</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.strategiesThisMonth}
              </div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.topIndustries.length}
              </div>
              <div className="text-sm text-gray-600">Industries Explored</div>
            </div>
          </div>

          {/* Top Industries */}
          {stats.topIndustries.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Industries You've Worked With
              </h3>
              <div className="space-y-3">
                {stats.topIndustries.map(({ industry, count }, index) => (
                  <div key={industry} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{industry}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="bg-gray-200 rounded-full h-2 w-24">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(count / stats.totalStrategies) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievement Badges */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`text-center p-4 rounded-lg ${stats.totalStrategies >= 1 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} border`}>
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-sm font-medium">First Strategy</div>
                <div className="text-xs text-gray-600">Create your first plan</div>
              </div>
              
              <div className={`text-center p-4 rounded-lg ${stats.totalStrategies >= 5 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} border`}>
                <div className="text-2xl mb-2">📈</div>
                <div className="text-sm font-medium">Strategic Thinker</div>
                <div className="text-xs text-gray-600">5 strategies created</div>
              </div>
              
              <div className={`text-center p-4 rounded-lg ${stats.topIndustries.length >= 3 ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'} border`}>
                <div className="text-2xl mb-2">🌍</div>
                <div className="text-sm font-medium">Cross-Industry</div>
                <div className="text-xs text-gray-600">3+ industries explored</div>
              </div>
              
              <div className={`text-center p-4 rounded-lg ${stats.strategiesThisMonth >= 3 ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'} border`}>
                <div className="text-2xl mb-2">🔥</div>
                <div className="text-sm font-medium">On Fire</div>
                <div className="text-xs text-gray-600">3+ strategies this month</div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}