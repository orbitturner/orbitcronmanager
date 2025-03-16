import React from 'react'
import { X } from 'lucide-react'
import { getRoleIcon, getRoleColor } from '../../../utils/roleUtils'
import type { TeamMember } from '../../../types'

interface ModalHeaderProps {
  member: TeamMember
  onClose: () => void
  activeTab: string
  tabs: { id: string; label: string }[]
  onTabChange: (tab: any) => void
}

export function ModalHeader({ member, onClose, activeTab, tabs, onTabChange }: ModalHeaderProps) {
  return (
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
              <div className={`inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs font-medium bg-gradient-to-r ${getRoleColor(member.role)} border`}>
                {getRoleIcon(member.role)}
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
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}