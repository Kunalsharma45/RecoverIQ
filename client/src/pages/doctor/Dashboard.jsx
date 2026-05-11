import React from 'react'
import { motion } from 'motion/react'

const stats = [
  { label: 'Active Recovery Patients', value: '24', change: '+12% this month' },
  { label: 'Recovery Success Rate', value: '92%', change: '+3% this quarter' },
  { label: 'Pending Requests', value: '6', change: 'Awaiting review' },
  { label: "Today's Sessions", value: '4', change: 'Next at 11:00' },
]

export default function DoctorDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            className="rounded-[32px] bg-white/70 border border-[var(--borderSoft)] shadow-lg p-6 hover:-translate-y-1 transition-all duration-500"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: idx * 0.05 }}
            viewport={{ once: true }}
          >
            <div className="text-sm text-[var(--textSoft)]">{stat.label}</div>
            <div className="serif-heading text-3xl text-[var(--textDark)] mt-2">{stat.value}</div>
            <div className="text-xs text-[var(--textSoft)] mt-3">{stat.change}</div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-[32px] bg-[var(--cream)] border border-[var(--borderSoft)] shadow-lg p-8">
        <h2 className="serif-heading text-2xl">Recovery Overview</h2>
        <p className="mt-3 text-[var(--textSoft)]">
          A calm snapshot of active recoveries, upcoming reviews, and patient progress.
        </p>
      </div>
    </div>
  )
}
