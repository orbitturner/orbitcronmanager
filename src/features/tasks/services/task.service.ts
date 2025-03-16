import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/notiflix'
import { handleSupabaseError, logError } from '@/lib/errors'
import { logActivity } from '@/lib/activity'
import { activityService } from '@/features/team/services/activity.service'
import type { Task } from '@/types/task'

export const taskService = {
  async executeTask(task: Task): Promise<void> {
    try {
      const startTime = new Date()
      
      // Log task execution start in both user and team activities
      await Promise.all([
        logActivity('task_executed', {
          task_name: task.task_name,
          task_id: task.uuid,
          organization_id: task.organization_id
        }, {
          type: 'task',
          category: 'execute',
          status: 'pending',
          resource_type: 'task',
          resource_id: task.uuid
        }),
        activityService.createActivity(task.organization_id, 'task_executed', {
          task_name: task.task_name,
          task_id: task.uuid,
          status: 'pending'
        })
      ])
      
      // Execute task
      let result: 'SUCCESS' | 'FAILURE' = 'SUCCESS'
      let output = ''
      let error = ''

      try {
        if (task.is_command && task.command) {
          const { data, error: execError } = await supabase.functions.invoke('execute-task', {
            body: { task }
          })

          if (execError) throw execError
          
          if (!data.success) {
            result = 'FAILURE'
            error = data.error || 'Task execution failed'
          } else {
            output = data.output
          }
        } else if (task.is_request && task.endpoint) {
          const { data, error: reqError } = await supabase.functions.invoke('execute-request', {
            body: { task }
          })

          if (reqError) throw reqError
          
          if (!data.success) {
            result = 'FAILURE'
            error = data.error || `Request failed with status ${data.status}`
          } else {
            output = data.response
          }
        } else {
          throw new Error('Invalid task configuration')
        }
      } catch (err) {
        result = 'FAILURE'
        error = err instanceof Error ? err.message : 'Unknown error occurred'
        logError(err, 'taskService.executeTask')
      }

      // Create execution log
      const executionLog = {
        executed_at: startTime.toISOString(),
        result,
        output,
        error,
        duration: Date.now() - startTime.getTime()
      }

      // Update task with execution log
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          last_execution_date: startTime.toISOString(),
          last_execution_result: result,
          execution_logs: task.execution_logs 
            ? [...task.execution_logs, executionLog]
            : [executionLog],
          state: result === 'SUCCESS' ? 'ACTIVE' : 'ERROR'
        })
        .eq('uuid', task.uuid)

      if (updateError) throw updateError

      // Log task execution completion in both user and team activities
      await Promise.all([
        logActivity('task_executed', {
          task_name: task.task_name,
          task_id: task.uuid,
          result,
          duration: executionLog.duration,
          error: error || undefined,
          organization_id: task.organization_id
        }, {
          type: 'task',
          category: 'execute',
          status: result === 'SUCCESS' ? 'success' : 'failure',
          resource_type: 'task',
          resource_id: task.uuid
        }),
        activityService.createActivity(task.organization_id, 'task_executed', {
          task_name: task.task_name,
          task_id: task.uuid,
          result,
          duration: executionLog.duration,
          error: error || undefined
        })
      ])

      // Handle notifications
      if (
        (result === 'SUCCESS' && task.notification_settings?.on_success) ||
        (result === 'FAILURE' && task.notification_settings?.on_failure)
      ) {
        if (task.mail_recipients?.to) {
          await this.sendNotification(task, executionLog)
        }
      }

      toast.success(result === 'SUCCESS' ? 'Task executed successfully' : 'Task execution failed')
    } catch (error) {
      logError(error, 'taskService.executeTask')
      const appError = error instanceof Error ? error : handleSupabaseError(error)
      throw appError
    }
  },

  async createTask(taskData: Partial<Task>): Promise<Task> {
    try {
      // Get user's organization
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { data: member, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()

      if (memberError) throw memberError

      // Add organization_id and created_by to task data
      const fullTaskData = {
        ...taskData,
        organization_id: member.organization_id,
        created_by: user.id,
        state: 'ACTIVE'
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([fullTaskData])
        .select()
        .single()

      if (error) throw error

      // Log task creation in both user and team activities
      await Promise.all([
        logActivity('task_created', {
          task_name: data.task_name,
          task_id: data.uuid,
          schedule: data.cron_expression,
          type: data.is_command ? 'command' : 'request',
          organization_id: data.organization_id
        }, {
          type: 'task',
          category: 'create',
          status: 'success',
          resource_type: 'task',
          resource_id: data.uuid
        }),
        activityService.createActivity(data.organization_id, 'task_created', {
          task_name: data.task_name,
          task_id: data.uuid,
          schedule: data.cron_expression,
          type: data.is_command ? 'command' : 'request'
        })
      ])

      return data
    } catch (error) {
      logError(error, 'taskService.createTask')
      throw handleSupabaseError(error)
    }
  },

  async updateTask(taskId: string, taskData: Partial<Task>): Promise<Task> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('uuid', taskId)
        .select()
        .single()

      if (error) throw error

      // Log task update in both user and team activities
      await Promise.all([
        logActivity('task_updated', {
          task_name: data.task_name,
          task_id: data.uuid,
          updated_fields: Object.keys(taskData),
          organization_id: data.organization_id
        }, {
          type: 'task',
          category: 'update',
          status: 'success',
          resource_type: 'task',
          resource_id: data.uuid
        }),
        activityService.createActivity(data.organization_id, 'task_updated', {
          task_name: data.task_name,
          task_id: data.uuid,
          updated_fields: Object.keys(taskData)
        })
      ])

      return data
    } catch (error) {
      logError(error, 'taskService.updateTask')
      throw handleSupabaseError(error)
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    try {
      // Get task info before deletion
      const { data: task, error: getError } = await supabase
        .from('tasks')
        .select('task_name, uuid, organization_id')
        .eq('uuid', taskId)
        .single()

      if (getError) throw getError

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('uuid', taskId)

      if (error) throw error

      // Log task deletion in both user and team activities
      await Promise.all([
        logActivity('task_deleted', {
          task_name: task.task_name,
          task_id: task.uuid,
          organization_id: task.organization_id
        }, {
          type: 'task',
          category: 'delete',
          status: 'success',
          resource_type: 'task',
          resource_id: task.uuid
        }),
        activityService.createActivity(task.organization_id, 'task_deleted', {
          task_name: task.task_name,
          task_id: task.uuid
        })
      ])
    } catch (error) {
      logError(error, 'taskService.deleteTask')
      throw handleSupabaseError(error)
    }
  },

  async sendNotification(task: Task, log: any): Promise<void> {
    try {
      // Log notification attempt
      await logActivity('notification_sent', {
        task_name: task.task_name,
        task_id: task.uuid,
        recipients: task.mail_recipients,
        execution_result: log.result,
        organization_id: task.organization_id
      }, {
        type: 'task',
        category: 'execute',
        status: 'pending',
        resource_type: 'notification',
        resource_id: task.uuid
      })

      // Send notification
      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          task,
          log,
          recipients: task.mail_recipients,
          settings: task.notification_settings
        }
      })

      if (error) throw error

      // Log successful notification
      await logActivity('notification_sent', {
        task_name: task.task_name,
        task_id: task.uuid,
        recipients: task.mail_recipients,
        execution_result: log.result,
        organization_id: task.organization_id
      }, {
        type: 'task',
        category: 'execute',
        status: 'success',
        resource_type: 'notification',
        resource_id: task.uuid
      })
    } catch (error) {
      // Log failed notification
      await logActivity('notification_sent', {
        task_name: task.task_name,
        task_id: task.uuid,
        recipients: task.mail_recipients,
        execution_result: log.result,
        error: error.message,
        organization_id: task.organization_id
      }, {
        type: 'task',
        category: 'execute',
        status: 'failure',
        resource_type: 'notification',
        resource_id: task.uuid
      })

      logError(error, 'taskService.sendNotification')
      throw handleSupabaseError(error)
    }
  }
}