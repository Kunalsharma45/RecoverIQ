import React from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { 
  Users, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Activity, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileText,
  UserCheck,
  RefreshCw
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts'
import { doctorApi } from '../../lib/api'

export default function DoctorDashboard() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['doctor-dashboard'],
    queryFn: () => doctorApi.getDashboard().then(res => res.data)
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    )
  }

  const { stats, appointments, activities, attention, snapshot } = dashboard

  return (
    <div className="space-y-8 pb-12">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            className="rounded-[24px] bg-white border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all duration-300 group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            <div className="serif-heading text-2xl text-slate-900 mt-1">{stat.value}</div>
            <div className="text-[10px] text-slate-400 mt-2 font-medium flex items-center gap-1">
              <TrendingUp size={10} className="text-emerald-500" />
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Layout (70/30) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (70%) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Appointments */}
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="serif-heading text-xl text-slate-900">Upcoming Appointments</h2>
              <button className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 group">
                View All <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            
            <div className="space-y-4">
              {appointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-emerald-100 transition-colors bg-slate-50/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">
                      {appt.patient.user.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{appt.patient.user.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{appt.patient.program?.name || 'Consultation'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Clock size={12} />
                        {new Date(appt.slot_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Today</div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider border border-emerald-100">
                      {appt.status}
                    </div>
                  </div>
                </div>
              ))}
              {appointments.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs font-medium italic">No sessions scheduled for today.</div>
              )}
            </div>
          </section>

          {/* Recent Patient Activity */}
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
            <h2 className="serif-heading text-xl text-slate-900 mb-6">Recent Patient Activity</h2>
            <div className="space-y-6">
              {activities.map((activity, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <Activity size={14} />
                    </div>
                    {idx !== activities.length - 1 && (
                      <div className="absolute top-10 left-1/2 w-px h-6 bg-slate-100" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="text-xs font-medium text-slate-900">
                      <span className="font-bold">{activity.patient_name}</span> {activity.activity}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-medium tracking-tight uppercase">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (30%) */}
        <div className="space-y-8">
          {/* Patients Needing Attention */}
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
            <h2 className="serif-heading text-lg text-slate-900 mb-5">Attention Needed</h2>
            <div className="space-y-4">
              {attention.map((patient) => (
                <div key={patient.id} className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50/30 border border-rose-100/50">
                  <div className="mt-1">
                    <AlertCircle size={14} className="text-rose-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{patient.name}</div>
                    <div className="text-[10px] text-rose-600 font-medium mt-0.5">{patient.issue}</div>
                  </div>
                </div>
              ))}
              {attention.length === 0 && (
                <div className="text-center py-6">
                  <UserCheck size={20} className="mx-auto text-emerald-100 mb-2" />
                  <p className="text-[10px] text-slate-400 font-medium">All systems stable</p>
                </div>
              )}
            </div>
          </section>

          {/* Today's Tasks */}
          <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
            <h2 className="serif-heading text-lg text-slate-900 mb-5">Today's Focus</h2>
            <div className="space-y-3">
              <TaskItem text="Review pending requests" />
              <TaskItem text="Approve appointments" />
              <TaskItem text="Check patient logs" />
              <TaskItem text="Update recovery plans" />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function TaskItem({ text }) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="w-5 h-5 rounded-lg border-2 border-slate-100 flex items-center justify-center group-hover:border-emerald-200 transition-colors">
        <CheckCircle2 size={10} className="text-transparent group-hover:text-emerald-300" />
      </div>
      <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{text}</span>
    </div>
  )
}

function InsightBox({ text, color }) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    olive: 'bg-[var(--softLime)] text-emerald-900 border-white/50',
    teal: 'bg-teal-50 text-teal-700 border-teal-100',
  }
  
  return (
    <div className={`p-4 rounded-[24px] border ${colors[color]} shadow-sm`}>
      <div className="flex gap-2 items-center">
        <TrendingUp size={12} className="opacity-70" />
        <p className="text-[10px] font-bold leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
