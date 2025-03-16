import { supabase } from '@/lib/supabase'
import { handleSupabaseError, logError } from '@/lib/errors'
import { activityService } from './activity.service'
import type { TeamMember, Organization } from '../types'

export const teamService = {
  async fetchTeamMembers(): Promise<TeamMember[]> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      // Get user's organization
      const { data: member, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()

      if (memberError) {
        if (memberError.code === 'PGRST116') {
          return [] // No organization found
        }
        throw memberError
      }

      // Fetch all members of this organization
      const { data: members, error: membersError } = await supabase
        .from('organization_members')
        .select(`
          id,
          user_id,
          role,
          created_at,
          last_active_at,
          users:user_id (
            email
          ),
          organizations!inner (
            id,
            name
          )
        `)
        .eq('organization_id', member.organization_id)

      if (membersError) throw membersError

      // Update last active time
      await activityService.updateLastActive()

      return members.map(m => ({
        id: m.user_id,
        email: m.users.email,
        role: m.role,
        created_at: m.created_at,
        last_active_at: m.last_active_at,
        organization_id: m.organizations.id,
        organization_name: m.organizations.name
      }))
    } catch (error) {
      logError(error, 'teamService.fetchTeamMembers')
      throw handleSupabaseError(error)
    }
  },

  async hasTeam(): Promise<boolean> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { data, error } = await supabase
        .from('organization_members')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error
      
      return !!data
    } catch (error) {
      logError(error, 'teamService.hasTeam')
      throw handleSupabaseError(error)
    }
  },

  async createTeam(name: string): Promise<Organization> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert([{ name }])
        .select()
        .single()

      if (orgError) throw orgError

      // Add user as owner
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert([{
          organization_id: org.id,
          user_id: user.id,
          role: 'owner'
        }])

      if (memberError) throw memberError

      // Log activity
      await activityService.createActivity(org.id, 'member_joined', {
        member_email: user.email,
        role: 'owner'
      })

      return org
    } catch (error) {
      logError(error, 'teamService.createTeam')
      throw handleSupabaseError(error)
    }
  },

  async removeMember(memberId: string): Promise<void> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      // Get organization info before removing member
      const { data: member, error: memberError } = await supabase
        .from('organization_members')
        .select(`
          organization_id,
          users:user_id (
            email
          )
        `)
        .eq('user_id', memberId)
        .single()

      if (memberError) throw memberError

      // Remove member
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('user_id', memberId)

      if (error) throw error

      // Log activity
      await activityService.createActivity(member.organization_id, 'member_left', {
        member_email: member.users.email,
        removed_by: user.email
      })
    } catch (error) {
      logError(error, 'teamService.removeMember')
      throw handleSupabaseError(error)
    }
  },

  async updateMemberRole(memberId: string, role: 'admin' | 'member'): Promise<void> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      // Get organization info
      const { data: member, error: memberError } = await supabase
        .from('organization_members')
        .select(`
          organization_id,
          users:user_id (
            email
          )
        `)
        .eq('user_id', memberId)
        .single()

      if (memberError) throw memberError

      // Update role
      const { error } = await supabase
        .from('organization_members')
        .update({ role })
        .eq('user_id', memberId)

      if (error) throw error

      // Log activity
      await activityService.createActivity(member.organization_id, 'role_updated', {
        member_email: member.users.email,
        new_role: role,
        updated_by: user.email
      })
    } catch (error) {
      logError(error, 'teamService.updateMemberRole')
      throw handleSupabaseError(error)
    }
  },

  async getTeamStats(organizationId: string): Promise<{
    total_members: number;
    active_members: number;
    total_tasks: number;
  }> {
    try {
      // Get member count
      const { count: totalMembers, error: membersError } = await supabase
        .from('organization_members')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)

      if (membersError) throw membersError

      // Get active members (active in last 24 hours)
      const { count: activeMembers, error: activeError } = await supabase
        .from('organization_members')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .gte('last_active_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

      if (activeError) throw activeError

      // Get task count
      const { count: totalTasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', organizationId)

      if (tasksError) throw tasksError

      return {
        total_members: totalMembers || 0,
        active_members: activeMembers || 0,
        total_tasks: totalTasks || 0
      }
    } catch (error) {
      logError(error, 'teamService.getTeamStats')
      throw handleSupabaseError(error)
    }
  }
}