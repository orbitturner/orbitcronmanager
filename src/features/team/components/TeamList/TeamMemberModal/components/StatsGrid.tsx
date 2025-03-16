import React from 'react'

interface StatProps {
  icon: React.ReactNode
  label: string
  value: string
  subValue?: string
  subValueColor?: string
  showStatusDot?: boolean
}

interface StatsGridProps {
  stats: StatProps[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="p-4 bg-black/20 rounded-lg border border-white/5"
        >
          <div className="flex items-center text-sm text-gray-400 mb-2">
            {stat.icon}
            <span className="ml-2">{stat.label}</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              {stat.showStatusDot && (
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
              )}
              <span className="font-medium">{stat.value}</span>
            </div>
            {stat.subValue && (
              <span className={`text-sm mt-0.5 ${stat.subValueColor || 'text-gray-400'}`}>
                {stat.subValue}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}