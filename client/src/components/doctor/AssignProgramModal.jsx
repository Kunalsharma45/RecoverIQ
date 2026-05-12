import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  X, Users, Search, Check, 
  ChevronRight, Calendar, User, 
  CheckCircle2, Info, ClipboardList
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorApi } from '../../lib/api'

export default function AssignProgramModal({ program, isOpen, onClose }) {
  const [search, setSearch] = useState('')
  const [selectedPatientId, setSelectedPatientId] = useState(null)
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  
  const queryClient = useQueryClient()
  
  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['doctor-patients-minimal'],
    queryFn: async () => {
      const res = await doctorApi.getPatients()
      return res.data
    },
    enabled: isOpen
  })

  const assignMutation = useMutation({
    mutationFn: (data) => doctorApi.assignProgram(data.patientId, { 
      program_id: program.id, 
      start_date: data.startDate 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctor-programs'])
      queryClient.invalidateQueries(['doctor-patients'])
      onClose()
    }
  })

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.patient_id.toLowerCase().includes(search.toLowerCase())
  )

  if (!isOpen || !program) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="px-8 py-8 border-b border-slate-100 flex items-center justify-between bg-emerald-50/30">
          <div>
            <h2 className="serif-heading text-2xl text-slate-900">Assign Program</h2>
            <p className="text-slate-500 text-xs mt-1 font-medium">Assigning <span className="text-emerald-700 font-bold">{program.name}</span></p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 scrollbar-none">
          {/* Search */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Search Patient</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name or Patient ID..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm"
              />
            </div>
          </div>

          {/* Patient List */}
          <div className="space-y-3">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Patient</label>
             <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 scrollbar-none">
               {isLoading ? (
                 [1,2,3].map(i => <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse" />)
               ) : filteredPatients.length === 0 ? (
                 <div className="text-center py-8 text-slate-400 text-sm italic">No patients found.</div>
               ) : (
                 filteredPatients.map(patient => (
                   <button
                     key={patient.id}
                     onClick={() => setSelectedPatientId(patient.id)}
                     className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                       selectedPatientId === patient.id 
                         ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                         : 'bg-white border-slate-100 hover:border-emerald-100'
                     }`}
                   >
                     <div className="flex items-center gap-4 text-left">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedPatientId === patient.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                         <User size={18} />
                       </div>
                       <div>
                         <div className="text-sm font-bold text-slate-900">{patient.name}</div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{patient.patient_id}</div>
                       </div>
                     </div>
                     {selectedPatientId === patient.id && <CheckCircle2 size={20} className="text-emerald-600" />}
                   </button>
                 ))
               )}
             </div>
          </div>

          {/* Start Date */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Program Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm font-bold text-slate-600"
              />
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-white">
          <button
            disabled={!selectedPatientId || assignMutation.isPending}
            onClick={() => assignMutation.mutate({ patientId: selectedPatientId, startDate })}
            className="w-full bg-emerald-900 text-white py-4 rounded-full text-sm font-bold shadow-xl shadow-emerald-900/10 hover:bg-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {assignMutation.isPending ? 'Assigning...' : 'Confirm Assignment'}
            {!assignMutation.isPending && <Check size={18} />}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
