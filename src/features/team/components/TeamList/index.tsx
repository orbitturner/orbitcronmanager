import React from 'react'
import { motion } from 'framer-motion'
import { TeamMemberCard } from './TeamMemberCard'
import { LoadingState } from './LoadingState'
import type { TeamMember } from '../../types'

interface TeamListProps {
  members: TeamMember[]
  isLoading: boolean
  onMembersChange: () => void
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

export function TeamList({ members, isLoading, onMembersChange }: TeamListProps) {
  if (isLoading) {
    return <LoadingState />
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {members.map((member) => (
        <TeamMemberCard 
          key={member.id} 
          member={member}
          onMembersChange={onMembersChange}
        />
      ))}
    </motion.div>
  )
}