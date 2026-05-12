import React from 'react'
import { motion } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'
import MilestoneCard from './MilestoneCard.jsx'

export default function MilestoneTimeline({ milestones, onComplete, onShowDetails }) {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-[32px] border border-dashed border-slate-300">
        <p className="text-slate-500 font-medium">No milestones tracked yet.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {milestones.map((ms, index) => {
        const isCompleted = ms.status === 'Completed'
        const isAvailable = ms.is_available_today
        const isLocked = ms.is_locked

        return (
          <motion.div 
            key={ms.id} 
            className="flex gap-8 relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Timeline Connector */}
            {index !== milestones.length - 1 && (
              <div className={`absolute left-[23px] top-[48px] bottom-[-24px] w-[2px] transition-colors duration-1000 ${
                isCompleted ? 'bg-[var(--primaryGreen)]' : 'bg-slate-200 border-l-2 border-dotted border-slate-300'
              }`} />
            )}

            {/* Node */}
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                isCompleted ? 'bg-[var(--primaryGreen)] text-white shadow-lg shadow-green-100' : 
                isAvailable ? 'bg-white border-2 border-[var(--primaryGreen)] text-[var(--primaryGreen)] shadow-xl shadow-green-100 ring-4 ring-green-50' : 
                'bg-white border-2 border-slate-100 text-slate-300'
              }`}>
                {isCompleted ? <CheckCircle2 size={24} /> : <span className="font-black text-sm">{ms.due_day}</span>}
              </div>
            </div>

            {/* Card Container */}
            <div className="flex-1 pb-12">
              <MilestoneCard 
                milestone={ms} 
                onComplete={onComplete}
                onShowDetails={onShowDetails}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
