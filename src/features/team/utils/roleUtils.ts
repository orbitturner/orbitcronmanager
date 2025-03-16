import { Crown, Settings, Shield } from 'lucide-react'

export function getRoleIcon(role: string) {
  switch (role) {
    case 'owner':
      return <Crown className="w-5 h-5 text-yellow-400" />
    case 'admin':
      return <Settings className="w-5 h-5 text-purple-400" />
    default:
      return <Shield className="w-5 h-5 text-primary" />
  }
}

export function getRoleColor(role: string) {
  switch (role) {
    case 'owner':
      return 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/20 text-yellow-400'
    case 'admin':
      return 'from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400'
    default:
      return 'from-primary/20 to-blue-600/5 border-primary/20 text-primary'
  }
}