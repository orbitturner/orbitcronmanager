import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskHeader } from './TaskHeader';
import { TaskConfiguration } from './TaskConfiguration';
import { TaskStats } from './TaskStats';
import { TaskLogs } from './TaskLogs';
import { TaskEndpoint } from './TaskEndpoint';
import { TaskCommand } from './TaskCommand';
import type { Task } from '@/types/task';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailsModal({ task, isOpen, onClose }: TaskDetailsModalProps) {
  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block w-full max-w-6xl my-8 text-left align-middle transition-all transform"
            >
              <div className="relative bg-background/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl">
                {/* Header */}
                <TaskHeader task={task} onClose={onClose} />

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Task Information */}
                    <div className="lg:col-span-1 space-y-6">
                      <TaskConfiguration task={task} />
                      <TaskStats task={task} />
                      {task.is_command ? (
                        <TaskCommand task={task} />
                      ) : (
                        <TaskEndpoint task={task} />
                      )}
                    </div>

                    {/* Right Column - Execution History */}
                    <div className="lg:col-span-2">
                      <TaskLogs logs={task.execution_logs || []} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}