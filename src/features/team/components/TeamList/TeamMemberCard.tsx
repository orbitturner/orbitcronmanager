import React from 'react'
import { motion } from 'framer-motion'
import { Mail, MoreVertical, Shield, UserMinus, Crown, Settings, Calendar, Activity } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/notiflix'
import { format } from 'date-fns'
import type { TeamMember } from '../../types'

interface TeamMemberCardProps {
  member: TeamMember
  onMembersChange: () => void
}

export function TeamMemberCard({ member, onMembersChange }: TeamMemberCardProps) {
  const [showMenu, setShowMenu] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRemoveMember = async () => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('user_id', member.id)

      if (error) throw error

      toast.success('Member removed successfully')
      onMembersChange()
    } catch (error) {
      console.error('Error removing member:', error)
      toast.error('Failed to remove member')
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
        return 'text-yellow-400'
      case 'admin':
        return 'text-purple-400'
      default:
        return 'text-primary'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 group h-[250px]"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />
      
      <div className="relative h-full flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-semibold text-primary">
                {member.email[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-lg truncate max-w-[200px]">{member.email}</h3>
              <div className="flex items-center text-sm mt-2">
                {getRoleIcon()}
                <span className={`ml-2 ${getRoleColor()} font-medium`}>
                  {member.role?.charAt(0).toUpperCase() + member.role?.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-white/10 rounded-lg shadow-xl z-10">
                <button
                  onClick={() => window.location.href = `mailto:${member.email}`}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </button>
                {member.role !== 'owner' && (
                  <button
                    onClick={handleRemoveMember}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <UserMinus className="w-4 h-4 mr-2" />
                    Remove Member
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="p-4 bg-black/20 rounded-lg">
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Joined</span>
            </div>
            <p className="font-medium">
              {format(new Date(member.created_at), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="p-4 bg-black/20 rounded-lg">
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <Activity className="w-4 h-4 mr-2" />
              <span>Status</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2" />
              <span className="font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}