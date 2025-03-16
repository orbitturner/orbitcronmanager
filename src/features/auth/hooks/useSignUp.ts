import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from '@/lib/notiflix'
import { authService } from '../services/auth.service'
import { logError } from '@/lib/errors'
import type { SignUpFormData } from '../types'

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const form = useForm<SignUpFormData>()

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true)
      await authService.signUp({
        email: data.email,
        password: data.password
      })
      toast.success('Account created successfully! Please sign in.')
      navigate('/auth/sign-in')
    } catch (error) {
      logError(error, 'useSignUp.onSubmit')
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit)
  }
}