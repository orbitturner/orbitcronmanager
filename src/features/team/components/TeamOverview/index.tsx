import React from 'react'
import { TeamStats } from '../TeamStats'
import { TeamActivity } from '../TeamActivity'
import { TeamInvitations } from '../TeamInvitations'
import { useTeamStats } from '../../hooks/useTeamStats'

interface TeamOverviewProps {
  organizationId: string
}

export function TeamOverview({ organizationId }: TeamOverviewProps) {
  const { stats, isLoading, error, fetchStats } = useTeamStats(organizationId)

  React.useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        <p className="mb-4">{error.message}</p>
        <button
          onClick={() => fetchStats()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Team Stats */}
      <TeamStats stats={stats} isLoading={isLoading} />
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Activity</h3>
          <TeamActivity 
            activities={stats.recentActivities} 
            isLoading={isLoading} 
          />
        </div>

        {/* Pending Invitations */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Pending Invitations</h3>
          <TeamInvitations organizationId={organizationId} />
        </div>
      </div>
    </div>
  )
}