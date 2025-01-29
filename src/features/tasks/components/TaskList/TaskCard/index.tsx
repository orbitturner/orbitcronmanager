import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarClock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/lib/notiflix';
import { taskService } from '../../../services/task.service';
import { TaskEditModal } from '../../TaskEditModal';
import { StatusBadge } from './StatusBadge';
import { TaskStatus } from './TaskStatus';
import { TaskActions } from './TaskActions';
import { LastRun } from './LastRun';
import type { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onTasksChange: () => void;
}

export function TaskCard({ task, onTasksChange }: TaskCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isRunning, setIsRunning] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [isTogglingState, setIsTogglingState] = React.useState(false);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('uuid', task.uuid);

      if (error) throw error;

      toast.success('Task deleted successfully');
      onTasksChange();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleRun = async () => {
    try {
      setIsRunning(true);
      await taskService.executeTask(task);
      onTasksChange();
    } catch (error) {
      console.error('Error running task:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const toggleTaskState = async () => {
    try {
      setIsTogglingState(true);
      const newState = task.state === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      
      const { error } = await supabase
        .from('tasks')
        .update({ state: newState })
        .eq('uuid', task.uuid);

      if (error) throw error;

      toast.success(`Task ${newState.toLowerCase()}`);
      onTasksChange();
    } catch (error) {
      console.error('Error toggling task state:', error);
      toast.error('Failed to update task state');
    } finally {
      setIsTogglingState(false);
    }
  };

  return (
    <>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 overflow-hidden group"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarClock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{task.task_name}</h3>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <span>{task.cron_expression}</span>
                </div>
              </div>
            </div>
            
            <StatusBadge
              state={task.state}
              onToggle={toggleTaskState}
              isTogglingState={isTogglingState}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <LastRun lastExecutionDate={task.last_execution_date} />
            <TaskStatus lastExecutionResult={task.last_execution_result} />
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <TaskActions
                  onDelete={handleDelete}
                  onEdit={() => setShowEditModal(true)}
                  onRun={handleRun}
                  isRunning={isRunning}
                  isActive={task.state === 'ACTIVE'}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <TaskEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={task}
        onSuccess={() => {
          setShowEditModal(false);
          onTasksChange();
        }}
      />
    </>
  );
}