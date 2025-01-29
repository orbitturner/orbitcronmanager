import React from 'react';
import { Play, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormActionsProps {
  isSubmitting: boolean;
  onTest: () => void;
}

export function FormActions({ isSubmitting, onTest }: FormActionsProps) {
  return (
    <motion.div 
      className="flex items-center justify-end gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <button
        type="button"
        onClick={onTest}
        disabled={isSubmitting}
        className="group relative px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
        <Play className="w-4 h-4" />
        <span className="relative">Test Run</span>
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-purple-500 text-white hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-10 transition-opacity rounded-lg" />
        <Save className="w-4 h-4" />
        <span className="relative">{isSubmitting ? 'Creating...' : 'Create Task'}</span>
      </button>
    </motion.div>
  );
}