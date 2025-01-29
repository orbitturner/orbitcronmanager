import React from 'react';
import { Code, Globe } from 'lucide-react';
import type { TaskType } from './types';

interface TaskTypeSelectorProps {
  taskType: TaskType;
  onTypeChange: (type: TaskType) => void;
}

export function TaskTypeSelector({ taskType, onTypeChange }: TaskTypeSelectorProps) {
  return (
    <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10" />
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="relative">
        <h2 className="text-xl font-semibold">Task Type</h2>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            type="button"
            onClick={() => onTypeChange('command')}
            className={`group p-6 rounded-lg border-2 transition-all duration-300 backdrop-blur-sm ${
              taskType === 'command'
                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                : 'border-white/10 hover:border-primary/50 hover:bg-white/5'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-lg transition-colors duration-300 ${
                taskType === 'command' ? 'bg-primary/20' : 'bg-white/10 group-hover:bg-primary/10'
              }`}>
                <Code className={`w-6 h-6 transition-transform duration-300 ${
                  taskType === 'command' ? 'scale-110' : 'group-hover:scale-110'
                }`} />
              </div>
              <h3 className="font-medium mt-4 mb-2">Command</h3>
              <p className="text-sm text-gray-400">Execute a script or command</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onTypeChange('request')}
            className={`group p-6 rounded-lg border-2 transition-all duration-300 backdrop-blur-sm ${
              taskType === 'request'
                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                : 'border-white/10 hover:border-primary/50 hover:bg-white/5'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-lg transition-colors duration-300 ${
                taskType === 'request' ? 'bg-primary/20' : 'bg-white/10 group-hover:bg-primary/10'
              }`}>
                <Globe className={`w-6 h-6 transition-transform duration-300 ${
                  taskType === 'request' ? 'scale-110' : 'group-hover:scale-110'
                }`} />
              </div>
              <h3 className="font-medium mt-4 mb-2">HTTP Request</h3>
              <p className="text-sm text-gray-400">Make an HTTP request</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}