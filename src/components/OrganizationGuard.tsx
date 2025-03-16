import React from 'react'
import { useTeam } from '@/features/team/hooks/useTeam'
import { NoTeamState } from '@/features/team/components/NoTeamState'

interface OrganizationGuardProps {
  children: React.ReactNode
}

export function OrganizationGuard({ children }: OrganizationGuardProps) {
  const { hasTeam, isLoading } = useTeam()

  if (isLoading || hasTeam === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" style={{ animationDelay: '-0.2s' }} />
        </div>
      </div>
    )
  }

  if (!hasTeam) {
    return (
      <div className="container mx-auto px-4 py-8">
        <NoTeamState />
      </div>
    )
  }

  return <>{children}</>
}