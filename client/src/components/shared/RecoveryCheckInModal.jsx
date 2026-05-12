import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Activity, Zap, Smile, Info, MessageCircle, TrendingUp } from 'lucide-react'

export default function RecoveryCheckInModal({ milestone, isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = React.useState({
    pain_level: 0,
    energy_level: 3,
    mobility_score: 'Moderate',
    exercise_completion: 100,
    mood: 'Neutral',
    difficulties: '',
    improvements: ''
  })
  const [submitting, setSubmitting] = React.useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[var(--primaryGreen)] mb-1">
              <TrendingUp size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Daily Check-In</span>
            </div>
            <h2 className="serif-heading text-2xl text-slate-900">Day {milestone.due_day}: Recovery Log</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Pain Level */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Activity size={18} className="text-red-500" />
                Pain Level (0-10)
              </label>
              <span className={`text-xl font-black ${
                formData.pain_level > 7 ? 'text-red-500' : 
                formData.pain_level > 4 ? 'text-amber-500' : 'text-green-500'
              }`}>
                {formData.pain_level}
              </span>
            </div>
            <input 
              type="range" min="0" max="10" step="1"
              value={formData.pain_level}
              onChange={(e) => setFormData({...formData, pain_level: parseInt(e.target.value)})}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[var(--primaryGreen)]"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <span>0 - No Pain</span>
              <span>10 - Severe</span>
            </div>
          </div>

          {/* Energy Level */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              Energy Level
            </label>
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFormData({...formData, energy_level: lvl})}
                  className={`py-3 rounded-2xl font-bold transition-all border-2 ${
                    formData.energy_level === lvl 
                    ? 'bg-amber-50 border-amber-400 text-amber-700' 
                    : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Mobility Score */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
              How is your mobility today?
            </label>
            <div className="flex flex-wrap gap-2">
              {['Very Stiff', 'Limited', 'Moderate', 'Improved', 'Fully Comfortable'].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setFormData({...formData, mobility_score: score})}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                    formData.mobility_score === score
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Completion */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <TrendingUp size={18} className="text-green-500" />
                Exercise Completion
              </label>
              <span className="text-lg font-black text-slate-800">{formData.exercise_completion}%</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setFormData({...formData, exercise_completion: pct})}
                  className={`py-3 rounded-2xl font-bold border-2 transition-all ${
                    formData.exercise_completion === pct
                    ? 'bg-green-50 border-[var(--primaryGreen)] text-[var(--primaryGreen)]'
                    : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Smile size={18} className="text-pink-500" />
              Your Mental State
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {['Motivated', 'Neutral', 'Frustrated', 'Tired', 'Confident'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFormData({...formData, mood: m})}
                  className={`py-2 px-1 rounded-xl text-[10px] font-bold border-2 transition-all ${
                    formData.mood === m
                    ? 'bg-pink-50 border-pink-400 text-pink-700'
                    : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Info size={18} className="text-amber-500" />
                Difficulties Faced
              </label>
              <textarea 
                rows={3}
                placeholder="Any pain while bending? Fatigue?"
                value={formData.difficulties}
                onChange={(e) => setFormData({...formData, difficulties: e.target.value})}
                className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[var(--primaryGreen)]/20 transition-all text-sm"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MessageCircle size={18} className="text-green-500" />
                Improvements Felt
              </label>
              <textarea 
                rows={3}
                placeholder="Walking easier? Less stiffness?"
                value={formData.improvements}
                onChange={(e) => setFormData({...formData, improvements: e.target.value})}
                className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[var(--primaryGreen)]/20 transition-all text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="flex-[2] py-4 rounded-2xl font-bold bg-[var(--primaryGreen)] text-white shadow-lg shadow-green-200 hover:bg-green-700 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? 'Saving...' : 'Submit Recovery Log'}
              {!submitting && <TrendingUp size={18} />}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
