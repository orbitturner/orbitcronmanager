import React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/notiflix'

export function SocialProviders() {
  const navigate = useNavigate()

  const handleSocialLogin = async (provider: 'github' | 'google' | 'gitlab') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
    } catch (error) {
      console.error('Social login error:', error)
      toast.error('Failed to login with social provider')
    }
  }

  return (
    <div className="grid grid-cols-3 gap-2 lg:gap-3">
      <button
        type="button"
        onClick={() => handleSocialLogin('google')}
        className="glass-button px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-white hover:text-white/90 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <svg className="w-4 h-4 lg:w-5 lg:h-5 mx-auto relative z-10" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.607,1.972-2.101,3.467-4.26,3.467c-2.624,0-4.747-2.124-4.747-4.747s2.124-4.747,4.747-4.747c1.112,0,2.134,0.391,2.938,1.037l2.002-2.002C16.725,6.01,14.754,5.151,12.545,5.151c-4.198,0-7.595,3.397-7.595,7.595s3.397,7.595,7.595,7.595c5.276,0,8.838-4.451,8.838-9.731c0-0.528-0.043-1.042-0.122-1.537H12.545V12.151z"/>
        </svg>
      </button>

      <button
        type="button"
        onClick={() => handleSocialLogin('github')}
        className="glass-button px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-white hover:text-white/90 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <svg className="w-4 h-4 lg:w-5 lg:h-5 mx-auto relative z-10" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"/>
        </svg>
      </button>

      <button
        type="button"
        onClick={() => handleSocialLogin('gitlab')}
        className="glass-button px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-white hover:text-white/90 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <svg className="w-4 h-4 lg:w-5 lg:h-5 mx-auto relative z-10" viewBox="0 0 24 24">
          <path fill="currentColor" d="M21.94 13.11l-1.05-3.22c0-.03-.01-.06-.02-.09l-2.11-6.48a.859.859 0 0 0-.8-.57c-.36 0-.68.25-.79.58l-2 6.17H8.84L6.83 3.33a.851.851 0 0 0-.79-.58c-.37 0-.69.25-.8.58L3.13 9.82v.01l-1.05 3.22c-.16.5.01 1.04.44 1.34l9.22 6.71c.17.12.39.12.56 0l9.22-6.71c.43-.3.6-.84.44-1.34M8.15 10.45l2.57 7.91l-6.17-7.91m8.73 7.92l2.47-7.59l.1-.33h3.61l-5.59 7.16m4.1-13.67l1.81 5.56h-3.62m-1.3.95l-1.79 5.51L12 19.24l-2.86-8.79M6.03 3.94L7.84 9.5H4.23m-1.18 4.19c-.09-.07-.13-.19-.09-.29l.79-2.43l5.82 7.45m11.38-4.73l-6.51 4.73l.02-.03l5.79-7.42l.79 2.43c.04.1 0 .22-.09.29"/>
        </svg>
      </button>
    </div>
  )
}