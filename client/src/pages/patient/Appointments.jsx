import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import api from '../../lib/api.js'

const formatDate = value => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
const formatTime = value => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function PatientAppointments() {
  const appointmentsQuery = useQuery({
    queryKey: ['patient-appointments'],
    queryFn: async () => {
      const res = await api.get('/patient/appointments')
      return res.data || []
    },
  })

  const appointments = appointmentsQuery.data || []

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-[var(--cream)] border border-[var(--borderSoft)] shadow-lg p-6">
        <h2 className="serif-heading text-3xl">Appointments</h2>
        <p className="mt-2 text-[var(--textSoft)]">Your upcoming recovery sessions and follow-ups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {appointments.map(appointment => (
          <motion.div
            key={appointment.id}
            className="rounded-[32px] bg-white/80 border border-[var(--borderSoft)] shadow-lg p-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="serif-heading text-2xl text-[var(--textDark)]">{appointment.doctor?.user?.name || 'Doctor'}</div>
                <p className="text-sm text-[var(--textSoft)]">Status: {appointment.status}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-[var(--textSoft)]">{formatDate(appointment.slot_at)}</div>
                <div className="text-sm font-medium text-[var(--textDark)]">{formatTime(appointment.slot_at)}</div>
              </div>
            </div>
          </motion.div>
        ))}

        {appointments.length === 0 && (
          <div className="rounded-[32px] bg-white/80 border border-[var(--borderSoft)] shadow-lg p-8 text-[var(--textSoft)]">
            No upcoming appointments yet.
          </div>
        )}
      </div>
    </div>
  )
}
