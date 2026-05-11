import React, { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'motion/react'
import api from '../../lib/api.js'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'

const tabs = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Accepted' },
  { key: 'cancelled', label: 'Rejected' },
  { key: 'completed', label: 'Completed' },
]

const formatDate = value => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
const formatTime = value => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function DoctorAppointments() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('pending')
  const [selected, setSelected] = useState(null)
  const [patientName, setPatientName] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [programId, setProgramId] = useState('')
  const [notes, setNotes] = useState('')
  const [modalMessage, setModalMessage] = useState('')

  const appointmentsQuery = useQuery({
    queryKey: ['doctor-appointments', activeTab],
    queryFn: async () => {
      const res = await api.get('/doctor/appointments', { params: { status: activeTab } })
      return res.data?.data || []
    },
  })

  const programsQuery = useQuery({
    queryKey: ['doctor-programs'],
    queryFn: async () => {
      const res = await api.get('/doctor/programs')
      return res.data || []
    },
  })

  const updateAppointment = useMutation({
    mutationFn: async ({ id, status, notes: statusNotes }) => {
      const res = await api.patch(`/doctor/appointments/${id}`, { status, notes: statusNotes })
      return res.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] }),
  })

  const createPatient = useMutation({
    mutationFn: async payload => {
      const res = await api.post('/doctor/patients', payload)
      return res.data
    },
    onSuccess: data => {
      setModalMessage(data?.message || 'Patient account successfully created. Credentials have been emailed securely.')
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] })
    },
  })

  const handleAccept = appointment => {
    setSelected(appointment)
    setPatientName(appointment.booked_by_name || '')
    setPatientEmail(appointment.booked_by_email || '')
    setModalMessage('')
  }

  const handleReject = appointment => {
    updateAppointment.mutate({ id: appointment.id, status: 'cancelled' })
  }

  const submitCreatePatient = async e => {
    e.preventDefault()
    if (!selected) return

    await createPatient.mutateAsync({
      name: patientName,
      email: patientEmail,
      program_id: Number(programId),
      appointment_id: selected.id,
    })

    await updateAppointment.mutateAsync({
      id: selected.id,
      status: 'confirmed',
      notes,
    })
  }

  const programs = useMemo(() => programsQuery.data || [], [programsQuery.data])

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-[var(--cream)] border border-[var(--borderSoft)] shadow-lg p-6">
        <h2 className="serif-heading text-3xl">Appointments</h2>
        <p className="mt-2 text-[var(--textSoft)]">Review requests and start new recovery journeys.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {tabs.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-5 py-2 text-sm border transition-all duration-300 ${
              activeTab === tab.key
                ? 'bg-[var(--softLime)] border-[var(--primaryGreen)]'
                : 'bg-white border-[var(--borderSoft)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(appointmentsQuery.data || []).map(appointment => (
          <motion.div
            key={appointment.id}
            className="rounded-[32px] bg-white/80 border border-[var(--borderSoft)] shadow-lg p-6 hover:-translate-y-1 transition-all duration-500"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="serif-heading text-2xl text-[var(--textDark)]">{appointment.booked_by_name || 'New patient'}</h3>
                <p className="text-sm text-[var(--textSoft)]">{appointment.booked_by_email}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-[var(--textSoft)]">{formatDate(appointment.slot_at)}</div>
                <div className="text-sm font-medium text-[var(--textDark)]">{formatTime(appointment.slot_at)}</div>
              </div>
            </div>

            <p className="mt-4 text-sm text-[var(--textSoft)]">Status: {appointment.status}</p>

            {appointment.notes && (
              <p className="mt-3 text-sm text-[var(--textSoft)]">Notes: {appointment.notes}</p>
            )}

            {activeTab === 'pending' && (
              <div className="mt-5 flex gap-3">
                <Button onClick={() => handleAccept(appointment)}>Accept</Button>
                <Button variant="secondary" onClick={() => handleReject(appointment)}>Reject</Button>
              </div>
            )}
          </motion.div>
        ))}

        {(appointmentsQuery.data || []).length === 0 && (
          <div className="rounded-[32px] bg-white/70 border border-[var(--borderSoft)] shadow-lg p-8 text-[var(--textSoft)]">
            No appointments in this category yet.
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="max-w-2xl w-full rounded-[40px] bg-white p-8 shadow-2xl border border-[var(--borderSoft)]">
            <div className="flex items-center justify-between">
              <h3 className="serif-heading text-3xl">Create Patient Account</h3>
              <button
                type="button"
                className="text-[var(--textSoft)]"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
            <p className="mt-2 text-[var(--textSoft)]">
              Generate credentials and assign a rehabilitation program.
            </p>

            <form className="mt-6 space-y-4" onSubmit={submitCreatePatient}>
              <Input placeholder="Patient name" value={patientName} onChange={e => setPatientName(e.target.value)} />
              <Input placeholder="Patient email" value={patientEmail} onChange={e => setPatientEmail(e.target.value)} />

              <select
                className="w-full rounded-full bg-white/80 border border-[#D9E1D7] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#256B52]/20"
                value={programId}
                onChange={e => setProgramId(e.target.value)}
              >
                <option value="">Select rehabilitation program</option>
                {programs.map(program => (
                  <option key={program.id} value={program.id}>
                    {program.name} ({program.duration_days} days)
                  </option>
                ))}
              </select>

              <textarea
                rows={3}
                className="w-full rounded-[24px] bg-white/80 border border-[#D9E1D7] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#256B52]/20"
                placeholder="Recovery notes (optional)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />

              <Button type="submit" className="w-full" disabled={createPatient.isPending || updateAppointment.isPending}>
                {createPatient.isPending || updateAppointment.isPending ? 'Creating...' : 'Create Patient + Accept'}
              </Button>

              {modalMessage && (
                <div className="rounded-[24px] bg-[var(--softLime)] border border-[var(--borderSoft)] px-4 py-3 text-sm text-[var(--textDark)]">
                  {modalMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
