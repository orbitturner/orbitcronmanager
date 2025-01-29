import React from 'react'

export function Testimonials() {
  return (
    <div className="bg-black/40 rounded-xl p-6 h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white mb-6">What's our Users Said.</h2>
        
        <blockquote className="mb-8">
          <p className="text-lg text-white/90 mb-4">
            "Managing cron jobs has never been easier. This platform saves me hours every week and helps me stay on top of all my scheduled tasks."
          </p>
          <footer className="text-white">
            <p className="font-medium">Sarah Chen</p>
            <p className="text-sm text-white/60">DevOps Engineer at Stripe</p>
          </footer>
        </blockquote>

        <div className="absolute bottom-6 right-6">
          <div className="flex -space-x-2">
            <img
              className="w-8 h-8 rounded-full border-2 border-white"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces"
              alt="User"
            />
            <img
              className="w-8 h-8 rounded-full border-2 border-white"
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=faces"
              alt="User"
            />
            <img
              className="w-8 h-8 rounded-full border-2 border-white"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces"
              alt="User"
            />
          </div>
        </div>
      </div>
    </div>
  )
}