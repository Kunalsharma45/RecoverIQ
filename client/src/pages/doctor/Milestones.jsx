import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Flag, Search, Filter, Plus, Loader2, MoreVertical, 
  CheckCircle2, Clock, AlertCircle, Calendar, User, 
  Trash2, Edit3, X, ChevronRight, MessageSquare
} from 'lucide-react'
import { doctorApi } from '../../lib/api'
import MilestoneTimeline from '../../components/shared/MilestoneTimeline.jsx'

export default function DoctorMilestones() {
  const [milestones, setMilestones] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [showReviewModal, setShowReviewModal] = React.useState(false)
  const [selectedProgress, setSelectedProgress] = React.useState(null)
  const [reviewData, setReviewData] = React.useState({ status: 'Completed', doctor_notes: '' })
  const [search, setSearch] = React.useState('')
  const [filterStatus, setFilterStatus] = React.useState('all')
  const [programs, setPrograms] = React.useState([])
  const [selectedProgram, setSelectedProgram] = React.useState('')

  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [msRes, progRes] = await Promise.all([
        doctorApi.getMilestones(),
        doctorApi.getPrograms()
      ])
      setMilestones(msRes.data)
      setPrograms(progRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = (progress) => {
    setSelectedProgress(progress)
    setReviewData({ 
      status: progress.status === 'Completed' ? 'Completed' : 'Completed', 
      doctor_notes: progress.doctor_notes || '' 
    })
    setShowReviewModal(true)
  }

  const submitReview = async () => {
    try {
      await doctorApi.reviewMilestone(selectedProgress.id, reviewData)
      setShowReviewModal(false)
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredMilestones = milestones.filter(m => {
    const matchesSearch = m.patient?.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
                          m.milestone?.title?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus
    const matchesProgram = !selectedProgram || m.milestone?.program_id === parseInt(selectedProgram)
    return matchesSearch && matchesStatus && matchesProgram
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-[var(--primaryGreen)] animate-spin" />
        <p className="text-slate-500 font-medium">Loading milestone tracking...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[var(--primaryGreen)] mb-2">
            <Flag size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">Management</span>
          </div>
          <h1 className="serif-heading text-4xl text-slate-900">Patient Milestones</h1>
          <p className="mt-2 text-slate-500 max-w-xl">
            Monitor patient progress, review completions, and manage rehabilitation phases for your assigned patients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[var(--primaryGreen)] text-white px-6 py-3 rounded-2xl shadow-lg shadow-green-200 hover:bg-green-700 transition-all flex items-center gap-2 font-bold"
          >
            <Plus size={20} />
            Create Milestone
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white/70 backdrop-blur-md p-6 rounded-[32px] border border-white shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by patient or milestone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[var(--primaryGreen)]/20 transition-all"
          />
        </div>

        <select 
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          className="px-6 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[var(--primaryGreen)]/20 transition-all font-medium text-slate-600"
        >
          <option value="">All Programs</option>
          {programs.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-6 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[var(--primaryGreen)]/20 transition-all font-medium text-slate-600"
        >
          <option value="all">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Needs Review">Needs Review</option>
          <option value="In Progress">In Progress</option>
          <option value="Missed">Missed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Milestone List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMilestones.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                    D{item.milestone?.due_day}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-[var(--primaryGreen)] transition-colors">{item.milestone?.title}</h3>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.milestone?.program?.name}</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                  item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  item.status === 'Needs Review' ? 'bg-amber-100 text-amber-700' :
                  item.status === 'Missed' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.status}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <User size={14} className="text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Patient</div>
                    <div className="text-sm font-semibold text-slate-800">{item.patient?.user?.name}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{item.completed_at ? new Date(item.completed_at).toLocaleDateString() : 'Not completed'}</span>
                  </div>
                  {item.status === 'Completed' && (
                    <div className="text-[var(--primaryGreen)] flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      Done
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center gap-2">
                  <button 
                    onClick={() => handleReview(item)}
                    className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={14} />
                    Review & Notes
                  </button>
                  <button className="p-2.5 rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredMilestones.length === 0 && (
        <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[40px] border border-dashed border-slate-200">
          <Flag size={48} className="mx-auto text-slate-200 mb-4" />
          <h2 className="text-xl font-bold text-slate-800">No milestones matching your filters</h2>
          <p className="text-slate-500 mt-1">Try broadening your search or filter criteria.</p>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] max-w-xl w-full p-8 shadow-2xl overflow-hidden relative"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="serif-heading text-3xl text-slate-900">Review Completion</h2>
                <p className="text-slate-500 text-sm mt-1">Patient: {selectedProgress?.patient?.user?.name}</p>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Update Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Completed', 'Needs Review', 'Missed', 'In Progress'].map(status => (
                    <button
                      key={status}
                      onClick={() => setReviewData({ ...reviewData, status })}
                      className={`py-3 px-4 rounded-2xl text-sm font-bold border-2 transition-all ${
                        reviewData.status === status 
                        ? 'border-[var(--primaryGreen)] bg-green-50 text-[var(--primaryGreen)]' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Doctor Feedback</label>
                <textarea 
                  rows={4}
                  placeholder="Provide instructions, feedback or notes for the patient..."
                  value={reviewData.doctor_notes}
                  onChange={(e) => setReviewData({ ...reviewData, doctor_notes: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-[var(--primaryGreen)]/20 transition-all resize-none text-sm"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitReview}
                  className="flex-1 py-4 rounded-2xl font-bold bg-[var(--primaryGreen)] text-white shadow-lg shadow-green-200 hover:bg-green-700 transition-all"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Simple Create Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
          <div className="bg-white rounded-[40px] max-w-xl w-full p-12 text-center">
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--primaryGreen)]">
                <Plus size={40} />
             </div>
             <h2 className="serif-heading text-3xl mb-4">Create New Milestone</h2>
             <p className="text-slate-500 mb-8">This would open a multi-step form to create milestones with difficulty, duration, and instructions as defined in the plan.</p>
             <button 
              onClick={() => setShowCreateModal(false)}
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold"
             >
               Understood
             </button>
          </div>
        </div>
      )}
    </div>
  )
}
