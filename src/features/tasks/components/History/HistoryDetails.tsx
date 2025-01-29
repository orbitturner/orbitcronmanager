import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { X, Clock, CheckCircle, XCircle, Terminal } from 'lucide-react';
import type { Task } from '@/types/task';

interface HistoryDetailsProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryDetails({ task, isOpen, onClose }: HistoryDetailsProps) {
  if (!task) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-xl h-full"
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{task.task_name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Task Details</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Schedule</span>
              <span className="text-sm font-medium">{task.cron_expression}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Type</span>
              <span className="text-sm font-medium">
                {task.is_command ? 'Command' : 'HTTP Request'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Status</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                task.state === 'ACTIVE'
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-gray-500/10 text-gray-400'
              }`}>
                {task.state}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Execution Logs</h3>
          <div className="space-y-4">
            {task.execution_logs?.map((log, index) => (
              <div
                key={index}
                className="p-4 bg-black/20 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {log.result === 'SUCCESS' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-sm font-medium">{log.result}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{format(new Date(log.executed_at), 'PPp')}</span>
                  </div>
                </div>

                {log.output && (
                  <div className="mt-2 p-3 bg-black/40 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Terminal className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Output</span>
                    </div>
                    <pre className="text-xs overflow-x-auto">
                      {log.output}
                    </pre>
                  </div>
                )}

                {log.error && (
                  <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <pre className="text-xs text-red-400 overflow-x-auto">
                      {log.error}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}