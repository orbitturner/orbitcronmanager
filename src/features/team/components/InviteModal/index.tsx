import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { supabase } from '@/lib/supabase'
import { toast } from '@/lib/notiflix'
import { EmailPills } from '@/components/EmailPills'
import { activityService } from '../../services/activity.service'

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

      // Get current user's organization
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { data: member, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()

      if (memberError) throw memberError

      // Parse email list
      const emailList = data.emails.split(',').map(email => email.trim()).filter(Boolean)

      // Create invitations
      const { error: inviteError } = await supabase
        .from('team_invitations')
        .insert(emailList.map(email => ({
          organization_id: member.organization_id,
          email,
          invited_by: user.id,
          message: data.message || null,
          status: 'pending'
        })))

      if (inviteError) throw inviteError

      // Log activity for each invitation
      await activityService.createActivity(member.organization_id, 'member_invited', {
        invited_emails: emailList,
        invited_by: user.email,
        message: data.message || undefined
      })

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
              <div className="relative bg-background/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl">
                {/* Header */}
                <div className="relative overflow-hidden border-b border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5" />
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                  
                  <div className="relative p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold">Invite Team Members</h2>
                          <p className="text-sm text-gray-400 mt-1">
                            Invite colleagues to collaborate
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
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