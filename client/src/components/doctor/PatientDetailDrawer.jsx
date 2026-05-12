import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorApi } from '../../lib/api'
import {
  X, HeartPulse, Activity, Calendar, CheckCircle2,
  Lock, AlertTriangle, MessageSquarePlus,
  ChevronDown, ChevronUp, BarChart2, TrendingUp,
  Flame,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const TOOLTIP_STYLE = {
  backgroundColor: '#fff', borderRadius: '20px',
  border: '1px solid #f1f5f9', boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
  padding: '10px 16px',
}

function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-slate-100 rounded-[28px] overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-6 bg-white hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Icon size={18} />
          </div>
          <span className="font-bold text-slate-900">{title}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 bg-white">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const STATUS_COLORS = {
  'Excellent Progress': 'bg-emerald-100 text-emerald-700',
  'Improving': 'bg-sky-100 text-sky-700',
  'Stable': 'bg-slate-100 text-slate-600',
  'Needs Attention': 'bg-amber-100 text-amber-700',
  'High Pain': 'bg-rose-100 text-rose-700',
}

export default function PatientDetailDrawer({ patientId, onClose }) {
  const queryClient = useQueryClient()
  const [noteText, setNoteText] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const { data, isLoading } = useQuery({
    queryKey: ['doctor-patient-detail', patientId],
    queryFn: async () => {
      const res = await doctorApi.getPatientDetail(patientId)
      return res.data
    },
    enabled: !!patientId,
  })

  const { data: notes = [], refetch: refetchNotes } = useQuery({
    queryKey: ['doctor-patient-notes', patientId],
    queryFn: async () => {
      const res = await doctorApi.getPatientNotes(patientId)
      return res.data
    },
    enabled: !!patientId,
  })

  const addNote = useMutation({
    mutationFn: (note) => doctorApi.addPatientNote(patientId, { note }),
    onSuccess: () => { setNoteText(''); refetchNotes() },
  })

  const reviewMilestone = useMutation({
    mutationFn: ({ progressId, status, doctor_notes }) =>
      doctorApi.reviewMilestone(progressId, { status, doctor_notes }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['doctor-patient-detail', patientId] }),
  })


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex-1 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full max-w-2xl bg-[var(--mutedWhite)] h-full overflow-y-auto shadow-2xl flex flex-col"
      >
        {isLoading || !data ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[20px] bg-emerald-900 text-white flex items-center justify-center text-2xl font-black">
                  {data.patient.name.charAt(0)}
                </div>
                <div>
                  <h2 className="serif-heading text-2xl text-slate-900">{data.patient.name}</h2>
                  <p className="text-sm text-slate-500">{data.patient.program_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-4 py-2 rounded-full ${STATUS_COLORS[data.patient.status] ?? 'bg-slate-100 text-slate-600'}`}>
                  {data.patient.status}
                </span>
                <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ── Premium Tab Navigation ── */}
            <div className="sticky top-[108px] z-10 bg-white/90 backdrop-blur-xl border-b border-slate-100">
              <div className="px-6 py-3 overflow-x-auto scrollbar-none">
                <div className="inline-flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-[20px] min-w-full">
                  {[
                    { key: 'overview',   label: 'Overview'   },
                    { key: 'charts',     label: 'Charts'     },
                    { key: 'milestones', label: 'Milestones' },
                    { key: 'notes',      label: 'Notes'      },
                  ].map(tab => {
                    const isActive = activeTab === tab.key
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={[
                          'relative flex-1 flex items-center justify-center',
                          'h-9 rounded-[14px]',
                          'text-[11px] font-bold tracking-wide',
                          'whitespace-nowrap select-none',
                          'transition-colors duration-200',
                          isActive
                            ? 'bg-[var(--primaryGreen)] text-white shadow-md shadow-emerald-900/20'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-white/60',
                        ].join(' ')}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-8 py-8 space-y-6">

              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <>
                  {/* Alerts */}
                  {data.patient.alerts?.length > 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-[28px] p-6 space-y-2">
                      <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-3">
                        <AlertTriangle size={16} /> Recovery Alerts
                      </div>
                      {data.patient.alerts.map((a, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-amber-800">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          {a}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Completion', value: `${data.patient.completion_percent}%`, icon: TrendingUp, color: 'emerald' },
                      { label: 'Adherence', value: `${data.patient.adherence_score}%`, icon: Activity, color: 'sky' },
                      { label: 'Streak', value: `${data.patient.streak} days`, icon: Flame, color: 'orange' },
                      { label: 'Avg Pain', value: `${data.patient.avg_pain}/10`, icon: HeartPulse, color: 'rose' },
                    ].map((s, i) => (
                      <div key={i} className="bg-white rounded-[24px] p-5 border border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                          <s.icon size={16} className={`text-${s.color}-500`} />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900">{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Program Info */}
                  <div className="bg-white rounded-[28px] p-6 border border-slate-100 space-y-4">
                    <h4 className="font-bold text-slate-900">Program Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-slate-400 text-xs uppercase tracking-widest block mb-1">Enrolled</span><span className="font-bold text-slate-900">{data.patient.enrolled_at ?? '—'}</span></div>
                      <div><span className="text-slate-400 text-xs uppercase tracking-widest block mb-1">Day</span><span className="font-bold text-slate-900">{data.patient.current_day} / {data.patient.program_duration}</span></div>
                      <div><span className="text-slate-400 text-xs uppercase tracking-widest block mb-1">Milestones Done</span><span className="font-bold text-slate-900">{data.patient.completed_milestones} / {data.patient.total_milestones}</span></div>
                      <div><span className="text-slate-400 text-xs uppercase tracking-widest block mb-1">Next Appointment</span><span className="font-bold text-slate-900">{data.patient.next_appointment ? new Date(data.patient.next_appointment.slot_at).toLocaleDateString() : 'None scheduled'}</span></div>
                    </div>
                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                        <span>Recovery Progress</span><span>{data.patient.completion_percent}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${data.patient.completion_percent}%` }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* CHARTS */}
              {activeTab === 'charts' && (
                <>
                  {data.charts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-[32px] border border-dashed border-slate-200">
                      <BarChart2 size={40} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-500">No log data yet for charts.</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white rounded-[32px] p-6 border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-1 serif-heading text-lg">Pain Level Trend</h4>
                        <p className="text-xs text-slate-400 mb-6">Lower is better</p>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.charts}>
                              <defs>
                                <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                              <YAxis hide domain={[0, 10]} />
                              <Tooltip contentStyle={TOOLTIP_STYLE} />
                              <Area type="monotone" dataKey="pain" stroke="#f43f5e" strokeWidth={2} fill="url(#pg)" dot={false} animationDuration={1500} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="bg-white rounded-[32px] p-6 border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-1 serif-heading text-lg">Mobility Progress</h4>
                        <p className="text-xs text-slate-400 mb-6">Higher is better</p>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.charts}>
                              <defs>
                                <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                              <YAxis hide domain={[0, 100]} />
                              <Tooltip contentStyle={TOOLTIP_STYLE} />
                              <Area type="monotone" dataKey="mobility" stroke="#10b981" strokeWidth={2} fill="url(#mg)" dot={false} animationDuration={1500} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="bg-white rounded-[32px] p-6 border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-1 serif-heading text-lg">Energy Levels</h4>
                        <p className="text-xs text-slate-400 mb-6">Higher is better (0–100)</p>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.charts}>
                              <defs>
                                <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                              <YAxis hide domain={[0, 100]} />
                              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`, 'Energy']} />
                              <Area type="monotone" dataKey="energy" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#eg)" dot={{ r: 3, fill: '#0ea5e9', strokeWidth: 0 }} activeDot={{ r: 5 }} animationDuration={1500} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* MILESTONES */}
              {activeTab === 'milestones' && (
                <div className="space-y-4">
                  {(data.milestones || []).map((ms, i) => (
                    <div key={ms.id} className={`rounded-[28px] p-6 border ${ms.status === 'Completed' ? 'bg-emerald-50/50 border-emerald-100' : ms.status === 'LOCKED' ? 'bg-slate-50 border-slate-100 opacity-70' : 'bg-white border-slate-100'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${ms.status === 'Completed' ? 'bg-emerald-500 text-white' : ms.status === 'LOCKED' ? 'bg-slate-200 text-slate-400' : 'bg-emerald-100 text-emerald-700'}`}>
                            {ms.status === 'Completed' ? <CheckCircle2 size={18} /> : ms.status === 'LOCKED' ? <Lock size={16} /> : ms.due_day}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{ms.title}</div>
                            <div className="text-xs text-slate-400">{ms.difficulty} · {ms.duration} mins</div>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${ms.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : ms.status === 'LOCKED' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-700'}`}>
                          {ms.status}
                        </span>
                      </div>
                      {ms.patient_notes && (
                        <div className="text-xs text-slate-500 bg-slate-50 rounded-2xl p-3 mb-3">
                          <span className="font-bold">Patient note: </span>{ms.patient_notes}
                        </div>
                      )}
                      {ms.log && (
                        <div className="flex gap-3 mb-3">
                          <div className="text-xs bg-rose-50 text-rose-600 font-bold px-3 py-1 rounded-full">Pain {ms.log.pain}/10</div>
                          <div className="text-xs bg-sky-50 text-sky-600 font-bold px-3 py-1 rounded-full">{ms.log.mobility}</div>
                          <div className="text-xs bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-full">Energy {ms.log.energy}%</div>
                        </div>
                      )}
                      {ms.progress_id && (
                        <DoctorReviewForm ms={ms} onReview={reviewMilestone} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* NOTES */}
              {activeTab === 'notes' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-[28px] p-6 border border-slate-100">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Add Clinical Note</label>
                    <textarea
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      placeholder="Treatment adjustments, session feedback, recommendations..."
                      className="w-full px-5 py-4 rounded-[20px] bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-400 text-sm leading-relaxed min-h-[120px] resize-none transition-all"
                    />
                    <button
                      onClick={() => noteText.trim() && addNote.mutate(noteText)}
                      disabled={addNote.isPending || !noteText.trim()}
                      className="mt-4 w-full bg-emerald-900 text-white py-4 rounded-2xl text-sm font-bold hover:bg-emerald-800 transition-all disabled:opacity-40"
                    >
                      {addNote.isPending ? 'Saving...' : 'Save Note'}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {notes.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-[32px] border border-dashed border-slate-200">
                        <MessageSquarePlus size={36} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500 text-sm">No notes yet. Add your first clinical note above.</p>
                      </div>
                    ) : (
                      notes.map((note, i) => (
                        <div key={note.id} className="bg-white rounded-[24px] p-5 border border-slate-100">
                          <p className="text-sm text-slate-700 leading-relaxed">{note.note}</p>
                          <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-widest">
                            {new Date(note.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

function DoctorReviewForm({ ms, onReview }) {
  const [status, setStatus] = useState(ms.status === 'Completed' ? 'Completed' : '')
  const [note, setNote] = useState(ms.doctor_notes ?? '')
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs text-emerald-600 font-bold hover:underline">
        {ms.doctor_notes ? 'Edit Doctor Review' : '+ Add Doctor Review'}
      </button>
    )
  }

  return (
    <div className="mt-3 space-y-3 border-t border-slate-100 pt-4">
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm outline-none"
      >
        <option value="">Update Status</option>
        {['Completed', 'Missed', 'Needs Review', 'In Progress'].map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Doctor notes..."
        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm outline-none min-h-[80px] resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={() => { onReview.mutate({ progressId: ms.progress_id, status, doctor_notes: note }); setOpen(false) }}
          className="flex-1 bg-emerald-900 text-white py-2.5 rounded-2xl text-xs font-bold hover:bg-emerald-800 transition-all"
        >
          Save Review
        </button>
        <button onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-2xl bg-slate-100 text-xs font-bold text-slate-500">
          Cancel
        </button>
      </div>
    </div>
  )
}
