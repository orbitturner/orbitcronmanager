import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/notiflix'
import { EmailPills } from '@/components/EmailPills'

interface InviteModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface FormData {
  emails: string
  message: string
}

export function InviteModal({ isOpen, onClose, onSuccess }: InviteModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      
      // Simuler l'envoi d'invitations
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Invitations sent successfully')
      onSuccess()
    } catch (error) {
      console.error('Error sending invitations:', error)
      toast.error('Failed to send invitations')
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
              className="inline-block w-full max-w-xl my-8 text-left align-middle transition-all transform"
            >
              <div className="relative bg-background rounded-xl shadow-xl">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h2 className="text-xl font-semibold">Invite Team Members</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-card rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Addresses</label>
                    <div className="bg-black/20 rounded-lg p-1">
                      <EmailPills
                        value={control._formValues.emails}
                        onChange={(value) => control._formValues.emails = value}
                        placeholder="Enter email addresses..."
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Press Enter or comma to add multiple emails</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Personal Message (Optional)</label>
                    <textarea
                      {...register('message')}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      rows={4}
                      placeholder="Add a personal message to your invitation..."
                    />
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
                      {isSubmitting ? 'Sending...' : 'Send Invitations'}
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