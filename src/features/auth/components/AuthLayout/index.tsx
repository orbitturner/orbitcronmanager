import React from 'react'
import { motion } from 'framer-motion'
import { Testimonials } from './Testimonials'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-primary to-pink-500 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 bg-black/20 backdrop-blur-lg rounded-2xl p-8"
      >
        {/* Left side - Auth form */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg"></div>
            <span className="text-2xl font-bold text-white">OCM</span>
          </div>

          {children}
        </div>

        {/* Right side - Testimonials */}
        <div className="hidden lg:block">
          <Testimonials />
        </div>
      </motion.div>
    </div>
  )
}