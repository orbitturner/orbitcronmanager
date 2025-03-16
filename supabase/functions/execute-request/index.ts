import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface Endpoint {
  url: string
  method: string
  headers?: Record<string, string>
  data?: any
  options?: {
    timeout?: number
    retry?: {
      enabled: boolean
      max_attempts?: number
      delay?: number
    }
  }
}

interface Task {
  uuid: string
  task_name: string
  endpoint: Endpoint
}

serve(async (req) => {
  try {
    const { task } = await req.json() as { task: Task }
    
    // Execute the HTTP request
    const controller = new AbortController()
    const timeout = task.endpoint.options?.timeout || 30000
    
    // Set timeout
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    try {
      const response = await fetch(task.endpoint.url, {
        method: task.endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          ...task.endpoint.headers
        },
        body: task.endpoint.data ? JSON.stringify(task.endpoint.data) : undefined,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      const responseData = await response.text()
      const success = response.ok
      
      return new Response(
        JSON.stringify({
          success,
          response: responseData,
          status: response.status,
          headers: Object.fromEntries(response.headers),
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { 'Content-Type': 'application/json' },
          status: 200
        }
      )
    } catch (fetchError) {
      clearTimeout(timeoutId)
      throw fetchError
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})