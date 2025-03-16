import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    
    // Execute the script based on type
    let output = ''
    let success = true
    let error = null

    try {
      if (task.command.type === 'bash') {
        const command = new Deno.Command('bash', {
          args: ['-c', task.command.script],
          stdout: 'piped',
          stderr: 'piped'
        })
        
        const { stdout, stderr } = await command.output()
        const decoder = new TextDecoder()
        
        output = decoder.decode(stdout)
        if (stderr.length > 0) {
          error = decoder.decode(stderr)
          success = false
        }
      } else if (task.command.type === 'pwsh') {
        // For PowerShell, we'll simulate for now since it's not available in Edge
        output = `[Simulated PowerShell Execution]\n${task.command.script}\n[Execution completed]`
      }
    } catch (execError) {
      success = false
      error = execError.message
    }
    
    return new Response(
      JSON.stringify({
        success,
        output,
        error,
        timestamp: new Date().toISOString()
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