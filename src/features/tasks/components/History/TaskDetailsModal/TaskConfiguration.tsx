import React from 'react';
import { Calendar, Code, Globe, Clock, Tag } from 'lucide-react';
import type { Task } from '@/types/task';

interface TaskConfigurationProps {
  task: Task;
}

export function TaskConfiguration({ task }: TaskConfigurationProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Task Configuration</h3>
      <div className="space-y-4">
        <ConfigItem
          icon={<Calendar className="w-4 h-4 text-primary" />}
          label="Schedule"
          value={task.cron_expression}
        />

        <ConfigItem
          icon={task.is_command ? (
            <Code className="w-4 h-4 text-purple-400" />
          ) : (
            <Globe className="w-4 h-4 text-blue-400" />
          )}
          label="Type"
          value={task.is_command ? 'Command' : 'HTTP Request'}
        />

        <ConfigItem
          icon={<Clock className="w-4 h-4 text-yellow-400" />}
          label="Status"
          value={
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              task.state === 'ACTIVE'
                ? 'bg-green-500/10 text-green-400'
                : 'bg-gray-500/10 text-gray-400'
            }`}>
              {task.state}
            </span>
          }
        />

        {task.tags && task.tags.length > 0 && (
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Tag className="w-4 h-4" />
              <span>Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/5 rounded-lg text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {task.description && (
          <div className="pt-2 border-t border-white/10">
            <span className="text-sm text-gray-400">Description</span>
            <p className="mt-1 text-sm">{task.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ConfigItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function ConfigItem({ icon, label, value }: ConfigItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}