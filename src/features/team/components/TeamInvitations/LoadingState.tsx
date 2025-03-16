import React from 'react'

export function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div 
          key={i}
          className="bg-black/20 rounded-xl p-4 animate-pulse"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/10 rounded w-1/3" />
              <div className="h-3 bg-white/10 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}