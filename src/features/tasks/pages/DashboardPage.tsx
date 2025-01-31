import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Calendar, 
  CheckCircle, 
  Clock, 
  PlayCircle, 
  Plus, 
  RefreshCcw, 
  XCircle 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/notiflix';
import { format } from 'date-fns';
import type { Task } from '@/types/task';
import { TaskForm } from '../components';

export function DashboardPage() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showTaskForm, setShowTaskForm] = React.useState(false);
  const [stats, setStats] = React.useState({
    total: 0,
    active: 0,
    completed: 0,
    failed: 0
  });

  const fetchTasks = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTasks(data);
      setStats({
        total: data.length,
        active: data.filter(t => t.state === 'ACTIVE').length,
        completed: data.filter(t => t.last_execution_result?.toLowerCase().includes('success')).length,
        failed: data.filter(t => t.last_execution_result?.toLowerCase().includes('fail')).length
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const recentTasks = tasks.slice(0, 5);
  const upcomingTasks = tasks
    .filter(t => t.state === 'ACTIVE')
    .slice(0, 5);

  return (
    <div className="relative min-h-screen space-y-6 lg:space-y-8">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8 mb-6 lg:mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="mt-2 text-sm lg:text-base text-gray-400">Monitor and manage your scheduled tasks</p>
          </div>

          <button
            onClick={() => setShowTaskForm(true)}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-purple-500 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </button>
        </div>

        {showTaskForm ? (
          <TaskForm onSuccess={() => {
            setShowTaskForm(false);
            fetchTasks();
          }} />
        ) : (
          <div className="space-y-6 lg:space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <StatCard
                icon={<Calendar className="w-6 lg:w-8 h-6 lg:h-8" />}
                value={stats.total}
                label="Total Tasks"
                color="blue"
                delay={0}
              />
              <StatCard
                icon={<Activity className="w-6 lg:w-8 h-6 lg:h-8" />}
                value={stats.active}
                label="Active Tasks"
                color="green"
                delay={0.1}
              />
              <StatCard
                icon={<CheckCircle className="w-6 lg:w-8 h-6 lg:h-8" />}
                value={stats.completed}
                label="Completed Tasks"
                color="purple"
                delay={0.2}
              />
              <StatCard
                icon={<XCircle className="w-6 lg:w-8 h-6 lg:h-8" />}
                value={stats.failed}
                label="Failed Tasks"
                color="red"
                delay={0.3}
              />
            </div>

            {/* Recent Activity & Upcoming Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <RecentActivity tasks={recentTasks} onRefresh={fetchTasks} />
              {/* Upcoming Tasks */}
              <UpcomingTasks tasks={upcomingTasks} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: 'blue' | 'green' | 'purple' | 'red';
  delay: number;
}

function StatCard({ icon, value, label, color, delay }: StatCardProps) {
  const colors = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
    green: 'from-green-500/20 to-green-600/5 border-green-500/20 text-green-400',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400',
    red: 'from-red-500/20 to-red-600/5 border-red-500/20 text-red-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden backdrop-blur-xl rounded-lg lg:rounded-xl border p-4 lg:p-6 ${colors[color]}`}
    >
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br opacity-20" />
      <div className="absolute -right-8 -top-8 w-24 lg:w-32 h-24 lg:h-32 bg-gradient-to-br rounded-full blur-3xl opacity-20" />
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="p-2 lg:p-3 bg-white/5 rounded-lg lg:rounded-xl">{icon}</div>
          <span className="text-2xl lg:text-3xl font-bold">{value}</span>
        </div>
        <p className="mt-2 text-xs lg:text-sm text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
}

function RecentActivity({ tasks, onRefresh }: { tasks: Task[], onRefresh: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg lg:rounded-xl h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-lg lg:text-xl font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Activity
          </h2>
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 lg:space-y-4">
          {tasks.map(task => (
            <motion.div
              key={task.uuid}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden p-3 lg:p-4 backdrop-blur-sm bg-black/20 rounded-lg border border-white/5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm lg:text-base font-medium">{task.task_name}</h3>
                  <p className="text-xs lg:text-sm text-gray-400">
                    {task.last_execution_date 
                      ? format(new Date(task.last_execution_date), 'PPp')
                      : 'Never executed'}
                  </p>
                </div>
                <div className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${
                  task.last_execution_result?.toLowerCase().includes('success')
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {task.last_execution_result || 'Pending'}
                </div>
              </div>
            </motion.div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm lg:text-base">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function UpcomingTasks({ tasks }: { tasks: Task[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg lg:rounded-xl h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-lg lg:text-xl font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-primary" />
            Upcoming Tasks
          </h2>
        </div>

        <div className="space-y-3 lg:space-y-4">
          {tasks.map(task => (
            <motion.div
              key={task.uuid}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden p-3 lg:p-4 backdrop-blur-sm bg-black/20 rounded-lg border border-white/5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm lg:text-base font-medium">{task.task_name}</h3>
                  <p className="text-xs lg:text-sm text-gray-400">
                    {task.cron_expression}
                  </p>
                </div>
                <div className="px-2 lg:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  Active
                </div>
              </div>
            </motion.div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm lg:text-base">
              No upcoming tasks
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}