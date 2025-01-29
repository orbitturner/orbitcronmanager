import React from 'react';
import { Globe, Lock } from 'lucide-react';
import type { Task } from '@/types/task';

interface TaskEndpointProps {
  task: Task;
}

export function TaskEndpoint({ task }: TaskEndpointProps) {
  if (!task.endpoint) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-4">HTTP Configuration</h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
            <Globe className="w-4 h-4" />
            <span>Endpoint</span>
          </div>
          <div className="p-2 bg-black/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs font-medium">
                {task.endpoint.method}
              </span>
              <span className="text-sm">{task.endpoint.url}</span>
            </div>
          </div>
        </div>

        {task.endpoint.headers && (
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
              <Lock className="w-4 h-4" />
              <span>Headers</span>
            </div>
            <pre className="text-xs p-2 bg-black/20 rounded-lg overflow-x-auto">
              {JSON.stringify(task.endpoint.headers, null, 2)}
            </pre>
          </div>
        )}

        {task.endpoint.data && (
          <div>
            <span className="text-sm text-gray-400">Request Body</span>
            <pre className="mt-1 text-xs p-2 bg-black/20 rounded-lg overflow-x-auto">
              {JSON.stringify(task.endpoint.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}