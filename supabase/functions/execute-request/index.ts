import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface Endpoint {
  url: string
  method: string
  headers?: Record<string, string>
  data?: any
}

interface Task {
  uuid: string
  task_name: string
  endpoint: Endpoint
}

serve(async (req) => {
  try {
    const { task } = await req.json() as { task: Task }
    
    // Exécuter la requête HTTP
    const response = await fetch(task.endpoint.url, {
      method: task.endpoint.method,
      headers: task.endpoint.headers,
      body: task.endpoint.data ? JSON.stringify(task.endpoint.data) : undefined
    })
    
    const responseData = await response.text()
    
    return new Response(
      JSON.stringify({
        success: response.ok,
        response: responseData,
        status: response.status,
        headers: Object.fromEntries(response.headers)
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