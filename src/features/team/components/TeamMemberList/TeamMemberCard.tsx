import React from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  MoreVertical, 
  UserMinus, 
  UserPlus,
  MessageSquare,
  ExternalLink,
  Shield,
  Settings,
  Crown
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { useClickOutside } from '@/hooks/useClickOutside'
import { toast } from '@/lib/notiflix'
import type { TeamMember } from '../../types'

interface TeamMemberCardProps {
  member: TeamMember
  onMembersChange: () => void
  onRemoveMember: (id: string) => Promise<void>
  onUpdateRole: (id: string, role: 'admin' | 'member') => Promise<void>
}

export function TeamMemberCard({ 
  member, 
  onMembersChange, 
  onRemoveMember,
  onUpdateRole 
}: TeamMemberCardProps) {
  const [showMenu, setShowMenu] = React.useState(false)
  const [isRemoving, setIsRemoving] = React.useState(false)
  const [isUpdatingRole, setIsUpdatingRole] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  useClickOutside(menuRef, () => setShowMenu(false))

  const handleRemoveMember = async () => {
    try {
      setIsRemoving(true)
      await onRemoveMember(member.id)
      onMembersChange()
      toast.success('Member removed successfully')
    } catch (error) {
      toast.error('Failed to remove member')
    } finally {
      setIsRemoving(false)
      setShowMenu(false)
    }
  }

  const handleRoleUpdate = async (role: 'admin' | 'member') => {
    try {
      setIsUpdatingRole(true)
      await onUpdateRole(member.id, role)
      onMembersChange()
      toast.success('Role updated successfully')
    } catch (error) {
      toast.error('Failed to update role')
    } finally {
      setIsUpdatingRole(false)
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 group"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          {/* Member Info */}
          <div className="flex items-start space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/10">
                <span className="text-2xl font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  {member.email[0].toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-card" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium">{member.email}</h3>
              <div className={`inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs font-medium bg-gradient-to-r ${getRoleColor()} border`}>
                {getRoleIcon()}
                <span className="ml-1.5">
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
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
                    
                    {member.role === 'member' ? (
                      <button
                        onClick={() => handleRoleUpdate('admin')}
                        disabled={isUpdatingRole}
                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
                      >
                        <UserPlus className="w-4 h-4 mr-3" />
                        <span>{isUpdatingRole ? 'Updating...' : 'Make Admin'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRoleUpdate('member')}
                        disabled={isUpdatingRole}
                        className="flex items-center w-full px-4 py-2 text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
                      >
                        <Shield className="w-4 h-4 mr-3" />
                        <span>{isUpdatingRole ? 'Updating...' : 'Remove Admin'}</span>
                      </button>
                    )}

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

        {/* Member Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-3 bg-black/20 rounded-lg">
            <span className="text-sm text-gray-400">Member Since</span>
            <p className="font-medium mt-1">
              {formatDistanceToNow(new Date(member.created_at), { addSuffix: true })}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg">
            <span className="text-sm text-gray-400">Last Active</span>
            <p className="font-medium mt-1">
              {formatDistanceToNow(new Date(member.last_active_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}