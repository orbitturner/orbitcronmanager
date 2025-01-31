import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, Activity, History } from 'lucide-react';
import { EmptyState } from '../EmptyState';
import type { Task } from '@/types/task';

interface TimelineData {
  id: string;
  name: string;
  executions: any[];
  lastExecution: string;
  status: string;
  task: Task;
}

interface HistoryTimelineProps {
  data: TimelineData[];
  onTaskSelect: (task: Task) => void;
  selectedTaskId?: string;
}

export function HistoryTimeline({ data, onTaskSelect, selectedTaskId }: HistoryTimelineProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        title="No execution history"
        description="Your task execution history will appear here once tasks have been run"
        showAction={false}
        icon={<History className="w-8 h-8 lg:w-10 lg:h-10 text-primary" />}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg lg:rounded-xl"
      style={{ zIndex: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-4 lg:mb-6">
          Execution Timeline
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => onTaskSelect(item.task)}
              className={`group relative overflow-hidden backdrop-blur-xl border rounded-lg lg:rounded-xl cursor-pointer transition-all duration-300 ${
                selectedTaskId === item.id 
                  ? 'bg-primary/10 border-primary/30' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              {/* Card background effect */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              
              <div className="relative p-3 lg:p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      item.status === 'ACTIVE' 
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gray-500/10 text-gray-400'
                    }`}>
                      <Activity className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm lg:text-base">{item.name}</h3>
                      <div className="flex items-center text-xs lg:text-sm text-gray-400 mt-1">
                        <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        <span>Last run: {format(new Date(item.lastExecution), 'PPp')}</span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                {/* Execution Timeline */}
                <div className="flex items-center gap-4 p-2 lg:p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    {item.executions.slice(0, 8).map((execution, index) => (
                      <ExecutionDot key={index} result={execution.result} />
                    ))}
                    {item.executions.length > 8 && (
                      <span className="text-xs lg:text-sm text-gray-400 ml-2">+{item.executions.length - 8} more</span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 lg:gap-4 mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-white/10">
                  <Stat
                    label="Success Rate"
                    value={`${calculateSuccessRate(item.executions)}%`}
                    color="green"
                  />
                  <Stat
                    label="Total Runs"
                    value={item.executions.length}
                    color="blue"
                  />
                  <Stat
                    label="Avg Duration"
                    value={`${calculateAverageDuration(item.executions)}ms`}
                    color="purple"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getStatusStyle = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className={`px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusStyle()}`}>
      {status}
    </div>
  );
}

function ExecutionDot({ result }: { result: string }) {
  const getResultStyle = () => {
    switch (result.toLowerCase()) {
      case 'success':
        return 'bg-green-400 ring-2 ring-green-400/20';
      case 'failure':
        return 'bg-red-400 ring-2 ring-red-400/20';
      default:
        return 'bg-gray-400 ring-2 ring-gray-400/20';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full ${getResultStyle()}`}
      title={`Execution Result: ${result}`}
    />
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  const getColorStyle = () => {
    switch (color) {
      case 'green':
        return 'text-green-400';
      case 'blue':
        return 'text-blue-400';
      case 'purple':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="text-center">
      <div className={`text-sm lg:text-base font-semibold ${getColorStyle()}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
    </div>
  );
}

function calculateSuccessRate(executions: any[]): number {
  if (!executions.length) return 0;
  const successCount = executions.filter(e => e.result.toLowerCase() === 'success').length;
  return Math.round((successCount / executions.length) * 100);
}

function calculateAverageDuration(executions: any[]): number {
  if (!executions.length) return 0;
  const totalDuration = executions.reduce((acc, e) => acc + (e.duration || 0), 0);
  return Math.round(totalDuration / executions.length);
}