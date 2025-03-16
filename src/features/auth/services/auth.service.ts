import { supabase } from '@/lib/supabase'
import { handleSupabaseError } from '@/lib/errors'
import { logActivity } from '@/lib/activity'
import type { AuthCredentials, AuthResponse } from '../types'

export const authService = {
  async signIn({ email, password }: AuthCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Log successful login
      await logActivity('login', { email }, {
        type: 'auth',
        category: 'login',
        status: 'success'
      })

      return { user: data.user, session: data.session }
    } catch (error) {
      // Log failed login attempt
      await logActivity('login', { email, error: error.message }, {
        type: 'auth',
        category: 'login',
        status: 'failure'
      })

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

      // Log successful signup
      await logActivity('user.signup', { email }, {
        type: 'auth',
        category: 'create',
        status: 'success'
      })

      return { user: data.user, session: data.session }
    } catch (error) {
      // Log failed signup attempt
      await logActivity('user.signup', { email, error: error.message }, {
        type: 'auth',
        category: 'create',
        status: 'failure'
      })

      throw handleSupabaseError(error)
    }
  },

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Log successful logout
      await logActivity('logout', null, {
        type: 'auth',
        category: 'logout',
        status: 'success'
      })
    } catch (error) {
      // Log failed logout attempt
      await logActivity('logout', { error: error.message }, {
        type: 'auth',
        category: 'logout',
        status: 'failure'
      })

      throw handleSupabaseError(error)
    }
  }
}