import React from 'react';
import { motion } from 'framer-motion';
import { HistoryStats } from '../components/History/HistoryStats';
import { HistoryFilters } from '../components/History/HistoryFilters';
import { HistoryTimeline } from '../components/History/HistoryTimeline';
import { TaskDetailsModal } from '../components/History/TaskDetailsModal';
import { useTaskHistory } from '../hooks/useTaskHistory';

export function HistoryPage() {
  const {
    tasks,
    selectedTask,
    setSelectedTask,
    isLoading,
    filters,
    setFilters,
    stats,
    timelineData,
    showDetailsModal,
    setShowDetailsModal,
    handleTaskSelect
  } = useTaskHistory();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" style={{ animationDelay: '-0.2s' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen space-y-6 lg:space-y-8">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 lg:mb-8"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Execution History
            </h1>
            <p className="mt-2 text-sm lg:text-base text-gray-400">Track and analyze your task executions</p>
          </div>
        </motion.div>

        <div className="space-y-6 lg:space-y-8">
          <HistoryStats stats={stats} />
          
          <div className="grid gap-6 lg:gap-8">
            <HistoryFilters 
              filters={filters} 
              onFiltersChange={setFilters} 
            />

            <div className="relative">
              <HistoryTimeline 
                data={timelineData}
                onTaskSelect={handleTaskSelect}
                selectedTaskId={selectedTask?.uuid}
              />
            </div>
          </div>
        </div>

        <TaskDetailsModal
          task={selectedTask}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      </div>
    </div>
  );
}