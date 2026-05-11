import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'motion/react'
import api from '../../lib/api.js'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'

export default function PatientMilestones() {
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState(null)
  const [notes, setNotes] = useState('')

  const milestonesQuery = useQuery({
    queryKey: ['patient-milestones'],
    queryFn: async () => {
      const res = await api.get('/patient/milestones')
      return res.data || []
    },
  })

  const progressMutation = useMutation({
    mutationFn: async payload => {
      const res = await api.post('/patient/progress', payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-milestones'] })
      queryClient.invalidateQueries({ queryKey: ['patient-dashboard'] })
      setSelected(null)
      setNotes('')
    },
  })

  const submit = e => {
    e.preventDefault()
    if (!selected?.id) return
    progressMutation.mutate({ milestone_id: selected.id, notes })
  }

  const milestones = milestonesQuery.data || []

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-[var(--cream)] border border-[var(--borderSoft)] shadow-lg p-6">
        <h2 className="serif-heading text-3xl">Milestones</h2>
        <p className="mt-2 text-[var(--textSoft)]">Track your recovery journey day by day.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {milestones.map(milestone => (
          <motion.div
            key={milestone.id}
            className="rounded-[32px] bg-white/80 border border-[var(--borderSoft)] shadow-lg p-6 hover:-translate-y-1 transition-all duration-500"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-sm text-[var(--textSoft)]">Day {milestone.due_day}</div>
            <div className="serif-heading text-2xl text-[var(--textDark)] mt-2">{milestone.title}</div>
            <p className="mt-2 text-[var(--textSoft)]">{milestone.description || 'Recovery milestone'}</p>
            {milestone.completed && (
              <div className="mt-3 text-xs text-[var(--primaryGreen)]">Completed</div>
            )}

            <div className="mt-4">
              <Button onClick={() => setSelected(milestone)} disabled={milestone.completed}>
                {milestone.completed ? 'Completed' : 'Mark Complete'}
              </Button>
            </div>
          </motion.div>
        ))}

        {milestones.length === 0 && (
          <div className="rounded-[32px] bg-white/80 border border-[var(--borderSoft)] shadow-lg p-8 text-[var(--textSoft)]">
            No milestones assigned yet. Your doctor will create your recovery plan soon.
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="max-w-xl w-full rounded-[40px] bg-white p-8 shadow-2xl border border-[var(--borderSoft)]">
            <div className="flex items-center justify-between">
              <h3 className="serif-heading text-3xl">Complete Milestone</h3>
              <button type="button" className="text-[var(--textSoft)]" onClick={() => setSelected(null)}>Close</button>
            </div>
            <p className="mt-2 text-[var(--textSoft)]">Add a short note about your progress.</p>

            <form className="mt-6 space-y-4" onSubmit={submit}>
              <Input placeholder="Optional notes" value={notes} onChange={e => setNotes(e.target.value)} />
              <Button type="submit" className="w-full" disabled={progressMutation.isPending}>
                {progressMutation.isPending ? 'Saving...' : 'Mark Complete'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
