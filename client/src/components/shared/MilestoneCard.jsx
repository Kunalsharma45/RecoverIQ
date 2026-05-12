import React from 'react'
import { motion } from 'motion/react'
import { 
  ChevronRight, CheckCircle2, Clock, 
  Play, Lock, Info, Activity, Star,
  PlayCircle, BookOpen
} from 'lucide-react'

export default function MilestoneCard({ milestone, onComplete, onShowDetails }) {
  const isLocked = milestone.is_locked
  const isAvailableToday = milestone.is_available_today
  const isCompleted = milestone.status === 'Completed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group rounded-[32px] overflow-hidden transition-all duration-500 border-2 ${
        isCompleted ? 'bg-green-50/50 border-green-200' : 
        isAvailableToday ? 'bg-white border-[var(--primaryGreen)] shadow-xl shadow-green-100 ring-4 ring-green-50' : 
        isLocked ? 'bg-slate-50/50 border-slate-100 opacity-60' : 'bg-white border-slate-100 shadow-sm'
      }`}
    >
      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/10 backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-slate-400">
            <Lock size={20} />
          </div>
          {!isCompleted && (
             <div className="mt-3 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest shadow-sm">
               Available: {new Date(milestone.scheduled_date).toLocaleDateString()}
             </div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${
              isCompleted ? 'bg-green-100 text-green-700' :
              isAvailableToday ? 'bg-[var(--primaryGreen)] text-white scale-110 shadow-lg' : 'bg-slate-100 text-slate-400'
            }`}>
              {milestone.due_day}
            </div>
            <div>
              <h3 className={`font-bold text-lg transition-colors ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                {milestone.title}
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                <Clock size={12} />
                {milestone.duration} mins • {milestone.difficulty}
              </div>
            </div>
          </div>
          
          {isCompleted && (
            <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
              <CheckCircle2 size={12} />
              Done
            </div>
          )}
        </div>

        <p className={`text-sm mb-6 line-clamp-2 leading-relaxed ${isLocked ? 'text-slate-300' : 'text-slate-500'}`}>
          {milestone.description}
        </p>

        <div className="flex items-center gap-2">
          {isAvailableToday && (
            <motion.button
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              onClick={() => onComplete(milestone)}
              className="flex-1 bg-[var(--primaryGreen)] text-white py-3 rounded-2xl text-xs font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all flex items-center justify-center gap-2"
            >
              <Activity size={14} />
              Complete Today
            </motion.button>
          )}

          {!isAvailableToday && !isCompleted && isLocked && (
             <div className="flex-1 bg-slate-100 text-slate-400 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
               <Lock size={14} />
               Locked
             </div>
          )}

          {!isAvailableToday && !isCompleted && !isLocked && (
             <div className="flex-1 bg-slate-50 text-slate-400 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
               <Clock size={14} />
               Available Soon
             </div>
          )}

          {isCompleted && (
             <div className="flex-1 bg-green-100/50 text-green-600 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
               <CheckCircle2 size={14} />
               Completed
             </div>
          )}

          <button 
            onClick={() => onShowDetails(milestone)}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all border ${
              isCompleted ? 'bg-white border-green-200 text-green-700' : 
              isAvailableToday ? 'bg-slate-50 border-transparent text-slate-600' :
              'bg-slate-50 border-transparent text-slate-400'
            }`}
          >
            Details
          </button>
        </div>
      </div>
    </motion.div>
  )
}
