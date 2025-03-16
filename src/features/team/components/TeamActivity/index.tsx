import React from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { 
  UserPlus, 
  UserMinus, 
  Settings,
  CalendarPlus,
  CalendarX,
  PencilLine,
  History
} from 'lucide-react'
import type { Activity } from '../../services/activity.service'

interface TeamActivityProps {
  activities: Activity[]
  isLoading: boolean
}

export function TeamActivity({ activities = [], isLoading }: TeamActivityProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 animate-pulse"
          >
            <div className="h-6 bg-white/10 rounded-lg w-3/4 mb-2" />
            <div className="h-4 bg-white/10 rounded-lg w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (!activities?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center"
      >
        <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-300 mb-2">No Activity Yet</h3>
        <p className="text-gray-400 text-sm">
          Team activities will appear here as members interact with the system.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  )
}

function ActivityItem({ activity }: { activity: Activity }) {
  const getActivityIcon = () => {
    switch (activity.action) {
      case 'member_joined':
        return <UserPlus className="w-5 h-5 text-green-400" />
      case 'member_left':
        return <UserMinus className="w-5 h-5 text-red-400" />
      case 'role_updated':
        return <Settings className="w-5 h-5 text-purple-400" />
      case 'task_created':
        return <CalendarPlus className="w-5 h-5 text-primary" />
      case 'task_updated':
        return <PencilLine className="w-5 h-5 text-yellow-400" />
      case 'task_deleted':
        return <CalendarX className="w-5 h-5 text-red-400" />
      default:
        return null
    }
  }

  const getActivityMessage = () => {
    if (!activity?.details) return 'Unknown activity'

    switch (activity.action) {
      case 'member_joined':
        return (
          <span>
            <span className="font-medium">{activity.details.member_email}</span> joined as{' '}
            <span className="font-medium">{activity.details.role}</span>
          </span>
        )
      case 'member_left':
        return (
          <span>
            <span className="font-medium">{activity.details.member_email}</span> left the team
            {activity.details.removed_by && (
              <span> (removed by {activity.details.removed_by})</span>
            )}
          </span>
        )
      case 'role_updated':
        return (
          <span>
            <span className="font-medium">{activity.details.member_email}</span>'s role updated to{' '}
            <span className="font-medium">{activity.details.new_role}</span>
          </span>
        )
      case 'task_created':
        return (
          <span>
            <span className="font-medium">{activity.details.task_name}</span> task created
          </span>
        )
      case 'task_updated':
        return (
          <span>
            <span className="font-medium">{activity.details.task_name}</span> task updated
          </span>
        )
      case 'task_deleted':
        return (
          <span>
            <span className="font-medium">{activity.details.task_name}</span> task deleted
          </span>
        )
      default:
        return 'Unknown activity'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/5 rounded-lg">
            {getActivityIcon()}
          </div>
          <span>{getActivityMessage()}</span>
        </div>
        <span className="text-sm text-gray-400">
          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
        </span>
      </div>
    </motion.div>
  )
}