import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from '@/lib/notiflix';
import { supabase } from '@/lib/supabase';
import type { Task } from '@/types/task';
import { BasicInformation } from '../TaskForm/BasicInformation';
import { CommandConfig } from '../TaskForm/CommandConfig';
import { RequestConfig } from '../TaskForm/RequestConfig';
import { NotificationConfig } from '../TaskForm/NotificationConfig';

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onSuccess: () => void;
}

export function TaskEditModal({ isOpen, onClose, task, onSuccess }: TaskEditModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showCronBuilder, setShowCronBuilder] = React.useState(false);
  const [showAuthConfig, setShowAuthConfig] = React.useState(false);

  const form = useForm<Task>({
    defaultValues: task
  });

  const watchCommandType = form.watch('command.type');

  const handleSubmit = async (data: Task) => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('tasks')
        .update({
          task_name: data.task_name,
          cron_expression: data.cron_expression,
          command: data.command,
          endpoint: data.endpoint,
          mail_recipients: data.mail_recipients,
          notification_settings: data.notification_settings,
          state: data.state
        })
        .eq('uuid', task.uuid);

      if (error) throw error;

      toast.success('Task updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform"
            >
              <div className="relative bg-background rounded-xl shadow-xl">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h2 className="text-xl font-semibold">Edit Task</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-card rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-8">
                  <BasicInformation
                    register={form.register}
                    control={form.control}
                    errors={form.formState.errors}
                    showCronBuilder={showCronBuilder}
                    setShowCronBuilder={setShowCronBuilder}
                    cronDescription=""
                  />

                  {task.is_command ? (
                    <CommandConfig
                      register={form.register}
                      control={form.control}
                      watchCommandType={watchCommandType}
                      setValue={form.setValue}
                      getValues={form.getValues}
                    />
                  ) : (
                    <RequestConfig
                      register={form.register}
                      control={form.control}
                      showAuthConfig={showAuthConfig}
                      setShowAuthConfig={setShowAuthConfig}
                    />
                  )}

                  <NotificationConfig control={form.control} />

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}