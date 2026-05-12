import React, { useRef, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  HeartPulse,
  Flag,
  CalendarCheck,
  LineChart,
  Settings,
  LogOut,
  Bell,
  X,
  CheckCircle2,
  Clock,
  Star,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { patientApi } from '../lib/api.js'

const navItems = [
  { to: '/patient', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patient/program', label: 'Recovery Program', icon: HeartPulse },
  { to: '/patient/milestones', label: 'Milestones', icon: Flag },
  { to: '/patient/appointments', label: 'Appointments', icon: CalendarCheck },
  { to: '/patient/timeline', label: 'Progress Timeline', icon: LineChart },
  { to: '/patient/settings', label: 'Settings', icon: Settings },
]

const NOTIF_ICONS = {
  milestone_review: CheckCircle2,
  appointment: CalendarCheck,
  review: Star,
}

function NotificationBell() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: notifications = [] } = useQuery({
    queryKey: ['patient-notifications'],
    queryFn: async () => {
      const res = await patientApi.getNotifications()
      return res.data || []
    },
    refetchInterval: 30000, // poll every 30s
  })

  const markRead = useMutation({
    mutationFn: (id) => patientApi.markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patient-notifications'] }),
  })

  const unreadCount = notifications.filter(n => !n.read_at).length

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative rounded-full border border-[var(--borderSoft)] p-2 text-[var(--textSoft)] hover:bg-white hover:text-[var(--primaryGreen)] transition-all duration-200"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-rose-500 text-white text-[9px] font-black rounded-full px-1 shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Click-away backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute right-0 top-12 z-50 w-[380px] max-h-[520px] flex flex-col bg-white rounded-[28px] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-slate-400 mt-0.5">{unreadCount} unread</p>
                  )}
                </div>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                  <X size={14} />
                </button>
              </div>

              {/* Notification list */}
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-14 px-6">
                    <Bell size={32} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-400 text-sm font-medium">All caught up!</p>
                    <p className="text-slate-300 text-xs mt-1">No new notifications.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {notifications.map(notif => {
                      const IconComp = NOTIF_ICONS[notif.type] ?? Bell
                      const isReview = notif.type === 'milestone_review'
                      const isUnread = !notif.read_at

                      return (
                        <div
                          key={notif.id}
                          onClick={() => isUnread && markRead.mutate(notif.id)}
                          className={`px-6 py-5 cursor-pointer transition-colors ${isUnread ? 'bg-emerald-50/40 hover:bg-emerald-50' : 'hover:bg-slate-50'}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${isReview ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                              <IconComp size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm font-bold leading-snug ${isUnread ? 'text-slate-900' : 'text-slate-600'}`}>
                                  {notif.data?.title ?? notif.type}
                                </p>
                                {isUnread && <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />}
                              </div>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                {notif.data?.message}
                              </p>

                              {/* Doctor review details */}
                              {isReview && notif.data?.doctor_notes && (
                                <div className="mt-3 bg-white rounded-[16px] border border-emerald-100 p-3">
                                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Doctor's Note</p>
                                  <p className="text-xs text-slate-600 leading-relaxed italic">"{notif.data.doctor_notes}"</p>
                                </div>
                              )}

                              {isReview && notif.data?.status && (
                                <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                  <CheckCircle2 size={10} />
                                  Status: {notif.data.status}
                                </div>
                              )}

                              <p className="text-[10px] text-slate-300 mt-2 font-medium">
                                {new Date(notif.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PatientLayout() {
  const { user, logout } = useAuth()
  const { data: dashboard } = useQuery({
    queryKey: ['patient-dashboard-streak'],
    queryFn: async () => {
      const res = await api.get('/patient/recovery-program')
      return res.data
    },
    staleTime: 30000
  })

  return (
    <div className="min-h-screen bg-[var(--mutedWhite)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <aside className="rounded-[32px] border border-white/20 shadow-xl backdrop-blur-xl bg-[rgba(250,249,247,0.75)] p-6 flex flex-col justify-between">
          <div>
            <div className="serif-heading text-2xl text-[var(--primaryGreen)]">RecoverIQ</div>
            <p className="mt-2 text-sm text-[var(--textSoft)]">Recovery Companion</p>

            <nav className="mt-8 space-y-2">
              {navItems.map(item => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/patient'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm transition-all duration-300 ${
                        isActive
                          ? 'bg-[var(--softLime)] text-[var(--textDark)] shadow-sm'
                          : 'text-[var(--textSoft)] hover:bg-white/80'
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-8 w-full flex items-center justify-center gap-2 rounded-full border border-[var(--borderSoft)] px-4 py-2 text-sm text-[var(--textSoft)] hover:bg-white transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <section className="space-y-6">
          <motion.div
            className="rounded-[32px] bg-white/70 border border-[var(--borderSoft)] shadow-lg p-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="text-sm text-[var(--textSoft)]">Good to see you{user?.name ? `, ${user.name}` : ''}.</div>
                <h1 className="serif-heading text-3xl text-[var(--textDark)]">You are making incredible progress this week.</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-[var(--softLime)] px-4 py-2 text-sm text-[var(--textDark)] font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--primaryGreen)] animate-pulse" />
                  Recovery streak: {dashboard?.streak ?? 0} days
                </div>
                <NotificationBell />
              </div>
            </div>
          </motion.div>

          <Outlet />
        </section>
      </div>
    </div>
  )
}
