import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/notiflix'

interface CreateTeamModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  name: string
}

export function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert([{ name: data.name }])
        .select()
        .single()

      if (orgError) throw orgError

      // Add user as owner
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert([{
          organization_id: org.id,
          user_id: user?.id,
          role: 'owner'
        }])

      if (memberError) throw memberError

      toast.success('Team created successfully')
      onClose()
      window.location.reload() // Refresh to update UI
    } catch (error) {
      console.error('Error creating team:', error)
      toast.error('Failed to create team')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block w-full max-w-md my-8 text-left align-middle transition-all transform"
            >
              <div className="relative bg-background rounded-xl shadow-xl">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h2 className="text-xl font-semibold">Create New Team</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-card rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Team Name</label>
                    <input
                      {...register('name', { required: 'Team name is required' })}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter team name..."
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Creating...' : 'Create Team'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}