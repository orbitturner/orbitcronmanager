import { useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/notiflix';
import type { Task } from '@/types/task';

interface HistoryFilters {
  dateRange: [Date | null, Date | null];
  status: string[];
  search: string;
}

interface HistoryStats {
  totalExecutions: number;
  successRate: number;
  averageDuration: number;
  failureRate: number;
  mostFrequentErrors: { error: string; count: number }[];
}

export function useTaskHistory() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState<HistoryFilters>({
    dateRange: [null, null],
    status: [],
    search: '',
  });

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('last_execution_date', { ascending: false });

      if (error) throw error;

      // Sort execution logs by date in descending order
      const tasksWithSortedLogs = data.map(task => ({
        ...task,
        execution_logs: task.execution_logs?.sort((a, b) => 
          new Date(b.executed_at).getTime() - new Date(a.executed_at).getTime()
        )
      }));

      setTasks(tasksWithSortedLogs);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch task history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats: HistoryStats = useMemo(() => {
    const executions = tasks.flatMap(t => t.execution_logs || []);
    const successfulExecutions = executions.filter(
      log => log.result === 'SUCCESS'
    );

    return {
      totalExecutions: executions.length,
      successRate: (successfulExecutions.length / executions.length) * 100 || 0,
      averageDuration:
        executions.reduce((acc, log) => acc + (log.duration || 0), 0) /
          executions.length || 0,
      failureRate:
        ((executions.length - successfulExecutions.length) / executions.length) *
          100 || 0,
      mostFrequentErrors: getMostFrequentErrors(executions),
    };
  }, [tasks]);

  const timelineData = useMemo(() => {
    return tasks
      .filter(task => task.execution_logs?.length > 0)
      .map(task => ({
        id: task.uuid,
        name: task.task_name,
        executions: task.execution_logs || [],
        lastExecution: task.last_execution_date,
        status: task.state,
      }))
      .sort((a, b) => 
        new Date(b.lastExecution).getTime() - new Date(a.lastExecution).getTime()
      );
  }, [tasks]);

  const handleTaskSelect = useCallback((task: Task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  }, []);

  return {
    tasks,
    selectedTask,
    setSelectedTask,
    isLoading,
    filters,
    setFilters,
    stats,
    timelineData,
    showDetailsModal,
    setShowDetailsModal,
    handleTaskSelect,
  };
}

function getMostFrequentErrors(executions: any[]) {
  const errorCounts = executions
    .filter(log => log.error)
    .reduce((acc, log) => {
      const error = log.error;
      acc[error] = (acc[error] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return Object.entries(errorCounts)
    .map(([error, count]) => ({ error, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}