import React from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { Mail, Clock, X, Check, AlertTriangle } from 'lucide-react'
import { useTeamInvitations } from '../../hooks/useTeamInvitations'
import { LoadingState } from './LoadingState'

interface TeamInvitationsProps {
  organizationId: string
}

export function TeamInvitations({ organizationId }: TeamInvitationsProps) {
  const { 
    invitations, 
    isLoading, 
    error,
    cancelInvitation,
    resendInvitation
  } = useTeamInvitations(organizationId)

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        <p className="mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!invitations.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center"
      >
        <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-300 mb-2">No Pending Invitations</h3>
        <p className="text-gray-400 text-sm">
          When you invite team members, they'll appear here until they accept.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {invitations.map((invitation) => (
        <motion.div
          key={invitation.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-white/10">
                <span className="text-lg font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  {invitation.email[0].toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-medium">{invitation.email}</h3>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>
                    Invited {formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {new Date(invitation.expires_at) < new Date() ? (
                <div className="flex items-center text-yellow-400">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  <span className="text-sm">Expired</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => resendInvitation(invitation.id)}
                    className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                    title="Resend Invitation"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => cancelInvitation(invitation.id)}
                    className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                    title="Cancel Invitation"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {invitation.message && (
            <div className="mt-3 p-3 bg-black/40 rounded-lg">
              <p className="text-sm text-gray-400">{invitation.message}</p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}