import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskForm } from './hooks/useTaskForm';
import { BasicInformation } from './BasicInformation';
import { TaskTypeSelector } from './TaskTypeSelector';
import { CommandConfig } from './CommandConfig';
import { RequestConfig } from './RequestConfig';
import { NotificationConfig } from './NotificationConfig';
import { FormActions } from './FormActions';

interface TaskFormProps {
  onSuccess: () => void;
}

export function TaskForm({ onSuccess }: TaskFormProps) {
  const {
    form: {
      register,
      control,
      watch,
      formState: { errors },
      setValue,
      getValues
    },
    isSubmitting,
    cronDescription,
    taskType,
    showCronBuilder,
    setShowCronBuilder,
    showAuthConfig,
    setShowAuthConfig,
    handleTypeChange,
    handleTestRun,
    handleSubmit
  } = useTaskForm({ onSuccess });

  const watchCommandType = watch('command.type');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <BasicInformation
          register={register}
          control={control}
          errors={errors}
          showCronBuilder={showCronBuilder}
          setShowCronBuilder={setShowCronBuilder}
          cronDescription={cronDescription}
        />

        <TaskTypeSelector
          taskType={taskType}
          onTypeChange={handleTypeChange}
        />

        <AnimatePresence mode="wait">
          {taskType === 'command' ? (
            <motion.div
              key="command"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CommandConfig
                register={register}
                control={control}
                watchCommandType={watchCommandType}
                setValue={setValue}
                getValues={getValues}
              />
            </motion.div>
          ) : (
            <motion.div
              key="request"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <RequestConfig
                register={register}
                control={control}
                showAuthConfig={showAuthConfig}
                setShowAuthConfig={setShowAuthConfig}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <NotificationConfig control={control} />
        
        <FormActions 
          isSubmitting={isSubmitting}
          onTest={handleSubmit}
        />
      </form>
    </motion.div>
  );
}