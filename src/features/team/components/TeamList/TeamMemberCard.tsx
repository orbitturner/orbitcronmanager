import React from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  MoreVertical, 
  Shield, 
  UserMinus, 
  Crown, 
  Settings, 
  Calendar, 
  Activity,
  Clock,
  UserPlus,
  MessageSquare,
  ExternalLink,
  History,
  Eye
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { useClickOutside } from '@/hooks/useClickOutside'
import { TeamMemberModal } from './TeamMemberModal'
import type { TeamMember } from '../../types'

interface TeamMemberCardProps {
  member: TeamMember
  onMembersChange: () => void
  onRemoveMember: (id: string) => Promise<void>
}

export function TeamMemberCard({ member, onMembersChange, onRemoveMember }: TeamMemberCardProps) {
  const [showMenu, setShowMenu] = React.useState(false)
  const [showModal, setShowModal] = React.useState(false)
  const [isRemoving, setIsRemoving] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  useClickOutside(menuRef, () => setShowMenu(false))

  const handleRemoveMember = async () => {
    try {
      setIsRemoving(true)
      await onRemoveMember(member.id)
      onMembersChange()
    } finally {
      setIsRemoving(false)
      setShowMenu(false)
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 group col-span-2"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />
        
        <div className="relative">
          <div className="flex items-start justify-between">
            {/* Left Section - Member Info */}
            <div className="flex items-start space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/10">
                  <span className="text-3xl font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    {member.email[0].toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-card" />
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">{member.email}</h3>
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${getRoleColor()} border`}>
                  {getRoleIcon()}
                  <span className="ml-2">
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowModal(true)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <Eye className="w-5 h-5" />
              </button>
              
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-card border border-white/10 rounded-lg shadow-xl z-10 py-1"
                  >
                    <button
                      onClick={() => window.location.href = `mailto:${member.email}`}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                    >
                      <Mail className="w-4 h-4 mr-3" />
                      <span>Send Email</span>
                      <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                    </button>
                    
                    <button
                      onClick={() => {}}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 mr-3" />
                      <span>Send Message</span>
                    </button>

                    {member.role !== 'owner' && (
                      <>
                        <div className="border-t border-white/10 my-1" />
                        <button
                          onClick={() => {}}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                        >
                          <UserPlus className="w-4 h-4 mr-3" />
                          <span>Change Role</span>
                        </button>
                        <button
                          onClick={handleRemoveMember}
                          disabled={isRemoving}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                          <UserMinus className="w-4 h-4 mr-3" />
                          <span>{isRemoving ? 'Removing...' : 'Remove Member'}</span>
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-6">
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
                <span>Last Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                <span className="font-medium">Now</span>
              </div>
            </div>

            <div className="p-4 bg-black/20 rounded-lg border border-white/5">
              <div className="flex items-center text-sm text-gray-400 mb-2">
                <History className="w-4 h-4 mr-2" />
                <span>Total Tasks</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">24 tasks</span>
                <span className="text-sm text-green-400">↑12%</span>
              </div>
            </div>

            <div className="col-span-3 p-4 bg-black/20 rounded-lg border border-white/5">
              <div className="flex items-center text-sm text-gray-400 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                <span>Recent Activity</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary">Created new task "Daily Backup"</span>
                  <span className="text-gray-400">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-400">Updated schedule for "Weekly Report"</span>
                  <span className="text-gray-400">5 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <TeamMemberModal
        member={member}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onRemove={handleRemoveMember}
      />
    </>
  )
}