import React from 'react'
import { motion } from 'motion/react'
import { Calendar, User, Target, TrendingUp } from 'lucide-react'

export default function RecoveryProgramCard({ program }) {
  if (!program) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
      >
        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-[var(--primaryGreen)] mb-4">
          <Target size={24} />
        </div>
        <div className="text-sm text-slate-500 mb-1">Active Program</div>
        <div className="font-bold text-slate-900">{program.program_title}</div>
      </motion.div>

      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
      >
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
          <Calendar size={24} />
        </div>
        <div className="text-sm text-slate-500 mb-1">Duration</div>
        <div className="font-bold text-slate-900">{program.duration_days} Days</div>
      </motion.div>

      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
      >
        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
          <User size={24} />
        </div>
        <div className="text-sm text-slate-500 mb-1">Assigned Doctor</div>
        <div className="font-bold text-slate-900">Dr. {program.doctor?.name || 'Assigned soon'}</div>
      </motion.div>

      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
          <TrendingUp size={24} />
        </div>
        <div className="text-sm text-slate-500 mb-1">Recovery Progress</div>
        <div className="font-bold text-slate-900">{program.overall_progress}%</div>
      </motion.div>
    </div>
  )
}
