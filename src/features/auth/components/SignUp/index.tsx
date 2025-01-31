import React from 'react'
import { Link } from 'react-router-dom'
import { SignUpForm } from './Form'
import { SocialProviders } from '../SocialProviders'

export function SignUp() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Register with</h2>
        <SocialProviders />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-gray-400">Or continue with</span>
        </div>
      </div>

      <SignUpForm />

      <div className="text-center text-sm">
        <span className="text-gray-400">Already have an account? </span>
        <Link to="/auth/sign-in" className="text-primary hover:text-primary/80">
          Login
        </Link>
      </div>
    </div>
  )
}