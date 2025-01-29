import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { ExecutionLog } from '@/types/task';

interface TaskHistoryProps {
  logs: ExecutionLog[];
}

export function TaskHistory({ logs }: TaskHistoryProps) {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No execution history available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log, index) => (
        <motion.div
          key={log.executed_at}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-lg p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {log.result === 'SUCCESS' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <div>
                <p className="font-medium">{log.result}</p>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>
                    {formatDistanceToNow(new Date(log.executed_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-sm text-gray-400">
              Duration: {log.duration}ms
            </span>
          </div>
          
          {log.output && (
            <div className="mt-4 p-3 bg-black/20 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                {log.output}
              </pre>
            </div>
          )}
          
          {log.error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <pre className="text-sm text-red-400 overflow-x-auto">
                {log.error}
              </pre>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}