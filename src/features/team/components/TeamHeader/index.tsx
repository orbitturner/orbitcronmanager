import React from 'react'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

interface TeamHeaderProps {
  hasTeam: boolean
}

export function TeamHeader({ hasTeam }: TeamHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 lg:mb-8"
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Team
          </h1>
        </div>
        <p className="text-sm lg:text-base text-gray-400">
          {hasTeam 
            ? 'Manage your team members and permissions'
            : 'Create or join a team to start collaborating'
          }
        </p>
      </div>
    </motion.div>
  )
}