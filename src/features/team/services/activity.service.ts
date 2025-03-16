import { supabase } from '@/lib/supabase'
import { handleSupabaseError, logError } from '@/lib/errors'
import { logActivity } from '@/lib/activity'

export type ActivityAction = 
  | 'member_joined'
  | 'member_left'
  | 'member_invited'
  | 'role_updated'
  | 'task_created'
  | 'task_updated'
  | 'task_deleted'

export interface Activity {
  id: string
  organization_id: string
  user_id: string
  action: ActivityAction
  details?: any
  created_at: string
}

export const activityService = {
  async createActivity(
    organizationId: string, 
    action: ActivityAction, 
    details?: any
  ): Promise<void> {
    try {
      // Log to team_activities table
      const { error } = await supabase
        .from('team_activities')
        .insert([{
          organization_id: organizationId,
          action,
          details
        }])

      if (error) throw error

      // Also log to user_activities for personal history
      await logActivity(action, details, {
        type: 'team',
        category: this.getActivityCategory(action),
        status: 'success',
        resource_type: 'organization',
        resource_id: organizationId
      })
    } catch (error) {
      logError(error, 'activityService.createActivity')
      throw handleSupabaseError(error)
    }
  },

  async getActivities(
    organizationId: string,
    limit: number = 10
  ): Promise<Activity[]> {
    try {
      const { data, error } = await supabase
        .from('team_activities')
        .select(`
          id,
          organization_id,
          user_id,
          action,
          details,
          created_at,
          users:user_id (
            email
          )
        `)
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data
    } catch (error) {
      logError(error, 'activityService.getActivities')
      throw handleSupabaseError(error)
    }
  },

  async updateLastActive(): Promise<void> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { error } = await supabase
        .from('organization_members')
        .update({ last_active_at: new Date().toISOString() })
        .eq('user_id', user.id)

      if (error) throw error
    } catch (error) {
      logError(error, 'activityService.updateLastActive')
      // Don't throw here as this is a background operation
      console.error('Failed to update last active time:', error)
    }
  },

  getActivityCategory(action: ActivityAction): string {
    switch (action) {
      case 'member_joined':
      case 'member_left':
      case 'member_invited':
        return 'membership'
      case 'role_updated':
        return 'permission'
      case 'task_created':
        return 'create'
      case 'task_updated':
        return 'update'
      case 'task_deleted':
        return 'delete'
      default:
        return 'other'
    }
  }
}