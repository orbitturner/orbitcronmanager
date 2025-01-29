import type { User, Session } from '@supabase/supabase-js'

export interface AuthCredentials {
  email: string
  password: string
}

export interface SignInFormData extends AuthCredentials {}

export interface SignUpFormData extends AuthCredentials {
  confirmPassword: string
}

export interface AuthResponse {
  user: User | null
  session: Session | null
}