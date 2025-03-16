import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Activity, Clock, History } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { StatsGrid } from '../components/StatsGrid'
import { ActivityList } from '../components/ActivityList'
import type { TeamMember } from '../../../../types'

interface OverviewTabProps {
  member: TeamMember
}

export function OverviewTab({ member }: OverviewTabProps) {
  const stats = [
    {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Member Since',
      value: format(new Date(member.created_at), 'MMM d, yyyy'),
      subValue: formatDistanceToNow(new Date(member.created_at), { addSuffix: true })
    },
    {
      icon: <Activity className="w-4 h-4" />,
      label: 'Tasks Created',
      value: '24 tasks',
      subValue: '↑12%',
      subValueColor: 'text-green-400'
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: 'Last Active',
      value: 'Now',
      showStatusDot: true
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <StatsGrid stats={stats} />
      <ActivityList title="Recent Activity" limit={3} />
    </motion.div>
  )
}