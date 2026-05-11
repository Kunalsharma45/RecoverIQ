import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  ClipboardList,
  Flag,
  FileText,
  BarChart3,
  UserCircle,
  LogOut,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useAuth } from '../context/AuthContext.jsx'

const navItems = [
  { to: '/doctor', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/doctor/appointments', label: 'Appointments', icon: CalendarCheck },
  { to: '/doctor/patients', label: 'Patients', icon: Users },
  { to: '/doctor/programs', label: 'Rehabilitation Programs', icon: ClipboardList },
  { to: '/doctor/milestones', label: 'Milestones', icon: Flag },
  { to: '/doctor/reviews', label: 'Reviews & Notes', icon: FileText },
  { to: '/doctor/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/doctor/profile', label: 'Profile', icon: UserCircle },
]

export default function DoctorLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-[var(--mutedWhite)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <aside className="rounded-[32px] border border-white/20 shadow-xl backdrop-blur-xl bg-[rgba(250,249,247,0.75)] p-6">
          <div className="serif-heading text-2xl text-[var(--primaryGreen)]">RecoverIQ</div>
          <p className="mt-2 text-sm text-[var(--textSoft)]">Doctor Workspace</p>

          <nav className="mt-8 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/doctor'}
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-sm text-[var(--textSoft)]">Welcome back{user?.name ? `, Dr. ${user.name}` : ''}.</div>
                <h1 className="serif-heading text-3xl text-[var(--textDark)]">Helping patients recover stronger every day.</h1>
              </div>
              <div className="rounded-full bg-[var(--softLime)] px-4 py-2 text-sm text-[var(--textDark)]">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </motion.div>

          <Outlet />
        </section>
      </div>
    </div>
  )
}
