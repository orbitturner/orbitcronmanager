import React from 'react'
import { motion } from 'framer-motion'
import { ActivityList } from '../components/ActivityList'

export function ActivityTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Activity Log</h3>
        <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm">
          <option>All Activities</option>
          <option>Task Updates</option>
          <option>System Events</option>
        </select>
      </div>

      <ActivityList limit={10} showDetails />
    </motion.div>
  )
}