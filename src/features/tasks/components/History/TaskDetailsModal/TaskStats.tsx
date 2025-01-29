import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import type { Task } from '@/types/task';

interface TaskStatsProps {
  task: Task;
}

export function TaskStats({ task }: TaskStatsProps) {
  const logs = task.execution_logs || [];
  const successCount = logs.filter(log => log.result === 'SUCCESS').length;
  const failureCount = logs.filter(log => log.result === 'FAILURE').length;
  const totalDuration = logs.reduce((acc, log) => acc + (log.duration || 0), 0);
  const averageDuration = logs.length ? Math.round(totalDuration / logs.length) : 0;
  const successRate = logs.length ? (successCount / logs.length) * 100 : 0;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Execution Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<Clock className="w-4 h-4 text-blue-400" />}
          label="Total Runs"
          value={logs.length}
        />
        <StatCard
          icon={<CheckCircle className="w-4 h-4 text-green-400" />}
          label="Success Rate"
          value={`${successRate.toFixed(1)}%`}
        />
        <StatCard
          icon={<AlertTriangle className="w-4 h-4 text-yellow-400" />}
          label="Avg Duration"
          value={`${averageDuration}ms`}
        />
        <StatCard
          icon={<XCircle className="w-4 h-4 text-red-400" />}
          label="Failures"
          value={failureCount}
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-black/20 rounded-lg p-3">
      <div className="flex items-center space-x-2 mb-2">
        {icon}
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}