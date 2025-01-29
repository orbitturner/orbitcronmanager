import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Terminal, Clock, AlertTriangle } from 'lucide-react';
import type { ExecutionLog } from '@/types/task';

interface TaskLogsProps {
  logs: ExecutionLog[];
}

export function TaskLogs({ logs }: TaskLogsProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Execution History</h3>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {logs.map((log, index) => (
          <LogEntry key={index} log={log} />
        ))}
      </div>
    </div>
  );
}

interface LogEntryProps {
  log: ExecutionLog;
}

function LogEntry({ log }: LogEntryProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
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
        <div className="flex items-center space-x-4">
          {log.duration && (
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <AlertTriangle className="w-4 h-4" />
              <span>{log.duration}ms</span>
            </div>
          )}
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{format(new Date(log.executed_at), 'PPp')}</span>
          </div>
        </div>
      </div>

      {(log.output || log.error) && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left"
        >
          <motion.div
            animate={{ height: expanded ? 'auto' : 0 }}
            className="overflow-hidden"
          >
            {log.output && (
              <div className="mt-2 p-3 bg-black/40 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Terminal className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Output</span>
                </div>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                  {log.output}
                </pre>
              </div>
            )}

            {log.error && (
              <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <pre className="text-xs text-red-400 overflow-x-auto whitespace-pre-wrap">
                  {log.error}
                </pre>
              </div>
            )}
          </motion.div>
        </button>
      )}
    </motion.div>
  );
}