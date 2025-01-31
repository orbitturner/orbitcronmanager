import React from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, UserPlus, Building2 } from 'lucide-react'
import { CreateTeamModal } from '../CreateTeamModal'
import { JoinTeamModal } from '../JoinTeamModal'

export function NoTeamState() {
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [showJoinModal, setShowJoinModal] = React.useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10" />
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-3xl font-bold mb-4">Welcome to Teams</h3>
          <p className="text-gray-400 mb-12 max-w-lg mx-auto">
            Get started by creating your own team or joining an existing one. Teams help you collaborate and manage tasks together.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="group relative overflow-hidden p-6 bg-black/20 hover:bg-black/30 border border-white/10 rounded-xl text-left transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Create a New Team</h4>
                <p className="text-sm text-gray-400">
                  Start fresh with your own team and invite others to join
                </p>
                <div className="flex items-center mt-4 text-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Create Team</span>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowJoinModal(true)}
              className="group relative overflow-hidden p-6 bg-black/20 hover:bg-black/30 border border-white/10 rounded-xl text-left transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <UserPlus className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Join Existing Team</h4>
                <p className="text-sm text-gray-400">
                  Join your colleagues using a team invitation code
                </p>
                <div className="flex items-center mt-4 text-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Join Team</span>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <JoinTeamModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </>
  )
}