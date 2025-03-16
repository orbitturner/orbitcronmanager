import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useSignUp } from '../../hooks/useSignUp'

export function SignUpForm() {
  const { form: { register, formState: { errors }, watch }, isLoading, onSubmit } = useSignUp()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const password = watch('password')

  return (
    <form onSubmit={onSubmit} className="space-y-4 lg:space-y-6">
      <div>
        <div className="relative">
          <Mail className="w-5 h-5 absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="w-full pl-10 lg:pl-12 pr-4 py-2.5 lg:py-3 glass-input rounded-lg lg:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm lg:text-base"
            placeholder="Email"
          />
        </div>
        {errors.email && (
          <p className="text-red-400 text-xs lg:text-sm mt-1.5">{errors.email.message}</p>
        )}
      </div>

      <div>
        <div className="relative">
          <Lock className="w-5 h-5 absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            className="w-full pl-10 lg:pl-12 pr-12 py-2.5 lg:py-3 glass-input rounded-lg lg:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm lg:text-base"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 lg:w-5 h-4 lg:h-5" /> : <Eye className="w-4 lg:w-5 h-4 lg:h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-xs lg:text-sm mt-1.5">{errors.password.message}</p>
        )}
      </div>

      <div>
        <div className="relative">
          <Lock className="w-5 h-5 absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
            className="w-full pl-10 lg:pl-12 pr-12 py-2.5 lg:py-3 glass-input rounded-lg lg:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm lg:text-base"
            placeholder="Confirm Password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-4 lg:w-5 h-4 lg:h-5" /> : <Eye className="w-4 lg:w-5 h-4 lg:h-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-400 text-xs lg:text-sm mt-1.5">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 lg:py-3 rounded-lg lg:rounded-xl font-medium disabled:opacity-50 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity text-sm lg:text-base"
      >
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </button>

      <p className="text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link 
          to="/auth/sign-in"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}