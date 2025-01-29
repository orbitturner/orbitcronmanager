import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/notiflix'
import type { Session } from '@supabase/supabase-js'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchSession = async () => {
      try {
        // Récupération de la session initiale
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error fetching session:', error.message)
          toast.error('Failed to retrieve session')
        }

        if (isMounted) {
          setSession(data.session)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Unexpected error during session fetch:', error)
        if (isMounted) setIsLoading(false)
      }
    }

    fetchSession()

    // Écoute des changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSession(session)
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { session, isLoading }
}
