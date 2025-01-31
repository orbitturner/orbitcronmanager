import React from 'react'
import { motion } from 'framer-motion'
import { SignInForm } from './Form'
import { SocialProviders } from '../SocialProviders'
import { LogIn } from 'lucide-react'

export function SignIn() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6">
          <LogIn className="w-6 h-6 text-gray-800" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Sign in with email
        </h2>
        <p className="text-gray-500 mt-2">
          Make a new doc to bring your words, data,<br />
          and teams together. For free
        </p>
      </div>

      <SignInForm />
      <SocialProviders />
    </div>
  )
}