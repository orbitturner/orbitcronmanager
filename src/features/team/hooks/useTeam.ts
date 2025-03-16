import { useState, useCallback, useEffect } from 'react'
import { toast } from '@/lib/notiflix'
import { logError } from '@/lib/errors'
import { teamService } from '../services/team.service'
import type { TeamMember } from '../types'

export function useTeam() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasTeam, setHasTeam] = useState<boolean | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const fetchTeamData = useCallback(async () => {
    try {
      setError(null)

      // First check if user has a team
      const hasTeam = await teamService.hasTeam()
      setHasTeam(hasTeam)

      if (hasTeam) {
        // Then fetch team members
        const members = await teamService.fetchTeamMembers()
        setMembers(members)
      }
    } catch (error) {
      logError(error, 'useTeam.fetchTeamData')
      setError(error instanceof Error ? error : new Error('Failed to fetch team data'))
      toast.error('Failed to load team data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeamData()
  }, [fetchTeamData])

  const createTeam = async (name: string) => {
    try {
      setIsLoading(true)
      setError(null)

      await teamService.createTeam(name)
      toast.success('Team created successfully')
      await fetchTeamData()
    } catch (error) {
      logError(error, 'useTeam.createTeam')
      const message = error instanceof Error ? error.message : 'Failed to create team'
      setError(new Error(message))
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const removeMember = async (memberId: string) => {
    try {
      setError(null)
      await teamService.removeMember(memberId)
      toast.success('Member removed successfully')
      await fetchTeamData()
    } catch (error) {
      logError(error, 'useTeam.removeMember')
      const message = error instanceof Error ? error.message : 'Failed to remove member'
      setError(new Error(message))
      toast.error(message)
      throw error
    }
  }

  const updateMemberRole = async (memberId: string, role: 'admin' | 'member') => {
    try {
      setError(null)
      await teamService.updateMemberRole(memberId, role)
      toast.success('Role updated successfully')
      await fetchTeamData()
    } catch (error) {
      logError(error, 'useTeam.updateMemberRole')
      const message = error instanceof Error ? error.message : 'Failed to update role'
      setError(new Error(message))
      toast.error(message)
      throw error
    }
  }

  return {
    members,
    isLoading,
    hasTeam,
    error,
    fetchTeamData,
    createTeam,
    removeMember,
    updateMemberRole
  }
}