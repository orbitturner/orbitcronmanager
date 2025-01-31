export interface TeamMember {
  id: string
  email: string
  created_at: string
  role: 'owner' | 'admin' | 'member'
  status?: string
  organization_id: string
}

export interface Organization {
  id: string
  name: string
  created_at: string
}