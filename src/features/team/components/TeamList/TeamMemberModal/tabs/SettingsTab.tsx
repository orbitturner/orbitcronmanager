import React from 'react'
import { motion } from 'framer-motion'
import { getRoleIcon, getRoleColor } from '../../../../utils/roleUtils'
import type { TeamMember } from '../../../../types'

interface SettingsTabProps {
  member: TeamMember
  onRemove: () => Promise<void>
}

export function SettingsTab({ member, onRemove }: SettingsTabProps) {
  const [isRemoving, setIsRemoving] = React.useState(false)

  const handleRemove = async () => {
    try {
      setIsRemoving(true)
      await onRemove()
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Role & Permissions</h3>
        <div className="p-4 bg-black/20 rounded-lg border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium mb-1">Current Role</p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRoleColor(member.role)} border`}>
                {getRoleIcon(member.role)}
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
          <NotificationToggle label="Email Notifications" defaultChecked />
          <NotificationToggle label="Task Execution Alerts" defaultChecked />
          <NotificationToggle label="System Updates" />
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
    </motion.div>
  )
}

interface NotificationToggleProps {
  label: string
  defaultChecked?: boolean
}

function NotificationToggle({ label, defaultChecked }: NotificationToggleProps) {
  return (
    <label className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <input 
        type="checkbox" 
        className="rounded border-white/20 bg-white/10" 
        defaultChecked={defaultChecked} 
      />
    </label>
  )
}