import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import api from '../../lib/api.js'

const formatDate = value => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
const formatTime = value => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function PatientDashboard() {
  const dashboardQuery = useQuery({
    queryKey: ['patient-dashboard'],
    queryFn: async () => {
      const res = await api.get('/patient/dashboard')
      return res.data
    },
  })

  const milestonesQuery = useQuery({
    queryKey: ['patient-milestones'],
    queryFn: async () => {
      const res = await api.get('/patient/milestones')
      return res.data.milestones || []
    },
  })

  const appointmentsQuery = useQuery({
    queryKey: ['patient-appointments'],
    queryFn: async () => {
      const res = await api.get('/patient/appointments')
      return res.data || []
    },
  })

  const feedbackQuery = useQuery({
    queryKey: ['patient-feedback'],
    queryFn: async () => {
      const res = await api.get('/patient/feedback')
      return res.data
    },
  })

  const dashboard = dashboardQuery.data
  const patient = dashboard?.patient
  const doctor = patient?.doctor?.user
  const program = patient?.program
  const progress = dashboard?.completion_percent ?? 0
  const totalMilestones = dashboard?.total_milestones ?? 0
  const completedMilestones = dashboard?.completed_milestones ?? 0

  const milestones = milestonesQuery.data || []
  const nextMilestone = milestones.find(m => m.status !== 'Completed')

  const upcoming = (appointmentsQuery.data || []).find(a => a.status === 'pending' || a.status === 'confirmed')
  const motivation = feedbackQuery.data?.tips?.[0]

  const isLoading = dashboardQuery.isLoading

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <motion.div
          className="rounded-[40px] bg-[var(--cream)] border border-[var(--borderSoft)] shadow-lg p-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="text-sm text-[var(--textSoft)]">Recovery Progress</div>
          {isLoading ? (
            <div className="mt-4 h-8 w-48 rounded-full bg-white/70 animate-pulse" />
          ) : (
            <div className="serif-heading text-5xl text-[var(--textDark)] mt-2">{progress}% Completed</div>
          )}
          <p className="mt-4 text-lg text-[var(--textSoft)]">
            {totalMilestones > 0
              ? `You have completed ${completedMilestones} of ${totalMilestones} milestones.`
              : 'Your recovery plan will appear here once assigned.'}
          </p>
          <div className="mt-6 h-3 rounded-full bg-white/70 overflow-hidden">
            <div className="h-full bg-[var(--primaryGreen)] transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </motion.div>

        <motion.div
          className="rounded-[40px] bg-white/80 border border-[var(--borderSoft)] shadow-lg p-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="text-sm text-[var(--textSoft)]">Current Program</div>
          {program ? (
            <>
              <div className="serif-heading text-3xl text-[var(--textDark)] mt-2">
                {program.name}
              </div>
              <p className="mt-3 text-[var(--textSoft)]">
                {dashboard?.program_duration ? `${dashboard.program_duration} Day Program` : 'Assigned program'}
              </p>
            </>
          ) : (
            <div className="mt-3 text-[var(--textSoft)]">No program assigned yet.</div>
          )}
          <div className="mt-6 rounded-[24px] bg-[var(--softLime)] px-4 py-3 text-sm text-[var(--textDark)]">
            {doctor ? `Assigned doctor: ${doctor.name}` : 'Doctor assignment pending.'}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="rounded-[32px] bg-white/80 border border-[var(--borderSoft)] shadow-lg p-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-sm text-[var(--textSoft)]">Today's Milestone</div>
          <div className="serif-heading text-2xl text-[var(--textDark)] mt-2">
            {nextMilestone ? (
               nextMilestone.is_available_today ? (
                 `${nextMilestone.title} • Day ${nextMilestone.due_day}`
               ) : (
                 <div className="text-lg text-[var(--primaryGreen)]">
                    All caught up! Next milestone available tomorrow.
                 </div>
               )
            ) : 'No milestones assigned yet.'}
          </div>
        </motion.div>

        <motion.div
          className="rounded-[32px] bg-white/80 border border-[var(--borderSoft)] shadow-lg p-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          viewport={{ once: true }}
        >
          <div className="text-sm text-[var(--textSoft)]">Upcoming Appointment</div>
          <div className="serif-heading text-2xl text-[var(--textDark)] mt-2">
            {upcoming ? `${formatDate(upcoming.slot_at)} • ${formatTime(upcoming.slot_at)}` : 'No appointments scheduled.'}
          </div>
        </motion.div>

        <motion.div
          className="rounded-[32px] bg-white/80 border border-[var(--borderSoft)] shadow-lg p-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="text-sm text-[var(--textSoft)]">Daily Motivation</div>
          <div className="serif-heading text-2xl text-[var(--textDark)] mt-2">
            {motivation || 'Your recovery tips will appear here.'}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
