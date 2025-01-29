import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from '@/lib/notiflix';
import { supabase } from '@/lib/supabase';
import { handleSupabaseError, logError } from '@/lib/errors';
import type { Task } from '@/types/task';
import type { TaskType } from '../types';

interface UseTaskFormProps {
  onSuccess: () => void;
}

export function useTaskForm({ onSuccess }: UseTaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cronDescription, setCronDescription] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('command');
  const [showCronBuilder, setShowCronBuilder] = useState(false);
  const [showAuthConfig, setShowAuthConfig] = useState(false);

  const form = useForm<Task>({
    defaultValues: {
      is_command: true,
      is_request: false,
      state: 'ACTIVE',
      command: {
        type: 'bash',
        script: '#!/bin/bash\n\necho "Hello from OCM!"'
      }
    }
  });

  const handleTypeChange = useCallback((newType: TaskType) => {
    setTaskType(newType);
    form.setValue('is_command', newType === 'command');
    form.setValue('is_request', newType === 'request');
  }, [form]);

  const handleTestRun = useCallback(async (data: Task) => {
    try {
      setIsSubmitting(true);
      toast.info('Running task...');
      
      // Simulation d'exécution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Task executed successfully!');
    } catch (error) {
      logError(error, 'TaskForm.handleTestRun');
      toast.error('Failed to test task');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleSubmit = useCallback(async (data: Task) => {
    try {
      setIsSubmitting(true);
      
      // Clean up data based on task type
      if (taskType === 'command') {
        data.endpoint = null;
      } else {
        data.command = null;
      }

      // Get the current user's ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not found');

      // Add created_by field
      const taskData = {
        ...data,
        created_by: user.id
      };

      
      const { error } = await supabase
        .from('tasks')
        .insert([taskData]);

      if (error) throw error;

      toast.success('Task created successfully!');
      onSuccess();
    } catch (error) {
      const appError = error.code ? handleSupabaseError(error) : error;
      logError(appError, 'TaskForm.handleSubmit');
      toast.error(appError.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [taskType, onSuccess]);

  return {
    form,
    isSubmitting,
    cronDescription,
    setCronDescription,
    taskType,
    showCronBuilder,
    setShowCronBuilder,
    showAuthConfig,
    setShowAuthConfig,
    handleTypeChange,
    handleTestRun,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
}