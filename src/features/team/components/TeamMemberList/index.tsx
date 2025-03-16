import React from 'react'
import { motion } from 'framer-motion'
import { TeamMemberCard } from './TeamMemberCard'
import { LoadingState } from './LoadingState'
import type { TeamMember } from '../../types'

interface TeamMemberListProps {
  members: TeamMember[]
  isLoading: boolean
  onMembersChange: () => void
  onRemoveMember: (id: string) => Promise<void>
  onUpdateRole: (id: string, role: 'admin' | 'member') => Promise<void>
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export function TeamMemberList({ 
  members, 
  isLoading, 
  onMembersChange, 
  onRemoveMember,
  onUpdateRole 
}: TeamMemberListProps) {
  if (isLoading) {
    return <LoadingState />
  }

  if (!members.length) {
    return (
      <div className="text-center py-8 text-gray-400">
        No team members found
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3"
    >
      {members.map((member) => (
        <TeamMemberCard 
          key={member.id} 
          member={member}
          onMembersChange={onMembersChange}
          onRemoveMember={onRemoveMember}
          onUpdateRole={onUpdateRole}
        />
      ))}
    </motion.div>
  )
}