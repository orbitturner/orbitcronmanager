export interface TeamMember {
  id: string
  email: string
  created_at: string
  last_active_at: string
  role: 'owner' | 'admin' | 'member'
  organization_id: string
  organization_name: string
}

export interface Organization {
  id: string
  name: string
  created_at: string
}

export interface TeamStats {
  totalMembers: number
  activeMembers: number
  totalTasks: number
}