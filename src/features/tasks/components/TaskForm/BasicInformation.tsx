import React from 'react';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import cronstrue from 'cronstrue';
import { CronBuilder } from '@/components/CronBuilder';
import type { Task } from '@/types/task';

interface BasicInformationProps {
  register: UseFormRegister<Task>;
  control: Control<Task>;
  errors: any;
  showCronBuilder: boolean;
  setShowCronBuilder: (show: boolean) => void;
  cronDescription: string;
}

export function BasicInformation({
  register,
  control,
  errors,
  showCronBuilder,
  setShowCronBuilder,
  cronDescription,
}: BasicInformationProps) {
  // Garder la valeur du cron entre les changements de mode
  const [cronValue, setCronValue] = React.useState('');

  return (
    <motion.div 
      className="relative bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10" />
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="relative">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          Basic Information
        </h2>
        
        <div className="grid gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium mb-1">Task Name</label>
            <input
              {...register('task_name', { required: 'Task name is required' })}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              placeholder="Daily backup"
            />
            {errors.task_name && (
              <p className="text-red-400 text-sm mt-1">{errors.task_name.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">Schedule</label>
              <button
                type="button"
                onClick={() => setShowCronBuilder(!showCronBuilder)}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {showCronBuilder ? 'Switch to Text Input' : 'Use Schedule Builder'}
              </button>
            </div>

            <div className="space-y-2">
              {showCronBuilder ? (
                <Controller
                  name="cron_expression"
                  control={control}
                  rules={{ required: 'Schedule is required' }}
                  render={({ field }) => (
                    <CronBuilder
                      value={field.value || cronValue}
                      onChange={(value) => {
                        field.onChange(value);
                        setCronValue(value);
                      }}
                    />
                  )}
                />
              ) : (
                <Controller
                  name="cron_expression"
                  control={control}
                  rules={{ 
                    required: 'Schedule is required',
                    validate: value => {
                      try {
                        cronstrue.toString(value);
                        return true;
                      } catch {
                        return 'Invalid cron expression';
                      }
                    }
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      value={field.value || cronValue}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setCronValue(e.target.value);
                      }}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                      placeholder="0 0 * * *"
                    />
                  )}
                />
              )}

              {cronDescription && (
                <motion.p 
                  className="text-sm text-gray-400"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {cronDescription}
                </motion.p>
              )}
            </div>
            {errors.cron_expression && (
              <p className="text-red-400 text-sm mt-1">{errors.cron_expression.message}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}