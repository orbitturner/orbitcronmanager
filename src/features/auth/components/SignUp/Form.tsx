import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'
import { useSignUp } from '../../hooks/useSignUp'

export function SignUpForm() {
  const { form: { register, formState: { errors } }, isLoading, onSubmit } = useSignUp()

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Email
        </label>
        <div className="relative">
          <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-white/50"
            placeholder="Enter your email"
          />
        </div>
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <input
            type="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-white/50"
            placeholder="••••••••"
          />
        </div>
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <input
            type="password"
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: (value) => value === register('password').value || 'Passwords do not match'
            })}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-white/50"
            placeholder="••••••••"
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Link 
          to="/auth/sign-in"
          className="text-sm text-white hover:text-primary transition-colors"
        >
          Already have an account?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  )
}