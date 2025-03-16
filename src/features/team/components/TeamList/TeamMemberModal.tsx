import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Mail, 
  Calendar,
  Activity,
  Clock,
  Shield,
  UserMinus,
  Crown,
  Settings,
  History,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import type { TeamMember } from '../../types'

interface TeamMemberModalProps {
  member: TeamMember
  isOpen: boolean
  onClose: () => void
  onRemove: () => Promise<void>
}

export function TeamMemberModal({ member, isOpen, onClose, onRemove }: TeamMemberModalProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'activity' | 'settings'>('overview')
  const [isRemoving, setIsRemoving] = React.useState(false)

  const handleRemove = async () => {
    try {
      setIsRemoving(true)
      await onRemove()
      onClose()
    } finally {
      setIsRemoving(false)
    }
  }

  const getRoleIcon = () => {
    switch (member.role) {
      case 'owner':
        return <Crown className="w-5 h-5 text-yellow-400" />
      case 'admin':
        return <Settings className="w-5 h-5 text-purple-400" />
      default:
        return <Shield className="w-5 h-5 text-primary" />
    }
  }

  const getRoleColor = () => {
    switch (member.role) {
      case 'owner':
        return 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/20 text-yellow-400'
      case 'admin':
        return 'from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400'
      default:
        return 'from-primary/20 to-blue-600/5 border-primary/20 text-primary'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform"
            >
              <div className="relative bg-background/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl">
                {/* Header */}
                <div className="relative overflow-hidden border-b border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5" />
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                  
                  <div className="relative p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/10">
                          <span className="text-2xl font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                            {member.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{member.email}</h2>
                          <div className={`inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs font-medium bg-gradient-to-r ${getRoleColor()} border`}>
                            {getRoleIcon()}
                            <span className="ml-1.5">
                              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-4 mt-6">
                      <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === 'overview'
                            ? 'bg-primary text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        Overview
                      </button>
                      <button
                        onClick={() => setActiveTab('activity')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === 'activity'
                            ? 'bg-primary text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        Activity Log
                      </button>
                      <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === 'settings'
                            ? 'bg-primary text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        Settings
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                          <div className="flex items-center text-sm text-gray-400 mb-2">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Member Since</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {format(new Date(member.created_at), 'MMM d, yyyy')}
                            </span>
                            <span className="text-sm text-gray-400 mt-0.5">
                              {formatDistanceToNow(new Date(member.created_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                          <div className="flex items-center text-sm text-gray-400 mb-2">
                            <Activity className="w-4 h-4 mr-2" />
                            <span>Tasks Created</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">24 tasks</span>
                            <span className="text-sm text-green-400">↑12%</span>
                          </div>
                        </div>

                        <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                          <div className="flex items-center text-sm text-gray-400 mb-2">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Last Active</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                            <span className="font-medium">Now</span>
                          </div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Recent Activity</h3>
                        <div className="space-y-4">
                          {[1, 2, 3].map((_, i) => (
                            <div
                              key={i}
                              className="p-4 bg-black/20 rounded-lg border border-white/5"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-primary/10 rounded-lg">
                                    <History className="w-4 h-4 text-primary" />
                                  </div>
                                  <span className="font-medium">Created new task "Daily Backup"</span>
                                </div>
                                <span className="text-sm text-gray-400">2 hours ago</span>
                              </div>
                              <p className="text-sm text-gray-400">
                                Added a new automated backup task scheduled for daily execution
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'activity' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium">Activity Log</h3>
                        <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm">
                          <option>All Activities</option>
                          <option>Task Updates</option>
                          <option>System Events</option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                          <div
                            key={i}
                            className="p-4 bg-black/20 rounded-lg border border-white/5"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                {i % 3 === 0 ? (
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                ) : i % 3 === 1 ? (
                                  <XCircle className="w-5 h-5 text-red-400" />
                                ) : (
                                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                )}
                                <span className="font-medium">Task execution completed</span>
                              </div>
                              <span className="text-sm text-gray-400">2 hours ago</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-2">
                              Successfully executed task "Daily Backup" in 2.3 seconds
                            </p>
                            {i === 1 && (
                              <div className="mt-3 p-3 bg-black/40 rounded-lg">
                                <pre className="text-xs text-gray-400 overflow-x-auto">
                                  {`[2024-01-31 15:30:45] Backup completed successfully
[2024-01-31 15:30:44] Compressing files...
[2024-01-31 15:30:42] Starting backup process...`}
                                </pre>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Role & Permissions</h3>
                        <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium mb-1">Current Role</p>
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRoleColor()} border`}>
                                {getRoleIcon()}
                                <span className="ml-1.5">
                                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                </span>
                              </div>
                            </div>
                            {member.role !== 'owner' && (
                              <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors">
                                Change Role
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notifications</h3>
                        <div className="p-4 bg-black/20 rounded-lg border border-white/5 space-y-4">
                          <label className="flex items-center justify-between">
                            <span className="text-sm">Email Notifications</span>
                            <input type="checkbox" className="rounded border-white/20 bg-white/10" defaultChecked />
                          </label>
                          <label className="flex items-center justify-between">
                            <span className="text-sm">Task Execution Alerts</span>
                            <input type="checkbox" className="rounded border-white/20 bg-white/10" defaultChecked />
                          </label>
                          <label className="flex items-center justify-between">
                            <span className="text-sm">System Updates</span>
                            <input type="checkbox" className="rounded border-white/20 bg-white/10" />
                          </label>
                        </div>
                      </div>

                      {member.role !== 'owner' && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-red-400">Danger Zone</h3>
                          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-sm text-gray-400 mb-4">
                              Removing this member will revoke their access to all team resources.
                              This action cannot be undone.
                            </p>
                            <button
                              onClick={handleRemove}
                              disabled={isRemoving}
                              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors disabled:opacity-50"
                            >
                              {isRemoving ? 'Removing Member...' : 'Remove Member'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}