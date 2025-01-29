import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Mail, Plus, X } from 'lucide-react';
import { EmailPills } from '@/components/EmailPills';
import type { Task } from '@/types/task';

interface NotificationConfigProps {
  control: Control<Task>;
}

export function NotificationConfig({ control }: NotificationConfigProps) {
  return (
    <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10" />
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="relative">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          Notifications
        </h2>

        <div className="grid gap-6 mt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Recipients (To)</label>
              <div className="bg-black/20 rounded-lg p-1">
                <Controller
                  name="mail_recipients.to"
                  control={control}
                  render={({ field }) => (
                    <EmailPills
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Enter email addresses..."
                    />
                  )}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Press Enter or comma to add multiple emails</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">CC Recipients</label>
              <div className="bg-black/20 rounded-lg p-1">
                <Controller
                  name="mail_recipients.cc"
                  control={control}
                  render={({ field }) => (
                    <EmailPills
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Enter CC email addresses..."
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Notification Settings</h3>
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Configure
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-white/20 bg-white/10"
                  defaultChecked
                />
                <span className="text-sm">Notify on success</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-white/20 bg-white/10"
                  defaultChecked
                />
                <span className="text-sm">Notify on failure</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}