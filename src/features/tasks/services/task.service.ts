import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/notiflix'
import { handleSupabaseError, logError } from '@/lib/errors'
import type { Task, ExecutionLog } from '@/types/task'

export const taskService = {
  async executeTask(task: Task): Promise<void> {
    try {
      const startTime = new Date()
      
      // Simuler l'exécution de la tâche
      let result: 'SUCCESS' | 'FAILURE' = 'SUCCESS'
      let output = ''
      let error = ''

      try {
        if (task.is_command) {
          // Appeler l'Edge Function pour exécuter le script
          const { data, error: execError } = await supabase.functions.invoke('execute-task', {
            body: { task }
          })

          if (execError) throw execError
          
          output = data.output
          result = data.success ? 'SUCCESS' : 'FAILURE'
          if (!data.success) {
            error = data.error
          }
        } else {
          // Pour les requêtes HTTP, utiliser l'Edge Function dédiée
          const { data, error: reqError } = await supabase.functions.invoke('execute-request', {
            body: { task }
          })

          if (reqError) throw reqError
          
          output = data.response
          result = data.success ? 'SUCCESS' : 'FAILURE'
          if (!data.success) {
            error = data.error
          }
        }
      } catch (err) {
        result = 'FAILURE'
        error = err instanceof Error ? err.message : 'Unknown error occurred'
        logError(err, 'taskService.executeTask')
      }

      // Créer un log d'exécution
      const executionLog: ExecutionLog = {
        executed_at: startTime.toISOString(),
        result,
        output,
        error,
        duration: Date.now() - startTime.getTime()
      }

      // Mettre à jour la tâche avec le nouveau log
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          last_execution_date: startTime.toISOString(),
          last_execution_result: result,
          execution_logs: task.execution_logs 
            ? [...task.execution_logs, executionLog]
            : [executionLog]
        })
        .eq('uuid', task.uuid)

      if (updateError) throw updateError

      // Envoyer les notifications si configurées
      if (
        (result === 'SUCCESS' && task.notification_settings?.on_success) ||
        (result === 'FAILURE' && task.notification_settings?.on_failure)
      ) {
        if (task.mail_recipients?.to) {
          await this.sendNotification(task, executionLog)
        }
      }

      if (result === 'SUCCESS') {
        toast.success('Task executed successfully')
      } else {
        toast.error('Task execution failed')
      }
    } catch (error) {
      logError(error, 'taskService.executeTask')
      const appError = error instanceof Error ? error : handleSupabaseError(error)
      toast.error(appError.message)
      throw appError
    }
  },

  async sendNotification(task: Task, log: ExecutionLog): Promise<void> {
    try {
      // Utiliser l'Edge Function pour envoyer les notifications
      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          task,
          log,
          recipients: task.mail_recipients,
          settings: task.notification_settings
        }
      })

      if (error) throw error
    } catch (error) {
      logError(error, 'taskService.sendNotification')
      toast.error('Failed to send notification')
    }
  }
}