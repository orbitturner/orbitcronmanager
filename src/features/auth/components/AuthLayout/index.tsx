import React from 'react'
import { motion } from 'framer-motion'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left side with features - Hidden on mobile, flex on lg */}
      <div className="hidden lg:flex lg:flex-col lg:w-1/2 p-4 md:p-8 lg:p-12 relative overflow-hidden">
        {/* Animated gradient blobs - Adjusted for better mobile display */}
        <div className="absolute top-0 -left-4 w-64 md:w-96 h-64 md:h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-[64px] opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-64 md:w-96 h-64 md:h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-[64px] opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 md:w-96 h-64 md:h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-[64px] opacity-70 animate-blob animation-delay-4000"></div>

        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 backdrop-blur-[120px]"></div>

        <div className="relative">
          {/* Logo - Responsive sizing */}
          <div className="flex items-center space-x-3 mb-8 lg:mb-16">
            <div className="w-8 h-8 lg:w-10 lg:h-10 glass-card rounded-xl flex items-center justify-center">
              <div className="w-4 h-4 lg:w-6 lg:h-6 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-lg"></div>
            </div>
            <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              OCM
            </span>
          </div>

          {/* Title - Responsive text sizes */}
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight">
            Start your 30-day<br />free trial today
          </h1>
          <p className="text-base lg:text-lg text-gray-300 mb-8 lg:mb-12">No credit card required</p>

          {/* Features - Responsive spacing */}
          <div className="space-y-6 lg:space-y-8">
            <Feature
              icon="👥"
              title="Invite unlimited colleagues"
              description="Integrate with guaranteed developer-friendly APIs or openly to choose a build-ready or low-code solution."
            />
            <Feature
              icon="✅"
              title="Ensure compliance"
              description="Receive detailed insights on all your numbers in real-time, see where visitors are coming from."
            />
            <Feature
              icon="🔒"
              title="Built-in security"
              description="Keep your team members and customers in the loop by sharing your dashboard public."
            />
          </div>
        </div>
      </div>

      {/* Mobile Logo - Only visible on small screens */}
      <div className="lg:hidden flex items-center justify-center p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 glass-card rounded-xl flex items-center justify-center">
            <div className="w-4 h-4 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-lg"></div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            OCM
          </span>
        </div>
      </div>

      {/* Right side with form - Full width on mobile */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-xl lg:rounded-2xl p-6 lg:p-8 relative overflow-hidden">
            {/* Inner gradient effects - Adjusted for mobile */}
            <div className="absolute top-0 right-0 w-24 lg:w-32 h-24 lg:h-32 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 lg:w-32 h-24 lg:h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
            
            {/* Content */}
            <div className="relative">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Feature({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="glass-card w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl shrink-0">
        <span className="text-xl lg:text-2xl">{icon}</span>
      </div>
      <div>
        <h3 className="text-white font-medium mb-1 lg:mb-2">{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}