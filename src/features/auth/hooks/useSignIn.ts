import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from '@/lib/notiflix'
import { authService } from '../services/auth.service'
import { logError } from '@/lib/errors'
import type { SignInFormData } from '../types'

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const form = useForm<SignInFormData>()

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true)
      await authService.signIn(data)
      toast.success('Successfully signed in')
      navigate('/')
    } catch (error) {
      logError(error, 'useSignIn.onSubmit')
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