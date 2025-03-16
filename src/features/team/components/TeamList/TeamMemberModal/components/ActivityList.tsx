import React from 'react'
import { History, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

interface ActivityListProps {
  title?: string
  limit?: number
  showDetails?: boolean
}

export function ActivityList({ title, limit = 5, showDetails = false }: ActivityListProps) {
  const activities = Array.from({ length: limit }, (_, i) => ({
    id: i,
    type: i % 3,
    title: 'Task execution completed',
    description: 'Successfully executed task "Daily Backup" in 2.3 seconds',
    time: '2 hours ago',
    logs: i === 1 ? `[2024-01-31 15:30:45] Backup completed successfully
[2024-01-31 15:30:44] Compressing files...
[2024-01-31 15:30:42] Starting backup process...` : undefined
  }))

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-medium">{title}</h3>}
      
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="p-4 bg-black/20 rounded-lg border border-white/5"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              {activity.type === 0 ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : activity.type === 1 ? (
                <XCircle className="w-5 h-5 text-red-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              )}
              <span className="font-medium">{activity.title}</span>
            </div>
            <span className="text-sm text-gray-400">{activity.time}</span>
          </div>
          
          {showDetails && (
            <>
              <p className="text-sm text-gray-400 mt-2">{activity.description}</p>
              {activity.logs && (
                <div className="mt-3 p-3 bg-black/40 rounded-lg">
                  <pre className="text-xs text-gray-400 overflow-x-auto">
                    {activity.logs}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  )
}