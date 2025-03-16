import { useState, useCallback } from 'react'
import { teamService } from '../services/team.service'
import { activityService } from '../services/activity.service'
import type { Activity } from '../services/activity.service'

interface TeamStats {
  totalMembers: number
  activeMembers: number
  totalTasks: number
  recentActivities: Activity[]
}

export function useTeamStats(organizationId: string | null) {
  const [stats, setStats] = useState<TeamStats>({
    totalMembers: 0,
    activeMembers: 0,
    totalTasks: 0,
    recentActivities: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = useCallback(async () => {
    if (!organizationId) return

    try {
      setIsLoading(true)
      setError(null)

      const [stats, activities] = await Promise.all([
        teamService.getTeamStats(organizationId),
        activityService.getActivities(organizationId, 5)
      ])

      setStats({
        totalMembers: stats.total_members,
        activeMembers: stats.active_members,
        totalTasks: stats.total_tasks,
        recentActivities: activities
      })
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to fetch team stats'))
    } finally {
      setIsLoading(false)
    }
  }, [organizationId])

  return {
    stats,
    isLoading,
    error,
    fetchStats
  }
}