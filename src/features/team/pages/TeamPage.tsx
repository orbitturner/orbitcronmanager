import React from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { TeamMemberList } from '../components/TeamMemberList'
import { TeamOverview } from '../components/TeamOverview'
import { InviteModal } from '../components/InviteModal'
import { NoTeamState } from '../components/NoTeamState'
import { TeamHeader } from '../components/TeamHeader'
import { useTeam } from '../hooks/useTeam'

export function TeamPage() {
  const {
    members,
    isLoading,
    hasTeam,
    error,
    fetchTeamData,
    removeMember,
    updateMemberRole
  } = useTeam()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [showInviteModal, setShowInviteModal] = React.useState(false)

  React.useEffect(() => {
    fetchTeamData()
  }, [fetchTeamData])

  const filteredMembers = React.useMemo(() => {
    if (!searchQuery) return members
    const query = searchQuery.toLowerCase()
    return members.filter(member => 
      member.email.toLowerCase().includes(query)
    )
  }, [members, searchQuery])

  const organizationId = members[0]?.organization_id

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-xl font-semibold text-red-400 mb-4">Something went wrong</h2>
        <p className="text-gray-400 mb-6">{error.message}</p>
        <button
          onClick={() => fetchTeamData()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen">
        {/* Background gradients */}
        <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative space-y-8">
          {/* Header */}
          <TeamHeader 
            hasTeam={hasTeam}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onInvite={() => setShowInviteModal(true)}
          />

          {/* Content */}
          {!hasTeam && !isLoading ? (
            <NoTeamState />
          ) : (
            <div className="space-y-8">
              {/* Team Overview Section */}
              {organizationId && (
                <section className="space-y-6">
                  <h2 className="text-xl font-semibold">Overview</h2>
                  <TeamOverview organizationId={organizationId} />
                </section>
              )}
              
              {/* Team Members Section */}
              <section className="space-y-6">
                <h2 className="text-xl font-semibold">Team Members</h2>
                <TeamMemberList 
                  members={filteredMembers}
                  isLoading={isLoading}
                  onMembersChange={fetchTeamData}
                  onRemoveMember={removeMember}
                  onUpdateRole={updateMemberRole}
                />
              </section>
            </div>
          )}

          {/* Modals */}
          <InviteModal
            isOpen={showInviteModal}
            onClose={() => setShowInviteModal(false)}
            onSuccess={() => {
              setShowInviteModal(false)
              fetchTeamData()
            }}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}