import React from 'react'

export function LoadingState() {
  return (
    <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div 
          key={i}
          className="bg-black/20 rounded-xl p-6 animate-pulse"
        >
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-white/10 rounded-xl" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-white/10 rounded w-3/4" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="h-16 bg-white/10 rounded-lg" />
            <div className="h-16 bg-white/10 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}