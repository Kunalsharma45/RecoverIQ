import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import { doctorApi } from '../../lib/api'
import {
  Users, Search, Activity, HeartPulse, AlertTriangle,
  CheckCircle2, TrendingUp, Flame, Calendar,
  UserX, Filter, Loader2, ArrowUpRight
} from 'lucide-react'
import PatientDetailDrawer from '../../components/doctor/PatientDetailDrawer.jsx'

const STATUS_STYLES = {
  'Excellent Progress': { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Improving':         { bg: 'bg-sky-100',     text: 'text-sky-700',     dot: 'bg-sky-500'     },
  'Stable':            { bg: 'bg-slate-100',   text: 'text-slate-600',   dot: 'bg-slate-400'   },
  'Needs Attention':   { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  'High Pain':         { bg: 'bg-rose-100',    text: 'text-rose-700',    dot: 'bg-rose-500'    },
}

const TABS = [
  { key: 'all',       label: 'All Patients' },
  { key: 'active',    label: 'Active Recovery' },
  { key: 'attention', label: 'Needs Attention' },
  { key: 'completed', label: 'Completed' },
]

function PatientCard({ patient, onClick }) {
  const style = STATUS_STYLES[patient.status] ?? STATUS_STYLES['Stable']
  const hasAlerts = patient.alerts?.length > 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.07)' }}
      transition={{ duration: 0.4 }}
      onClick={() => onClick(patient.id)}
      className="bg-white rounded-[36px] p-8 border border-slate-100 shadow-sm cursor-pointer group relative overflow-hidden"
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-[36px] ring-2 ring-transparent group-hover:ring-emerald-200 transition-all duration-500" />

      {/* Alert indicator */}
      {hasAlerts && (
        <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-100 animate-pulse" />
      )}

      {/* Header */}
      <div className="flex items-start gap-5 mb-6">
        <div className="w-14 h-14 rounded-[20px] bg-emerald-900 text-white flex items-center justify-center text-2xl font-black shrink-0">
          {patient.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-emerald-800 transition-colors">
            {patient.name}
          </h3>
          <p className="text-xs text-slate-400 truncate mt-0.5">{patient.program_name}</p>
        </div>
        <ArrowUpRight size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0 mt-1" />
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
          <span>Recovery Progress</span>
          <span className="text-slate-900">{patient.completion_percent}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${patient.completion_percent}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            className="h-full bg-emerald-500 rounded-full"
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center">
          <div className="text-xl font-black text-slate-900">{patient.streak}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Streak</div>
        </div>
        <div className="text-center border-x border-slate-100">
          <div className="text-xl font-black text-slate-900">{patient.adherence_score}%</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adherence</div>
        </div>
        <div className="text-center">
          <div className={`text-xl font-black ${patient.avg_pain >= 6 ? 'text-rose-600' : 'text-slate-900'}`}>
            {patient.avg_pain}
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Pain</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold ${style.bg} ${style.text}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {patient.status}
        </div>
        {patient.next_appointment ? (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Calendar size={12} />
            {new Date(patient.next_appointment.slot_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </div>
        ) : (
          <div className="text-[11px] text-slate-300">No appointment</div>
        )}
      </div>
    </motion.div>
  )
}

export default function DoctorPatients() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['doctor-patients'],
    queryFn: async () => {
      const res = await doctorApi.getPatients()
      return res.data || []
    },
  })

  const filtered = useMemo(() => {
    return patients.filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.program_name.toLowerCase().includes(search.toLowerCase())

      const matchTab =
        tab === 'all' ? true :
        tab === 'active' ? !['Excellent Progress'].includes(p.status) && p.completion_percent < 100 :
        tab === 'attention' ? ['Needs Attention', 'High Pain'].includes(p.status) :
        tab === 'completed' ? p.completion_percent >= 100 : true

      return matchSearch && matchTab
    })
  }, [patients, search, tab])

  // Summary stats
  const stats = useMemo(() => ({
    total:      patients.length,
    attention:  patients.filter(p => ['Needs Attention', 'High Pain'].includes(p.status)).length,
    improving:  patients.filter(p => ['Improving', 'Excellent Progress'].includes(p.status)).length,
    avgAdherence: patients.length
      ? Math.round(patients.reduce((s, p) => s + p.adherence_score, 0) / patients.length)
      : 0,
  }), [patients])

  return (
    <div className="space-y-10 pb-16">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-[var(--cream)] rounded-[48px] p-10 border border-slate-200/50 shadow-xl shadow-slate-100/30">
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-emerald-700 mb-5">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
              <Users size={18} />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Patient Management</span>
          </div>
          <h1 className="serif-heading text-5xl text-slate-900 mb-4">Recovery Workspace</h1>
          <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
            Monitor and guide your patients through every step of their rehabilitation journey.
          </p>

          {/* Summary Pills */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { label: 'Total Patients', value: stats.total, icon: Users, color: 'text-slate-900' },
              { label: 'Needs Attention', value: stats.attention, icon: AlertTriangle, color: 'text-amber-600' },
              { label: 'Improving', value: stats.improving, icon: TrendingUp, color: 'text-emerald-600' },
              { label: 'Avg Adherence', value: `${stats.avgAdherence}%`, icon: Activity, color: 'text-sky-600' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <s.icon size={18} className={s.color} />
                <div>
                  <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-400/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or program..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-5 py-4 rounded-[24px] bg-white border border-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-300 text-sm transition-all"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white p-1.5 rounded-[24px] border border-slate-100 shadow-sm">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-[18px] text-xs font-bold whitespace-nowrap transition-all ${
                tab === t.key ? 'bg-emerald-900 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mx-auto" />
            <p className="text-slate-400 text-sm font-medium">Loading patient records...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-200">
          <UserX size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No patients found</h3>
          <p className="text-slate-400">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map(patient => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onClick={setSelectedId}
            />
          ))}
        </motion.div>
      )}

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedId && (
          <PatientDetailDrawer
            patientId={selectedId}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
