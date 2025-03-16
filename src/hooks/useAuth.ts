import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/notiflix'
import type { Session } from '@supabase/supabase-js'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const fetchSession = async () => {
      try {
        // Get initial session
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error fetching session:', error.message)
          toast.error('Failed to retrieve session')
          navigate('/auth/sign-in')
        }

        if (isMounted) {
          setSession(data.session)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Unexpected error during session fetch:', error)
        if (isMounted) {
          setIsLoading(false)
          navigate('/auth/sign-in')
        }
      }
    }

    fetchSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSession(session)
        setIsLoading(false)
        
        // If session is null (expired/invalid), redirect to sign in
        if (!session) {
          toast.info('Session expired. Please sign in again.')
          navigate('/auth/sign-in')
        }
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [navigate])

  return { session, isLoading }
}