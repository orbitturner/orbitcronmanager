import { supabase } from './supabase'
import { logError } from './errors'

// Activity types
export type ActivityType = 
  | 'auth'
  | 'data'
  | 'configuration'
  | 'security'
  | 'task'
  | 'api'
  | 'compliance'
  | 'system'

// Activity categories
export type ActivityCategory =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'execute'
  | 'login'
  | 'logout'
  | 'export'
  | 'import'
  | 'share'
  | 'configure'

// Activity status
export type ActivityStatus =
  | 'success'
  | 'failure'
  | 'pending'
  | 'cancelled'
  | 'error'

// Activity interface
export interface Activity {
  id: string
  action: string
  details?: any
  activity_type: ActivityType
  category: ActivityCategory
  status: ActivityStatus
  resource_type?: string
  resource_id?: string
  compliance_tags?: string[]
  created_at: string
  metadata?: any
}

// Activity options
export interface ActivityOptions {
  type?: ActivityType
  category?: ActivityCategory
  resource_type?: string
  resource_id?: string
  compliance_tags?: string[]
  metadata?: any
}

// Log user activity
export async function logActivity(
  action: string,
  details: any,
  options: ActivityOptions = {}
): Promise<void> {
  try {
    const {
      type = 'task',
      category = 'execute',
      resource_type,
      resource_id,
      compliance_tags,
      metadata
    } = options

    // Call the database function to log activity
    const { error } = await supabase.rpc('log_user_activity', {
      p_action: action,
      p_details: details,
      p_activity_type: type,
      p_category: category,
      p_resource_type: resource_type,
      p_resource_id: resource_id,
      p_compliance_tags: compliance_tags
    })

    if (error) throw error
  } catch (error) {
    logError(error, 'activity.logActivity')
    console.error('Failed to log activity:', error)
  }
}

// Get user activity history with filtering
export async function getActivityHistory(options: {
  types?: ActivityType[]
  categories?: ActivityCategory[]
  status?: ActivityStatus[]
  resource_type?: string
  compliance_tags?: string[]
  from_date?: Date
  to_date?: Date
  limit?: number
  offset?: number
} = {}): Promise<Activity[]> {
  try {
    let query = supabase
      .from('user_activities')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (options.types?.length) {
      query = query.in('activity_type', options.types)
    }

    if (options.categories?.length) {
      query = query.in('category', options.categories)
    }

    if (options.status?.length) {
      query = query.in('status', options.status)
    }

    if (options.resource_type) {
      query = query.eq('resource_type', options.resource_type)
    }

    if (options.compliance_tags?.length) {
      query = query.contains('compliance_tags', options.compliance_tags)
    }

    if (options.from_date) {
      query = query.gte('created_at', options.from_date.toISOString())
    }

    if (options.to_date) {
      query = query.lte('created_at', options.to_date.toISOString())
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    if (options.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      )
    }

    const { data, error } = await query

    if (error) throw error

    return data
  } catch (error) {
    logError(error, 'activity.getActivityHistory')
    throw error
  }
}

// Example usage:
// await logActivity('task_created', {
//   task_name: 'Daily Backup',
//   schedule: '0 0 * * *'
// }, {
//   type: 'task',
//   category: 'create',
//   resource_type: 'task',
//   resource_id: taskId,
//   compliance_tags: ['gdpr', 'audit']
// })