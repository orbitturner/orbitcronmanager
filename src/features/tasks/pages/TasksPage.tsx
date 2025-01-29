import React from 'react'
import { Plus, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/notiflix'
import type { Task } from '@/types/task'
import { TaskList } from '../components'

export function TasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')

  const fetchTasks = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to fetch tasks')
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const filteredTasks = React.useMemo(() => {
    if (!searchQuery) return tasks
    const query = searchQuery.toLowerCase()
    return tasks.filter(task => 
      task.task_name.toLowerCase().includes(query) ||
      task.cron_expression.toLowerCase().includes(query)
    )
  }, [tasks, searchQuery])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Tasks
        </h1>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-64"
            />
          </div>
        </div>
      </div>

      <TaskList 
        tasks={filteredTasks}
        isLoading={isLoading}
        onTasksChange={fetchTasks}
      />
    </div>
  )
}