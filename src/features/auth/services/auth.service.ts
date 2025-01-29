import { supabase } from '@/lib/supabase'
import { handleSupabaseError } from '@/lib/errors'
import type { AuthCredentials, AuthResponse } from '../types'

export const authService = {
  async signIn({ email, password }: AuthCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { user: data.user, session: data.session }
    } catch (error) {
      throw handleSupabaseError(error)
    }
  },

  async signUp({ email, password }: AuthCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) throw error

      return { user: data.user, session: data.session }
    } catch (error) {
      throw handleSupabaseError(error)
    }
  },

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      throw handleSupabaseError(error)
    }
  }
}