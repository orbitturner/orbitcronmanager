import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, CheckCircle, XCircle } from 'lucide-react';

interface HistoryStatsProps {
  stats: {
    totalExecutions: number;
    successRate: number;
    averageDuration: number;
    failureRate: number;
    mostFrequentErrors: { error: string; count: number }[];
  };
}

export function HistoryStats({ stats }: HistoryStatsProps) {
  const statCards = [
    {
      icon: <Activity className="w-6 lg:w-8 h-6 lg:h-8" />,
      value: stats.totalExecutions,
      label: "Total Executions",
      color: "blue",
      delay: 0
    },
    {
      icon: <CheckCircle className="w-6 lg:w-8 h-6 lg:h-8" />,
      value: `${stats.successRate.toFixed(1)}%`,
      label: "Success Rate",
      color: "green",
      delay: 0.1
    },
    {
      icon: <Clock className="w-6 lg:w-8 h-6 lg:h-8" />,
      value: `${Math.round(stats.averageDuration)}ms`,
      label: "Average Duration",
      color: "yellow",
      delay: 0.2
    },
    {
      icon: <XCircle className="w-6 lg:w-8 h-6 lg:h-8" />,
      value: `${stats.failureRate.toFixed(1)}%`,
      label: "Failure Rate",
      color: "red",
      delay: 0.3
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: 'blue' | 'green' | 'yellow' | 'red';
  delay: number;
}

function StatCard({ icon, value, label, color, delay }: StatCardProps) {
  const colors = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
    green: 'from-green-500/20 to-green-600/5 border-green-500/20 text-green-400',
    yellow: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/20 text-yellow-400',
    red: 'from-red-500/20 to-red-600/5 border-red-500/20 text-red-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden backdrop-blur-xl rounded-lg lg:rounded-xl border p-4 lg:p-6 ${colors[color]}`}
    >
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br opacity-20" />
      <div className="absolute -right-8 -top-8 w-24 lg:w-32 h-24 lg:h-32 bg-gradient-to-br rounded-full blur-3xl opacity-20" />
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="p-2 lg:p-3 bg-white/5 rounded-lg lg:rounded-xl">{icon}</div>
          <span className="text-2xl lg:text-3xl font-bold">{value}</span>
        </div>
        <p className="mt-2 text-xs lg:text-sm text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
}