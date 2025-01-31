import React from 'react'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useSignUp } from '../../hooks/useSignUp'

export function SignUpForm() {
  const { form: { register, formState: { errors } }, isLoading, onSubmit } = useSignUp()
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">First Name</label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              {...register('firstName', { required: 'First name is required' })}
              className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="John"
            />
          </div>
          {errors.firstName && (
            <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Last Name</label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
              className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Doe"
            />
          </div>
          {errors.lastName && (
            <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Username</label>
        <div className="relative">
          <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            {...register('username', { required: 'Username is required' })}
            className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="johndoe"
          />
        </div>
        {errors.username && (
          <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Email</label>
        <div className="relative">
          <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="john@example.com"
          />
        </div>
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Password</label>
        <div className="relative">
          <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
            className="w-full pl-10 pr-12 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
        )}
        <p className="text-gray-500 text-sm mt-1">Minimum length is 8 characters.</p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </button>

      <p className="text-gray-500 text-sm text-center">
        By creating an account, you agree to the{' '}
        <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a>.
        We'll occasionally send you account-related emails.
      </p>
    </form>
  )
}