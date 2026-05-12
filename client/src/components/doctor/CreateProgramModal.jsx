import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X, ChevronRight, ChevronLeft, Plus, Trash2,
  Settings, Flag, Eye, Check, Info,
  Activity, Clock, Target, AlertTriangle
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorApi } from '../../lib/api'

const CATEGORIES = ['Orthopedic', 'Neurological', 'Sports Recovery', 'Post-Surgery']
const DIFFICULTIES = ['Beginner', 'Moderate', 'Intensive']
const INTENSITIES = ['Low', 'Medium', 'High']

export default function CreateProgramModal({ isOpen, onClose, editingProgram = null }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    duration_days: 30,
    description: '',
    category: 'Orthopedic',
    difficulty: 'Beginner',
    target_patients: '',
    recovery_focus: '',
    milestones: []
  })

  React.useEffect(() => {
    if (editingProgram) {
      setFormData({
        name: editingProgram.name || '',
        duration_days: editingProgram.duration_days || 30,
        description: editingProgram.description || '',
        category: editingProgram.category || 'Orthopedic',
        difficulty: editingProgram.difficulty || 'Beginner',
        target_patients: editingProgram.target_patients || '',
        recovery_focus: editingProgram.recovery_focus || '',
        milestones: editingProgram.milestones || []
      })
    } else {
      resetForm()
    }
  }, [editingProgram, isOpen])

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data) => doctorApi.createProgram(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctor-programs'])
      onClose()
      resetForm()
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data) => doctorApi.updateProgram(editingProgram.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctor-programs'])
      queryClient.invalidateQueries(['doctor-program-detail', editingProgram.id])
      onClose()
      resetForm()
    }
  })

  const resetForm = () => {
    setStep(1)
    setFormData({
      name: '',
      duration_days: 30,
      description: '',
      category: 'Orthopedic',
      difficulty: 'Beginner',
      target_patients: '',
      recovery_focus: '',
      milestones: []
    })
  }

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          title: '',
          description: '',
          due_day: prev.milestones.length > 0 ? Math.max(...prev.milestones.map(m => m.due_day)) + 7 : 1,
          difficulty: 'Beginner',
          intensity: 'Low',
          duration_minutes: 15,
          exercise_instructions: '',
          precautions: '',
          recovery_goals: ''
        }
      ]
    }))
  }

  const removeMilestone = (index) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }))
  }

  const updateMilestone = (index, field, value) => {
    const newMilestones = [...formData.milestones]
    newMilestones[index] = { ...newMilestones[index], [field]: value }
    setFormData(prev => ({ ...prev, milestones: newMilestones }))
  }

  const handleSubmit = () => {
    if (editingProgram) {
      updateMutation.mutate(formData)
    } else {
      createMutation.mutate(formData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="relative w-full max-w-5xl bg-white rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-[var(--cream)]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-8 h-8 rounded-full bg-emerald-900 text-white flex items-center justify-center text-xs font-bold">
                {step}
              </span>
              <h2 className="serif-heading text-3xl text-slate-900">
                {editingProgram ? 'Edit Recovery Program' : (step === 1 ? 'Program Foundations' : step === 2 ? 'Milestone Blueprint' : 'Final Review')}
              </h2>
            </div>
            <p className="text-slate-500 text-sm ml-11">
              {step === 1 ? 'Define the basic structure and focus of the rehabilitation journey.' :
                step === 2 ? 'Create a structured path with specific recovery goals.' :
                  'Review your program before publishing it to the studio.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-10 py-10 scrollbar-none">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Program Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Advanced ACL Recovery"
                    className="w-full px-6 py-4 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 placeholder:text-slate-300 font-medium transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Days)</label>
                  <div className="flex gap-3">
                    {[15, 30, 45, 60].map(d => (
                      <button
                        key={d}
                        onClick={() => setFormData(p => ({ ...p, duration_days: d }))}
                        className={`flex-1 py-4 rounded-3xl font-bold text-sm transition-all ${formData.duration_days === d
                            ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-900/20'
                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                          }`}
                      >
                        {d} Days
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-6 py-4 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 font-medium transition-all appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Difficulty</label>
                  <div className="flex gap-3">
                    {DIFFICULTIES.map(d => (
                      <button
                        key={d}
                        onClick={() => setFormData(p => ({ ...p, difficulty: d }))}
                        className={`flex-1 py-4 rounded-3xl font-bold text-sm transition-all ${formData.difficulty === d
                            ? 'bg-white text-emerald-900 ring-2 ring-emerald-900/10 shadow-sm'
                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                          }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Program Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Provide a high-level overview of the recovery goals..."
                  className="w-full px-6 py-4 rounded-[32px] bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 placeholder:text-slate-300 font-medium transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Patients</label>
                  <input
                    type="text"
                    value={formData.target_patients}
                    onChange={(e) => setFormData(p => ({ ...p, target_patients: e.target.value }))}
                    placeholder="e.g. Athletes, Seniors..."
                    className="w-full px-6 py-4 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 font-medium transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recovery Focus</label>
                  <input
                    type="text"
                    value={formData.recovery_focus}
                    onChange={(e) => setFormData(p => ({ ...p, recovery_focus: e.target.value }))}
                    placeholder="e.g. Mobility, Strength..."
                    className="w-full px-6 py-4 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 font-medium transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900">Program Milestones</h3>
                <button
                  onClick={addMilestone}
                  className="flex items-center gap-2 text-emerald-700 font-bold text-sm hover:text-emerald-900 transition-colors"
                >
                  <Plus size={18} />
                  Add Milestone
                </button>
              </div>

              <div className="space-y-6">
                {formData.milestones.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                    <Flag className="mx-auto text-slate-200 mb-4" size={40} />
                    <p className="text-slate-400 font-medium">No milestones added yet.</p>
                    <button
                      onClick={addMilestone}
                      className="mt-4 text-emerald-700 font-bold text-sm underline underline-offset-4"
                    >
                      Add your first milestone
                    </button>
                  </div>
                ) : (
                  formData.milestones.map((ms, idx) => (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden"
                    >
                      <div className="px-8 py-6 bg-slate-50/50 flex items-center justify-between border-b border-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-900 text-white flex items-center justify-center text-xs font-black">
                            {idx + 1}
                          </div>
                          <input
                            type="text"
                            value={ms.title}
                            onChange={(e) => updateMilestone(idx, 'title', e.target.value)}
                            placeholder="Milestone Title"
                            className="bg-transparent border-none focus:ring-0 text-slate-900 font-bold placeholder:text-slate-300 w-[300px]"
                          />
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-slate-400" />
                            <input
                              type="number"
                              value={ms.due_day}
                              onChange={(e) => updateMilestone(idx, 'due_day', parseInt(e.target.value))}
                              className="w-12 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-600 p-0"
                            />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Day</span>
                          </div>
                          <button
                            onClick={() => removeMilestone(idx)}
                            className="text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Exercise Instructions</label>
                            <textarea
                              rows={3}
                              value={ms.exercise_instructions}
                              onChange={(e) => updateMilestone(idx, 'exercise_instructions', e.target.value)}
                              placeholder="Step-by-step guidance..."
                              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/10 outline-none text-sm text-slate-600 placeholder:text-slate-300 transition-all resize-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Intensity</label>
                              <select
                                value={ms.intensity}
                                onChange={(e) => updateMilestone(idx, 'intensity', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none text-xs font-bold text-slate-600"
                              >
                                {INTENSITIES.map(i => <option key={i} value={i}>{i}</option>)}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Min)</label>
                              <input
                                type="number"
                                value={ms.duration_minutes}
                                onChange={(e) => updateMilestone(idx, 'duration_minutes', parseInt(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none text-xs font-bold text-slate-600"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Precautions</label>
                            <textarea
                              rows={3}
                              value={ms.precautions}
                              onChange={(e) => updateMilestone(idx, 'precautions', e.target.value)}
                              placeholder="Pain triggers to watch for..."
                              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/10 outline-none text-sm text-slate-600 placeholder:text-slate-300 transition-all resize-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recovery Goals</label>
                            <input
                              type="text"
                              value={ms.recovery_goals}
                              onChange={(e) => updateMilestone(idx, 'recovery_goals', e.target.value)}
                              placeholder="e.g. Full knee extension"
                              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/10 outline-none text-sm text-slate-600 placeholder:text-slate-300 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div className="bg-emerald-900 rounded-[40px] p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h3 className="serif-heading text-4xl mb-2">{formData.name || 'Untitled Program'}</h3>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">{formData.category}</span>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">{formData.duration_days} Days</span>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">{formData.difficulty}</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Milestones</div>
                      <div className="text-2xl font-black">{formData.milestones.length}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <Target size={18} className="text-emerald-700" />
                      Recovery Journey
                    </h4>
                    <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                      {formData.milestones.map((ms, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-emerald-900 border-4 border-white shadow-sm" />
                          <div className="bg-white rounded-3xl p-6 border border-slate-100">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-bold text-slate-900">Day {ms.due_day}: {ms.title || 'Untitled Milestone'}</h5>
                              <span className="px-2 py-0.5 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">{ms.intensity}</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">{ms.exercise_instructions || 'No instructions provided.'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-[var(--cream)] rounded-[32px] p-8 border border-slate-200/50">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Info size={18} className="text-emerald-700" />
                      Quick Summary
                    </h4>
                    <div className="space-y-6">
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Audience</div>
                        <p className="text-sm font-medium text-slate-700">{formData.target_patients || 'General Patients'}</p>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recovery Focus</div>
                        <p className="text-sm font-medium text-slate-700">{formData.recovery_focus || 'Comprehensive Recovery'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="px-10 py-8 border-t border-slate-100 flex items-center justify-between bg-white">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className={`flex items-center gap-2 font-bold text-sm transition-all ${step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            <ChevronLeft size={18} />
            Previous Step
          </button>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-emerald-900' : 'bg-slate-200'
                  }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (step < 3) setStep(s => s + 1)
              else handleSubmit()
            }}
            disabled={createMutation.isPending || updateMutation.isPending}
            className="flex items-center gap-2 bg-emerald-900 text-white px-8 py-4 rounded-full text-sm font-bold shadow-xl shadow-emerald-900/10 hover:bg-emerald-800 transition-all disabled:opacity-50"
          >
            {createMutation.isPending || updateMutation.isPending ? 'Saving...' : step === 3 ? (editingProgram ? 'Save Changes' : 'Publish Program') : 'Continue'}
            {step < 3 && <ChevronRight size={18} />}
            {step === 3 && !(createMutation.isPending || updateMutation.isPending) && <Check size={18} />}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
