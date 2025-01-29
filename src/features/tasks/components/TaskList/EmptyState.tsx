import React from 'react';
import { motion } from 'framer-motion';
import { CalendarClock } from 'lucide-react';

interface EmptyStateProps {
  onNewTask: () => void;
}

export function EmptyState({ onNewTask }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10" />
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CalendarClock className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">No tasks yet</h3>
        <p className="text-gray-400 mb-8">Create your first task to get started with automated scheduling</p>
        <button
          onClick={onNewTask}
          className="bg-gradient-to-r from-primary to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Create Your First Task
        </button>
      </div>
    </motion.div>
  );
}