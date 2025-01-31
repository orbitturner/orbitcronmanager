import React from 'react'
import { Plus, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/notiflix'
import type { Task } from '@/types/task'
import { TaskList, TaskForm } from '../components'
import { EmptyState } from '../components/EmptyState'

export function TasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [showTaskForm, setShowTaskForm] = React.useState(false)

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
    <div className="relative min-h-screen space-y-6 lg:space-y-8">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative">
        {/* Header - Now always visible */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Tasks
            </h1>
            <p className="mt-2 text-sm lg:text-base text-gray-400">Manage and schedule your automated tasks</p>
          </div>

          {!showTaskForm && tasks.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-[1]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-2.5 bg-card/50 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                onClick={() => setShowTaskForm(true)}
                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-purple-500 text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity shrink-0"
              >
                <Plus className="w-5 h-5" />
                <span>New Task</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {showTaskForm ? (
          <TaskForm onSuccess={() => {
            setShowTaskForm(false)
            fetchTasks()
          }} />
        ) : !isLoading && tasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description="Create your first task to get started with automated scheduling"
            onAction={() => setShowTaskForm(true)}
          />
        ) : (
          <TaskList 
            tasks={filteredTasks}
            isLoading={isLoading}
            onTasksChange={fetchTasks}
          />
        )}
      </div>
    </div>
  )
}