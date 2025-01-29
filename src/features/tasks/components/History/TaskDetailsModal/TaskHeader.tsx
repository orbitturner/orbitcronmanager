import React from 'react';
import { X, Calendar, Clock, Tag, AlertTriangle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { Task } from '@/types/task';

interface TaskHeaderProps {
  task: Task;
  onClose: () => void;
}

export function TaskHeader({ task, onClose }: TaskHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-white/10">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5" />
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            {/* Task Name with Gradient */}
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {task.task_name}
              </h2>
              {task.description && (
                <p className="mt-2 text-gray-400">{task.description}</p>
              )}
            </div>

            {/* Task Metadata */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Created {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
                <span className="text-gray-600">({format(new Date(task.created_at), 'PPp')})</span>
              </div>

              {task.last_execution_date && (
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>Last run {formatDistanceToNow(new Date(task.last_execution_date), { addSuffix: true })}</span>
                  <span className="text-gray-600">({format(new Date(task.last_execution_date), 'PPp')})</span>
                </div>
              )}

              {task.state === 'ERROR' && (
                <div className="flex items-center space-x-2 text-sm text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Task is in error state</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-white/5 text-gray-400 rounded-full border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="absolute top-6 right-16">
          <div className={`
            px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm
            ${task.state === 'ACTIVE' 
              ? 'bg-green-500/10 text-green-400 border-green-500/20' 
              : task.state === 'ERROR'
                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
            }
          `}>
            {task.state}
          </div>
        </div>
      </div>
    </div>
  );
}