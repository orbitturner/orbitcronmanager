import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

interface Command {
  script: string
  type: 'bash' | 'pwsh'
  options?: {
    timeout_enabled?: boolean
    elevated_privileges?: boolean
    save_output?: boolean
    timeout?: number
  }
}

interface Task {
  uuid: string
  task_name: string
  command: Command
}

serve(async (req) => {
  try {
    const { task } = await req.json() as { task: Task }
    
    // Simuler l'exécution du script
    const output = `Executing ${task.task_name}...\n` +
      `Command type: ${task.command.type}\n` +
      `Script content:\n${task.command.script}\n` +
      `Execution completed successfully at ${new Date().toISOString()}`
    
    return new Response(
      JSON.stringify({
        success: true,
        output
      }),
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