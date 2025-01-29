import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Calendar, Clock, Home, LogOut, Settings, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/notiflix'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Tasks', href: '/tasks', icon: Calendar },
    { name: 'History', href: '/history', icon: Clock },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
  
      if (error) {
        console.error('Sign out error:', error)
        toast.error('Error signing out')
      } else {
        toast.success('Successfully signed out')
        navigate('/auth', { replace: true })
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error)
      toast.error('Unexpected error during sign out')
      navigate('/auth', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar - Now with higher z-index */}
      <div className="w-64 fixed inset-y-0 left-0 bg-background/80 backdrop-blur-xl border-r border-border z-50">
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
            <span className="text-xl font-bold">OCM</span>
          </div>

          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative overflow-hidden group flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'hover:bg-card hover:shadow-md'
                  }`}
                >
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <Icon className={`relative w-5 h-5 ${
                    isActive 
                      ? 'animate-pulse' 
                      : 'group-hover:text-primary transition-colors'
                  }`} />
                  <span className="relative">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-card mt-auto transition-all duration-200 hover:shadow-md group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Main content - With padding for fixed sidebar and lower z-index */}
      <div className="flex-1 ml-64 relative">
        {/* Background gradients */}
        <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        {/* Content */}
        <div className="relative p-8">
          {children}
        </div>
      </div>
    </div>
  )
}