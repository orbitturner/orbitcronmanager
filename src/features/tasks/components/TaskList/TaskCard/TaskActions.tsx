import React from 'react';
import { Trash2, Edit, Play, Loader2 } from 'lucide-react';

interface TaskActionsProps {
  onDelete: () => void;
  onEdit: () => void;
  onRun: () => void;
  isRunning: boolean;
  isActive: boolean;
}

export function TaskActions({ onDelete, onEdit, onRun, isRunning, isActive }: TaskActionsProps) {
  return (
    <div className="flex items-center justify-end space-x-2">
      <button
        onClick={onDelete}
        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
      <button
        onClick={onEdit}
        className="p-2 text-gray-400 hover:text-primary transition-colors"
      >
        <Edit className="w-5 h-5" />
      </button>
      <button
        onClick={onRun}
        disabled={isRunning || !isActive}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-primary/10 text-primary hover:bg-primary/20'
            : 'bg-gray-500/10 text-gray-400 cursor-not-allowed'
        } disabled:opacity-50`}
      >
        {isRunning ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Running...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Run Now</span>
          </>
        )}
      </button>
    </div>
  );
}