import React, { useMemo, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion } from 'motion/react'
import api from '../../lib/api.js'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import BookSVG from '../../assets/Physical therapy exercise-bro.svg'

export default function Book() {
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [slotAt, setSlotAt] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const doctorsQuery = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const res = await api.get('/doctors')
      return res.data || []
    },
  })

  const slotsQuery = useQuery({
    queryKey: ['doctor-slots', selectedDoctor?.id],
    queryFn: async () => {
      if (!selectedDoctor?.id) return []
      const res = await api.get(`/doctors/${selectedDoctor.id}/slots`)
      return res.data?.available_slots || []
    },
    enabled: Boolean(selectedDoctor?.id),
  })

  const bookingMutation = useMutation({
    mutationFn: async payload => {
      const res = await api.post('/appointments/public', payload)
      return res.data
    },
    onSuccess: () => {
      setSlotAt('')
      setName('')
      setEmail('')
    },
  })

  const submit = async e => {
    e.preventDefault()
    if (!selectedDoctor?.id) return
    bookingMutation.mutate({
      booked_by_name: name,
      booked_by_email: email,
      doctor_id: selectedDoctor.id,
      slot_at: slotAt,
    })
  }

  const doctorCards = useMemo(() => doctorsQuery.data || [], [doctorsQuery.data])

  const slotsByDate = useMemo(() => {
    const list = slotsQuery.data || []
    return list.reduce((acc, slot) => {
      const date = slot.split('T')[0]
      if (!acc[date]) acc[date] = []
      acc[date].push(slot)
      return acc
    }, {})
  }, [slotsQuery.data])

  const availableDates = useMemo(() => Object.keys(slotsByDate), [slotsByDate])

  const visibleSlots = useMemo(() => {
    if (!selectedDate) return []
    return slotsByDate[selectedDate] || []
  }, [selectedDate, slotsByDate])

  const formatTime = iso => {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <main className="pt-36">
      <section className="bg-[var(--cream)] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <div>
            <h1 className="serif-heading text-5xl md:text-6xl leading-[0.95]">Book a Recovery Session</h1>
            <p className="mt-4 text-lg leading-relaxed text-[var(--textSoft)] max-w-2xl">
              Choose a doctor and request a session. Once approved, you will receive patient credentials via email.
            </p>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[var(--softLime)]/20 blur-[80px] rounded-full mix-blend-multiply opacity-60 -z-10" />
            <img src={BookSVG} alt="rehabilitation" className="w-full max-h-96 object-contain relative z-10 drop-shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="bg-[var(--mutedWhite)] py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16">
          <div className="space-y-6">
            <div>
              <h2 className="serif-heading text-3xl">Select a Doctor</h2>
              <p className="mt-2 text-[var(--textSoft)]">Pick a specialist for your rehabilitation journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctorCards.map(doctor => (
                <motion.button
                  key={doctor.id}
                  type="button"
                  onClick={() => setSelectedDoctor(doctor)}
                  className={`text-left rounded-[32px] border p-5 transition-all duration-500 hover:-translate-y-2 shadow-sm ${
                    selectedDoctor?.id === doctor.id
                      ? 'bg-[var(--softLime)] border-[var(--primaryGreen)]'
                      : 'bg-white border-[var(--borderSoft)]'
                  }`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-[var(--primaryGreen)] flex-shrink-0 flex items-center justify-center text-white text-2xl font-serif drop-shadow-md border-2 border-[var(--softLime)]">
                      {doctor.name ? doctor.name.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--textDark)]">{doctor.name}</div>
                      <div className="text-sm text-[var(--textSoft)]">{doctor.specialization || 'Rehab Specialist'}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[var(--textSoft)]">
                    {doctor.bio || 'Focused on restoring mobility with compassionate care.'}
                  </p>
                </motion.button>
              ))}

              {doctorCards.length === 0 && (
                <div className="rounded-[32px] border border-[var(--borderSoft)] bg-white p-6 text-[var(--textSoft)]">
                  {doctorsQuery.isLoading ? 'Loading doctors...' : 'No doctors available yet.'}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[40px] bg-white/70 border border-[var(--borderSoft)] shadow-lg p-8">
            <h3 className="serif-heading text-2xl">Request an Appointment</h3>
            <p className="mt-2 text-[var(--textSoft)]">Fill in your details and select a time.</p>

            <form className="mt-6 space-y-4" onSubmit={submit}>
              <Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
              <Input placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} />

              <div>
                <label className="text-sm text-[var(--textSoft)]">Select date</label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {availableDates.map(date => (
                    <button
                      key={date}
                      type="button"
                      onClick={() => {
                        setSelectedDate(date)
                        setSlotAt('')
                      }}
                      className={`px-4 py-2 rounded-full border text-sm transition-all duration-300 ${
                        selectedDate === date
                          ? 'bg-[var(--softLime)] border-[var(--primaryGreen)]'
                          : 'bg-white border-[var(--borderSoft)]'
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                  {availableDates.length === 0 && (
                    <div className="text-sm text-[var(--textSoft)]">Select a doctor to view dates.</div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm text-[var(--textSoft)]">Select time</label>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {visibleSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSlotAt(slot)}
                      className={`px-3 py-2 rounded-full border text-sm transition-all duration-300 ${
                        slotAt === slot
                          ? 'bg-[var(--primaryGreen)] text-[var(--cream)] border-[var(--primaryGreen)]'
                          : 'bg-white border-[var(--borderSoft)]'
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                  {selectedDate && visibleSlots.length === 0 && (
                    <div className="col-span-3 text-sm text-[var(--textSoft)]">No slots available for this date.</div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm text-[var(--textSoft)]">Selected doctor</label>
                <select
                  className="mt-2 w-full rounded-full bg-white/80 border border-[#D9E1D7] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#256B52]/20"
                  value={selectedDoctor?.id || ''}
                  onChange={e => {
                    const id = Number(e.target.value)
                    const doc = doctorCards.find(d => d.id === id)
                    setSelectedDoctor(doc || null)
                    setSelectedDate('')
                    setSlotAt('')
                  }}
                >
                  <option value="">Choose a doctor</option>
                  {doctorCards.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name} — {doc.specialization}</option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="w-full" disabled={bookingMutation.isPending}>
                {bookingMutation.isPending ? 'Submitting...' : 'Request Appointment'}
              </Button>

              {bookingMutation.isSuccess && (
                <div className="rounded-[24px] bg-[var(--softLime)] px-4 py-3 text-sm text-[var(--textDark)]">
                  Request sent. Your doctor will review and respond soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
