import React from 'react'
import { Github, Facebook, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/notiflix'

export function SocialProviders() {
  const navigate = useNavigate()

  const handleSocialLogin = async (provider: 'github' | 'google' | 'facebook') => {
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
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-transparent text-white/60">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => handleSocialLogin('github')}
          className="flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Github className="w-5 h-5 text-white" />
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('facebook')}
          className="flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Facebook className="w-5 h-5 text-white" />
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('google')}
          className="flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Mail className="w-5 h-5 text-white" />
        </button>
      </div>
    </>
  )
}