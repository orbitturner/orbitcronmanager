import React from 'react';
import { Power, Loader2 } from 'lucide-react';

interface StatusBadgeProps {
  state: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  onToggle: () => void;
  isTogglingState: boolean;
}

export function StatusBadge({ state, onToggle, isTogglingState }: StatusBadgeProps) {
  return (
    <button
      onClick={onToggle}
      disabled={isTogglingState}
      className={`relative px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
        state === 'ACTIVE' 
          ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
          : 'bg-gray-500/10 text-gray-400 border border-gray-500/20 hover:bg-gray-500/20'
      }`}
    >
      {isTogglingState ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <span className="relative z-10">{state}</span>
          <Power className={`w-3 h-3 ml-1 inline-block transition-transform ${
            state === 'ACTIVE' ? 'rotate-0' : 'rotate-180'
          }`} />
        </>
      )}
    </button>
  );
}