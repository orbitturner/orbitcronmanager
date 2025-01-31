import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Calendar, Clock, Home, LogOut, Menu, Settings, Users, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/notiflix'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

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
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 fixed inset-y-0 left-0 bg-background/80 backdrop-blur-xl border-r border-border z-50">
        <div className="h-full flex flex-col p-4 w-full">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
            <span className="text-xl font-bold">OCM</span>
          </div>

          <nav className="flex-1 space-y-1 w-full">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative overflow-hidden group flex items-center w-full space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'hover:bg-card hover:shadow-md'
                  }`}
                >
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
            className="flex items-center w-full space-x-2 px-3 py-2 rounded-lg hover:bg-card mt-auto transition-all duration-200 hover:shadow-md group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border z-50">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
            <span className="text-xl font-bold">OCM</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-xl"
          >
            <div className="pt-20 p-4">
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`relative overflow-hidden group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                          : 'hover:bg-card hover:shadow-md'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Icon className={`relative w-6 h-6 ${
                        isActive 
                          ? 'animate-pulse' 
                          : 'group-hover:text-primary transition-colors'
                      }`} />
                      <span className="relative text-lg">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>

              <button
                onClick={handleSignOut}
                className="w-full mt-8 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-card hover:bg-card/80 transition-colors group"
              >
                <LogOut className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span className="text-lg">Sign out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <div className="min-h-screen pt-20 lg:pt-0 px-4 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  )
}