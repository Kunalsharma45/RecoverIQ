import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  HeartPulse,
  Flag,
  CalendarCheck,
  MessageCircle,
  LineChart,
  Settings,
  LogOut,
  Bell,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext.jsx'

const navItems = [
  { to: '/patient', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patient/program', label: 'Recovery Program', icon: HeartPulse },
  { to: '/patient/milestones', label: 'Milestones', icon: Flag },
  { to: '/patient/appointments', label: 'Appointments', icon: CalendarCheck },
  { to: '/patient/reviews', label: 'Doctor Reviews', icon: MessageCircle },
  { to: '/patient/timeline', label: 'Progress Timeline', icon: LineChart },
  { to: '/patient/settings', label: 'Settings', icon: Settings },
]

export default function PatientLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-[var(--mutedWhite)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <aside className="rounded-[32px] border border-white/20 shadow-xl backdrop-blur-xl bg-[rgba(250,249,247,0.75)] p-6">
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

          <button
            type="button"
            onClick={logout}
            className="mt-8 w-full flex items-center justify-center gap-2 rounded-full border border-[var(--borderSoft)] px-4 py-2 text-sm text-[var(--textSoft)] hover:bg-white"
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
                <div className="rounded-full bg-[var(--softLime)] px-4 py-2 text-sm text-[var(--textDark)]">Recovery streak: 5 days</div>
                <div className="rounded-full border border-[var(--borderSoft)] p-2 text-[var(--textSoft)]">
                  <Bell size={18} />
                </div>
              </div>
            </div>
          </motion.div>

          <Outlet />
        </section>
      </div>
    </div>
  )
}
