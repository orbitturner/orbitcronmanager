import React from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  showAction?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  description, 
  showAction = true,
  actionLabel = "Create Your First Task",
  onAction,
  icon = <CalendarClock className="w-8 h-8 lg:w-10 lg:h-10 text-primary" />
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-white/10 rounded-lg lg:rounded-xl p-8 lg:p-12 text-center"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10" />
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          {icon}
        </div>
        <h3 className="text-xl lg:text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 mb-8">{description}</p>
        {showAction && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}