import React from 'react';
import { motion } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import type { Task } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onNewTask?: () => void;
  onTasksChange: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function TaskList({ tasks, isLoading, onNewTask, onTasksChange }: TaskListProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (tasks.length === 0 && onNewTask) {
    return <EmptyState onNewTask={onNewTask} />;
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2"
    >
      {tasks.map((task) => (
        <TaskCard 
          key={task.uuid} 
          task={task} 
          onTasksChange={onTasksChange}
        />
      ))}
    </motion.div>
  );
}