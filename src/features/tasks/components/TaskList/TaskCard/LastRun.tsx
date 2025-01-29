import React from 'react';
import { CalendarClock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface LastRunProps {
  lastExecutionDate: string | null;
}

export function LastRun({ lastExecutionDate }: LastRunProps) {
  return (
    <div className="p-3 bg-black/20 rounded-lg">
      <div className="flex items-center text-sm text-gray-400 mb-1">
        <CalendarClock className="w-4 h-4 mr-1" />
        <span>Last Run</span>
      </div>
      <p className="font-medium">
        {lastExecutionDate 
          ? formatDistanceToNow(new Date(lastExecutionDate), { addSuffix: true })
          : 'Never'}
      </p>
    </div>
  );
}