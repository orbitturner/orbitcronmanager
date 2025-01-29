import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

interface MailRecipients {
  to: string
  cc?: string
  bcc?: string
}

interface NotificationSettings {
  on_success: boolean
  on_failure: boolean
  include_output: boolean
}

interface ExecutionLog {
  executed_at: string
  result: string
  output?: string
  error?: string
  duration: number
}

interface Task {
  uuid: string
  task_name: string
}

serve(async (req) => {
  try {
    const { task, log, recipients, settings } = await req.json() as {
      task: Task
      log: ExecutionLog
      recipients: MailRecipients
      settings: NotificationSettings
    }
    
    // Créer le client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Envoyer l'email via Supabase
    const { error } = await supabaseClient.auth.admin.createUser({
      email: recipients.to,
      email_confirm: true,
      user_metadata: {
        task_name: task.task_name,
        execution_time: log.executed_at,
        result: log.result,
        output: settings.include_output ? log.output : undefined,
        error: log.error
      }
    })
    
    if (error) throw error
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})