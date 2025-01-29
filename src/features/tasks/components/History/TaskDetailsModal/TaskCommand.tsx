import React from 'react';
import { Terminal, Settings } from 'lucide-react';
import type { Task } from '@/types/task';

interface TaskCommandProps {
  task: Task;
}

export function TaskCommand({ task }: TaskCommandProps) {
  if (!task.command) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Command Configuration</h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
            <Terminal className="w-4 h-4" />
            <span>Script ({task.command.type})</span>
          </div>
          <pre className="text-xs p-2 bg-black/20 rounded-lg overflow-x-auto whitespace-pre-wrap">
            {task.command.script}
          </pre>
        </div>

        {task.command.options && (
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
              <Settings className="w-4 h-4" />
              <span>Options</span>
            </div>
            <div className="space-y-2">
              {task.command.options.timeout_enabled && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Timeout</span>
                  <span>{task.command.options.timeout}s</span>
                </div>
              )}
              {task.command.options.elevated_privileges && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Elevated Privileges</span>
                  <span className="text-green-400">Enabled</span>
                </div>
              )}
              {task.command.options.save_output && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Save Output</span>
                  <span className="text-green-400">Enabled</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}