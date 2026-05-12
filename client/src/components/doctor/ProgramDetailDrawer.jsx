import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  X, Clock, Target, Users, Activity, 
  ChevronRight, Calendar, Target as TargetIcon,
  Zap, Shield, Info, Edit3, Trash2, 
  CheckCircle2, Plus, AlertCircle, TrendingUp,
  BarChart3, PieChart, LineChart, FileText
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorApi } from '../../lib/api'
import AssignProgramModal from './AssignProgramModal'

export default function ProgramDetailDrawer({ programId, isOpen, onClose, onEdit }) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  
  const queryClient = useQueryClient()
  const { data: program, isLoading } = useQuery({
    queryKey: ['doctor-program-detail', programId],
    queryFn: async () => {
      const res = await doctorApi.getProgramDetail(programId)
      return res.data
    },
    enabled: !!programId && isOpen
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-[var(--mutedWhite)] shadow-2xl h-full flex flex-col"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute left-[-64px] top-8 w-12 h-12 rounded-full bg-white text-slate-400 flex items-center justify-center hover:text-slate-900 shadow-xl transition-all"
        >
          <X size={20} />
        </button>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-900/10 border-t-emerald-900 animate-spin" />
          </div>
        ) : program ? (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-none">
              {/* Header / Hero */}
              <div className="relative bg-emerald-900 px-10 py-16 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                      {program.category}
                    </span>
                    <span className="px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                      {program.difficulty}
                    </span>
                  </div>
                  <h2 className="serif-heading text-5xl mb-4 leading-tight">{program.name}</h2>
                  <div className="flex gap-6 text-emerald-100/60 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {program.duration_days} Days
                    </div>
                    <div className="flex items-center gap-2">
                      <TargetIcon size={16} />
                      {program.milestones?.length || 0} Milestones
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Switcher - REMOVED ANALYTICS */}
              <div className="px-10 py-6 bg-white border-b border-slate-100 sticky top-0 z-30 flex gap-8">
                <div className="text-sm font-black uppercase tracking-[0.2em] pb-2 border-b-2 border-emerald-900 text-slate-900">
                  Program Blueprint
                </div>
              </div>

              <div className="px-10 py-10">
                <div className="space-y-12">
                  {/* Summary Card */}
                  <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Info size={18} className="text-emerald-700" />
                      Program Overview
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-8">
                      {program.description || 'A comprehensive rehabilitation journey.'}
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Patients</div>
                        <div className="text-xs font-bold text-slate-700">{program.target_patients || 'General'}</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Recovery Focus</div>
                        <div className="text-xs font-bold text-slate-700">{program.recovery_focus || 'Mobility'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-10">
                    <h3 className="serif-heading text-3xl text-slate-900">Journey Roadmap</h3>
                    <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {program.milestones?.map((ms, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[30px] top-0 w-4 h-4 rounded-full bg-emerald-900 border-4 border-[var(--mutedWhite)] shadow-sm" />
                          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Day {ms.due_day}</div>
                                <h4 className="font-bold text-slate-900 text-lg">{ms.title}</h4>
                              </div>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed mb-6 italic">
                              "{ms.exercise_instructions}"
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100/50">
                                <div className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">Precautions</div>
                                <p className="text-xs font-bold text-rose-700 leading-tight">{ms.precautions || 'Watch pain levels'}</p>
                              </div>
                              <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
                                <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Goals</div>
                                <p className="text-xs font-bold text-emerald-700 leading-tight">{ms.recovery_goals || 'Increase ROM'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-8 border-t border-slate-100 bg-white flex gap-4">
              <button 
                onClick={() => onEdit(program)}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-full text-sm font-bold shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all"
              >
                <Edit3 size={18} />
                Edit Program
              </button>
              <button 
                onClick={() => setIsAssignModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-600 py-4 rounded-full text-sm font-bold hover:bg-slate-50 transition-all"
              >
                <Users size={18} />
                Assign to Patients
              </button>
            </div>

            <AssignProgramModal 
              program={program} 
              isOpen={isAssignModalOpen} 
              onClose={() => setIsAssignModalOpen(false)} 
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
             <AlertCircle size={48} className="text-slate-200 mb-4" />
             <h3 className="serif-heading text-2xl text-slate-900 mb-2">Something went wrong</h3>
             <p className="text-slate-500">Could not load program details.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
