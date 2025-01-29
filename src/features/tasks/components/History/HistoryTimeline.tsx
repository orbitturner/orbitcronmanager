import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface TimelineData {
  id: string;
  name: string;
  executions: any[];
  lastExecution: string;
  status: string;
}

interface HistoryTimelineProps {
  data: TimelineData[];
  onTaskSelect: (task: any) => void;
  selectedTaskId?: string;
}

export function HistoryTimeline({ data, onTaskSelect, selectedTaskId }: HistoryTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl"
    >
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative p-6">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-6">
          Execution Timeline
        </h2>

        <div className="grid gap-4">
          {data.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.01 }}
              className={`relative overflow-hidden backdrop-blur-xl border rounded-xl cursor-pointer transition-all duration-300 ${
                selectedTaskId === item.id 
                  ? 'bg-primary/10 border-primary/30' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              onClick={() => onTaskSelect(item)}
            >
              {/* Card background effect */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-20" />
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br rounded-full blur-3xl opacity-10" />
              
              <div className="relative p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                  {/* Task Info */}
                  <div className="lg:col-span-1">
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Last execution: {format(new Date(item.lastExecution), 'PPp')}</span>
                    </div>
                  </div>

                  {/* Execution Timeline */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center justify-start space-x-2 h-8">
                      {item.executions.slice(0, 8).map((execution, index) => (
                        <ExecutionDot key={index} result={execution.result} />
                      ))}
                      {item.executions.length > 8 && (
                        <span className="text-sm text-gray-400">+{item.executions.length - 8} more</span>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="lg:col-span-1 flex justify-end">
                    <ExecutionStatus status={item.status} />
                  </div>
                </div>

                {/* Execution Stats */}
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
                  <Stat
                    label="Success Rate"
                    value={`${calculateSuccessRate(item.executions)}%`}
                    color="green"
                  />
                  <Stat
                    label="Total Executions"
                    value={item.executions.length}
                    color="blue"
                  />
                  <Stat
                    label="Average Duration"
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

function ExecutionStatus({ status }: { status: string }) {
  const getStatusStyle = () => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'failure':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className={`px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusStyle()}`}>
      {status}
    </div>
  );
}

function ExecutionDot({ result }: { result: string }) {
  const getResultStyle = () => {
    switch (result.toLowerCase()) {
      case 'success':
        return 'bg-green-400 shadow-lg shadow-green-400/20';
      case 'failure':
        return 'bg-red-400 shadow-lg shadow-red-400/20';
      default:
        return 'bg-gray-400 shadow-lg shadow-gray-400/20';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`w-3 h-3 rounded-full ${getResultStyle()}`}
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
      <div className={`text-lg font-semibold ${getColorStyle()}`}>{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
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