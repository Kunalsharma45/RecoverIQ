import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorApi } from '../../lib/api'
import { 
  Plus, Search, Filter, ClipboardList, Clock, 
  Target, BarChart, Users, ChevronRight, Copy, 
  Edit3, Trash2, MoreVertical, CheckCircle2,
  AlertCircle, Activity, Shield, Zap
} from 'lucide-react'
import CreateProgramModal from '../../components/doctor/CreateProgramModal'
import ProgramDetailDrawer from '../../components/doctor/ProgramDetailDrawer'

const CATEGORY_STYLES = {
  'Orthopedic': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
  'Neurological': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  'Sports Recovery': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
  'Post-Surgery': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
}

const DIFFICULTY_STYLES = {
  'Beginner': 'text-emerald-600',
  'Moderate': 'text-amber-600',
  'Intensive': 'text-rose-600',
}

function ProgramCard({ program, onClick, onDuplicate, onDelete }) {
  const catStyle = CATEGORY_STYLES[program.category] || CATEGORY_STYLES['Orthopedic']
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
      className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition-all group cursor-pointer relative overflow-hidden"
      onClick={() => onClick(program.id)}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 transition-all group-hover:bg-emerald-100" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
            {program.category}
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
            <button 
              onClick={(e) => { e.stopPropagation(); onDuplicate(program.id); }}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Copy size={16} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(program.id); }}
              className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <h3 className="serif-heading text-xl text-slate-900 mb-2 group-hover:text-emerald-800 transition-colors">
          {program.name}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-6 leading-relaxed">
          {program.description || 'No description provided.'}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
              <Clock size={16} />
            </div>
            <div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Duration</div>
              <div className="text-xs font-bold text-slate-900">{program.duration_days} Days</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
              <Target size={16} />
            </div>
            <div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Milestones</div>
              <div className="text-xs font-bold text-slate-900">{program.milestones_count} Total</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-600">{program.patients_count} Patients</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-600">{program.completion_rate}% Comp.</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function DoctorPrograms() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState(null)
  const [selectedProgramId, setSelectedProgramId] = useState(null)

  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['doctor-programs'],
    queryFn: async () => {
      const res = await doctorApi.getPrograms()
      return res.data
    }
  })

  const duplicateMutation = useMutation({
    mutationFn: (id) => doctorApi.duplicateProgram(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctor-programs'])
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => doctorApi.deleteProgram(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctor-programs'])
    }
  })

  const handleEditProgram = (program) => {
    setEditingProgram(program)
    setSelectedProgramId(null) // Close drawer
    setIsCreateModalOpen(true) // Open modal
  }

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false)
    setEditingProgram(null)
  }

  const filteredPrograms = useMemo(() => {
    return programs.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      const matchesFilter = filter === 'all' || p.category === filter
      return matchesSearch && matchesFilter
    })
  }, [programs, search, filter])

  return (
    <div className="space-y-10 pb-16 max-w-full overflow-x-hidden">
      {/* Header section */}
      <div className="relative overflow-hidden bg-[var(--cream)] rounded-[48px] p-10 border border-slate-200/50 shadow-xl shadow-slate-100/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-emerald-700 mb-5">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                <ClipboardList size={18} />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Program Management</span>
            </div>
            <h1 className="serif-heading text-5xl text-slate-900 mb-4">Rehabilitation Studio</h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Design, manage, and assign evidence-based recovery journeys for your patients.
            </p>
          </div>
          
          <button 
            onClick={() => {
              setEditingProgram(null)
              setIsCreateModalOpen(true)
            }}
            className="group relative inline-flex items-center gap-3 bg-emerald-900 text-white px-8 py-4 rounded-full text-sm font-bold shadow-2xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all overflow-hidden shrink-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Plus size={20} />
            Create New Program
          </button>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl -ml-32 -mb-32 pointer-events-none" />
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between px-2">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search programs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-full bg-white border border-slate-100 shadow-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-300 outline-none transition-all text-sm"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {['all', 'Orthopedic', 'Neurological', 'Sports Recovery', 'Post-Surgery'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filter === cat 
                  ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-900/20' 
                  : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-80 bg-white rounded-[32px] animate-pulse border border-slate-50" />
          ))}
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[48px] border border-dashed border-slate-200">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
            <ClipboardList size={32} className="text-slate-300" />
          </div>
          <h3 className="serif-heading text-2xl text-slate-900 mb-2">No programs found</h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            Try adjusting your filters or create your first rehabilitation program.
          </p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPrograms.map(program => (
              <ProgramCard 
                key={program.id} 
                program={program} 
                onClick={setSelectedProgramId}
                onDuplicate={duplicateMutation.mutate}
                onDelete={deleteMutation.mutate}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modals and Drawers */}
      <CreateProgramModal 
        isOpen={isCreateModalOpen} 
        onClose={handleCloseCreateModal}
        editingProgram={editingProgram}
      />
      
      <ProgramDetailDrawer 
        programId={selectedProgramId} 
        isOpen={!!selectedProgramId}
        onClose={() => setSelectedProgramId(null)}
        onEdit={handleEditProgram}
      />
    </div>
  )
}
