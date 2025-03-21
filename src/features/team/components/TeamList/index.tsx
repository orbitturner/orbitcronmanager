import React from 'react'
import { motion } from 'framer-motion'
import { TeamMemberCard } from './TeamMemberCard'
import { LoadingState } from './LoadingState'
import type { TeamMember } from '../../types'

interface TeamListProps {
  members: TeamMember[]
  isLoading: boolean
  onMembersChange: () => void
  onRemoveMember: (id: string) => Promise<void>
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

export function TeamList({ members, isLoading, onMembersChange, onRemoveMember }: TeamListProps) {
  if (isLoading) {
    return <LoadingState />
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
        />
      ))}
    </motion.div>
  )
}