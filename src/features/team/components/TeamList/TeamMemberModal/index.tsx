import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { ModalHeader } from './ModalHeader'
import { OverviewTab } from './tabs/OverviewTab'
import { ActivityTab } from './tabs/ActivityTab'
import { SettingsTab } from './tabs/SettingsTab'
import type { TeamMember } from '../../../types'

interface TeamMemberModalProps {
  member: TeamMember
  isOpen: boolean
  onClose: () => void
  onRemove: () => Promise<void>
}

type TabType = 'overview' | 'activity' | 'settings'

export function TeamMemberModal({ member, isOpen, onClose, onRemove }: TeamMemberModalProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('overview')

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity Log' },
    { id: 'settings', label: 'Settings' }
  ]

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
                <ModalHeader 
                  member={member} 
                  onClose={onClose}
                  activeTab={activeTab}
                  tabs={tabs}
                  onTabChange={setActiveTab}
                />

                {/* Content */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                      <OverviewTab key="overview" member={member} />
                    )}
                    {activeTab === 'activity' && (
                      <ActivityTab key="activity" />
                    )}
                    {activeTab === 'settings' && (
                      <SettingsTab 
                        key="settings" 
                        member={member} 
                        onRemove={onRemove} 
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}