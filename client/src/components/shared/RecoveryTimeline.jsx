import React from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, Circle } from 'lucide-react'

export default function RecoveryTimeline({ roadmap }) {
  if (!roadmap) return null

  const weeks = Object.keys(roadmap).sort((a, b) => a - b)

  return (
    <div className="space-y-6">
      {weeks.map((week, idx) => (
        <motion.div 
          key={week}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="relative pl-12 pb-8 last:pb-0"
        >
          {/* Connector */}
          {idx !== weeks.length - 1 && (
            <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-slate-100" />
          )}

          {/* Icon */}
          <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
            <span className="text-xs font-bold">{week}</span>
          </div>

          <div className="bg-white/50 backdrop-blur-sm border border-white/20 p-6 rounded-[24px] shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Week {week}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roadmap[week].map((ms) => (
                <div key={ms.id} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-50">
                  <div className="mt-0.5">
                    {ms.status === 'Completed' ? <CheckCircle2 size={16} className="text-green-500" /> : <Circle size={16} className="text-slate-300" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{ms.title}</div>
                    <div className="text-[10px] text-slate-500">Day {ms.due_day}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
