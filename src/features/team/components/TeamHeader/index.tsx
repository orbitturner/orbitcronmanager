import React from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, Search } from 'lucide-react'

interface TeamHeaderProps {
  hasTeam: boolean
  searchQuery: string
  onSearchChange: (query: string) => void
  onInvite: () => void
}

export function TeamHeader({ hasTeam, searchQuery, onSearchChange, onInvite }: TeamHeaderProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
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

      {hasTeam && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-2.5 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
            />
          </div>

          <button
            onClick={onInvite}
            className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-purple-500 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Invite Member</span>
          </button>
        </div>
      )}
    </div>
  )
}