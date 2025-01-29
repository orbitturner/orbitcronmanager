import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface TaskStatusProps {
  lastExecutionResult: string | null;
}

export function TaskStatus({ lastExecutionResult }: TaskStatusProps) {
  const getStatusColor = () => {
    if (!lastExecutionResult) return 'gray';
    if (lastExecutionResult.toLowerCase().includes('success')) return 'green';
    if (lastExecutionResult.toLowerCase().includes('fail')) return 'red';
    return 'yellow';
  };

  const getStatusIcon = () => {
    if (!lastExecutionResult) return null;
    if (lastExecutionResult.toLowerCase().includes('success')) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  const StatusIcon = getStatusIcon();
  const statusColor = getStatusColor();

  return (
    <div className="p-3 bg-black/20 rounded-lg">
      <div className="flex items-center text-sm text-gray-400 mb-1">
        {StatusIcon && <div className="mr-1">{StatusIcon}</div>}
        <span>Status</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`w-2 h-2 rounded-full bg-${statusColor}-400`} />
        <p className="font-medium">
          {lastExecutionResult || 'Not executed'}
        </p>
      </div>
    </div>
  );
}