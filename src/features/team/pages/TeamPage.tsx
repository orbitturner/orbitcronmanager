import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/notiflix'
import { TeamList } from '../components/TeamList'
import { InviteModal } from '../components/InviteModal'
import { NoTeamState } from '../components/NoTeamState'
import { TeamHeader } from '../components/TeamHeader'
import type { TeamMember } from '../types'

export function TeamPage() {
  const [members, setMembers] = React.useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [showInviteModal, setShowInviteModal] = React.useState(false)
  const [hasTeam, setHasTeam] = React.useState(false)

  const fetchMembers = React.useCallback(async () => {
    try {
      setIsLoading(true)

      // Get current user's organization
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { data: orgMember, error: orgError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user?.id)
        .single()

      if (orgError) {
        setHasTeam(false)
        setIsLoading(false)
        return
      }

      setHasTeam(true)

      // Get all members in the organization
      const { data: members, error: membersError } = await supabase
        .from('organization_members')
        .select(`
          user_id,
          role,
          created_at,
          users:user_id (
            email
          )
        `)
        .eq('organization_id', orgMember.organization_id)

      if (membersError) throw membersError

      const formattedMembers = members.map(m => ({
        id: m.user_id,
        email: m.users.email,
        role: m.role,
        created_at: m.created_at,
        organization_id: orgMember.organization_id
      }))

      setMembers(formattedMembers)
    } catch (error) {
      console.error('Error fetching team members:', error)
      toast.error('Failed to fetch team members')
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const filteredMembers = React.useMemo(() => {
    if (!searchQuery) return members
    const query = searchQuery.toLowerCase()
    return members.filter(member => 
      member.email.toLowerCase().includes(query)
    )
  }, [members, searchQuery])

  return (
    <div className="relative min-h-screen space-y-6 lg:space-y-8">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative">
        {/* Header */}
        <TeamHeader hasTeam={hasTeam} />

        {/* Content */}
        {!hasTeam && !isLoading ? (
          <NoTeamState />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search members..."
                  className="w-full pl-10 pr-4 py-2.5 bg-card/50 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-purple-500 text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity shrink-0"
              >
                <Plus className="w-5 h-5" />
                <span>Invite Member</span>
              </button>
            </div>

            <TeamList 
              members={filteredMembers}
              isLoading={isLoading}
              onMembersChange={fetchMembers}
            />

            <InviteModal
              isOpen={showInviteModal}
              onClose={() => setShowInviteModal(false)}
              onSuccess={() => {
                setShowInviteModal(false)
                fetchMembers()
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}