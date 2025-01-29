import React from 'react'
import { motion } from 'framer-motion'
import { SignUpForm } from './Form'
import { SocialProviders } from '../SocialProviders'

export function SignUp() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Create an account</h2>
        <p className="text-white/80">Join us to start managing your tasks</p>
      </div>

      <SignUpForm />
      <SocialProviders />
    </div>
  )
}