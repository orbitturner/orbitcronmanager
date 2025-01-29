import React from 'react'
import { motion } from 'framer-motion'
import { SignInForm } from './Form'
import { SocialProviders } from '../SocialProviders'

export function SignIn() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
        <p className="text-white/80">Please enter your account details</p>
      </div>

      <SignInForm />
      <SocialProviders />
    </div>
  )
}