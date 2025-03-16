import React from 'react'
import { motion } from 'framer-motion'
import { Users, UserCheck, CalendarClock } from 'lucide-react'
import type { TeamStats as TeamStatsType } from '../../types'

interface TeamStatsProps {
  stats: TeamStatsType
  isLoading: boolean
}

export function TeamStats({ stats, isLoading }: TeamStatsProps) {
  const statItems = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      label: 'Total Members',
      value: stats.totalMembers,
      color: 'from-primary/20 via-primary/10 to-primary/5 border-primary/20'
    },
    {
      icon: <UserCheck className="w-6 h-6 text-green-400" />,
      label: 'Active Members',
      value: stats.activeMembers,
      color: 'from-green-500/20 via-green-500/10 to-green-500/5 border-green-500/20'
    },
    {
      icon: <CalendarClock className="w-6 h-6 text-purple-400" />,
      label: 'Total Tasks',
      value: stats.totalTasks,
      color: 'from-purple-500/20 via-purple-500/10 to-purple-500/5 border-purple-500/20'
    }
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 animate-pulse"
          >
            <div className="h-8 bg-white/10 rounded-lg w-1/2 mb-2" />
            <div className="h-6 bg-white/10 rounded-lg w-1/3" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative overflow-hidden backdrop-blur-xl rounded-xl border p-6 bg-gradient-to-br ${item.color}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br opacity-20" />
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br rounded-full blur-3xl opacity-20" />
          
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-white/5 rounded-lg">{item.icon}</div>
              <span className="text-3xl font-bold">{item.value}</span>
            </div>
            <p className="mt-2 text-sm text-gray-400">{item.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}