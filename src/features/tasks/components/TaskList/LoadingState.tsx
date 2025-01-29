import React from 'react';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" style={{ animationDelay: '-0.2s' }} />
      </div>
    </div>
  );
}