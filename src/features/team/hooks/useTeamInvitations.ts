import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/notiflix'
import { logError } from '@/lib/errors'
import { activityService } from '../services/activity.service'

interface TeamInvitation {
  id: string
  email: string
  message: string | null
  status: 'pending' | 'accepted' | 'expired'
  created_at: string
  expires_at: string
  invited_by: string
  organization_id: string
}

export function useTeamInvitations(organizationId: string) {
  const [invitations, setInvitations] = useState<TeamInvitation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchInvitations = useCallback(async () => {
    try {
      setError(null)

      const { data, error } = await supabase
        .from('team_invitations')
        .select(`
          id,
          email,
          message,
          status,
          created_at,
          expires_at,
          invited_by,
          organization_id
        `)
        .eq('organization_id', organizationId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error

      setInvitations(data)
    } catch (error) {
      logError(error, 'useTeamInvitations.fetchInvitations')
      setError(error instanceof Error ? error : new Error('Failed to fetch invitations'))
    } finally {
      setIsLoading(false)
    }
  }, [organizationId])

  useEffect(() => {
    fetchInvitations()
  }, [fetchInvitations])

  const cancelInvitation = async (invitationId: string) => {
    try {
      // Get invitation details before deletion
      const invitation = invitations.find(i => i.id === invitationId)
      if (!invitation) return

      const { error } = await supabase
        .from('team_invitations')
        .delete()
        .eq('id', invitationId)

      if (error) throw error

      // Log activity
      await activityService.createActivity(organizationId, 'member_invited', {
        action: 'cancelled',
        email: invitation.email
      })

      toast.success('Invitation cancelled')
      fetchInvitations()
    } catch (error) {
      logError(error, 'useTeamInvitations.cancelInvitation')
      toast.error('Failed to cancel invitation')
    }
  }

  const resendInvitation = async (invitationId: string) => {
    try {
      const invitation = invitations.find(i => i.id === invitationId)
      if (!invitation) return

      // Update expiration date
      const { error } = await supabase
        .from('team_invitations')
        .update({
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        })
        .eq('id', invitationId)

      if (error) throw error

      // Log activity
      await activityService.createActivity(organizationId, 'member_invited', {
        action: 'resent',
        email: invitation.email
      })

      toast.success('Invitation resent')
      fetchInvitations()
    } catch (error) {
      logError(error, 'useTeamInvitations.resendInvitation')
      toast.error('Failed to resend invitation')
    }
  }

  return {
    invitations,
    isLoading,
    error,
    cancelInvitation,
    resendInvitation,
    refresh: fetchInvitations
  }
}