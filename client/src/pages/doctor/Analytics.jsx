import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  BarChart3, 
  Users, 
  Activity, 
  Target, 
  RefreshCw,
  Download,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { motion } from 'framer-motion'
import { doctorApi } from '../../lib/api'

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('30')
  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ['doctor-analytics', timeframe],
    queryFn: () => doctorApi.getAnalytics({ days: timeframe }).then(res => res.data)
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    )
  }

  if (!analytics) return null

  const { stats, charts, risk_patients, top_patients } = analytics

  return (
    <div className="space-y-8 pb-12 max-w-full overflow-x-hidden">
      {/* Compact Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="serif-heading text-3xl text-slate-900">Recovery Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor patient recovery and rehabilitation progress.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 cursor-pointer"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* KPI Row - Small & Minimal */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard label="Active Patients" value={stats.active_patients} icon={Users} color="emerald" />
        <KPICard label="Avg Recovery %" value={`${stats.completion_rate}%`} icon={CheckCircle2} color="olive" />
        <KPICard label="Pain Reduction" value={stats.avg_pain_reduction} icon={Activity} color="rose" />
        <KPICard label="Adherence Rate" value={`${stats.avg_adherence}%`} icon={Target} color="teal" />
      </div>

      {/* Main Content Layout (70/30) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (70%) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recovery Trend Chart */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="serif-heading text-xl text-slate-900">Recovery Trend</h2>
                <p className="text-xs text-slate-500 mt-0.5">Average milestone progression across all patients</p>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.recovery}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.05}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={[0, 'auto']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', fontSize: '12px' }}
                    labelStyle={{ color: '#64748b', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completions" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#chartGradient)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Program Performance */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h2 className="serif-heading text-xl text-slate-900 mb-6">Program Performance</h2>
            <div className="space-y-5">
              {charts.programs.slice(0, 4).map((prog, idx) => (
                <div key={idx} className="flex items-center gap-6">
                  <div className="w-1/3 min-w-[140px]">
                    <div className="text-sm font-medium text-slate-800 truncate">{prog.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{prog.patients} Patients</div>
                  </div>
                  <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${prog.completion_rate}%` }}
                      className="h-full bg-emerald-700 rounded-full"
                    />
                  </div>
                  <div className="w-12 text-right text-xs font-black text-slate-700">
                    {prog.completion_rate}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (30%) */}
        <div className="space-y-8">
          {/* Patient Attention List */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h2 className="serif-heading text-lg text-slate-900 mb-5">Attention Needed</h2>
            <div className="space-y-4">
              {risk_patients.slice(0, 5).map((patient, idx) => (
                <div key={idx} className="flex items-start gap-3 group cursor-pointer">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${patient.risk_score > 60 ? 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]' : 'bg-amber-400'}`} />
                  <div>
                    <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{patient.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                      {patient.risk_score > 60 ? 'Stagnating progress' : 'Missed logs recently'}
                    </div>
                  </div>
                </div>
              ))}
              {risk_patients.length === 0 && (
                <div className="text-center py-6">
                  <CheckCircle2 size={24} className="mx-auto text-emerald-100 mb-2" />
                  <p className="text-[10px] text-slate-400 font-medium">All patients stable</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KPICard({ label, value, icon: Icon, color }) {
  const colors = {
    emerald: 'text-emerald-600',
    olive: 'text-emerald-800',
    rose: 'text-rose-500',
    teal: 'text-teal-600',
  }
  
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-2">
        <Icon size={14} className={colors[color]} />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
    </div>
  )
}

function InsightCard({ text, icon: Icon, color }) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-700',
    olive: 'bg-[var(--softLime)] text-emerald-900',
    teal: 'bg-teal-50 text-teal-700',
  }
  
  return (
    <div className={`p-4 rounded-2xl border border-white/50 flex gap-3 items-start ${colors[color]}`}>
      <div className="mt-0.5 opacity-80">
        <Icon size={14} />
      </div>
      <p className="text-[11px] font-bold leading-relaxed">{text}</p>
    </div>
  )
}

function SummaryMiniCard({ label, value, trend, icon: Icon, color }) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
  }
  
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
      <div className={`w-10 h-10 rounded-2xl ${colors[color]} flex items-center justify-center mb-4 border`}>
        <Icon size={18} />
      </div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-xl font-black text-slate-900">{value}</div>
        <div className={`text-[10px] font-bold ${trend.startsWith('+') ? 'text-emerald-600' : 'text-slate-400'}`}>{trend}</div>
      </div>
    </div>
  )
}

function ChartContainer({ title, subtitle, children }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm flex flex-col"
    >
      <div className="mb-8">
        <h3 className="serif-heading text-xl text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="flex-1 min-h-[300px]">
        {children}
      </div>
    </motion.div>
  )
}

function RiskCard({ patient }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[var(--cream)] rounded-3xl p-6 border border-slate-200/50 relative overflow-hidden group hover:border-emerald-200 transition-all"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
          <Users size={20} />
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Risk Score</div>
          <div className={`text-xl font-black ${patient.risk_score > 60 ? 'text-rose-600' : 'text-amber-600'}`}>
            {patient.risk_score}/100
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-lg font-bold text-slate-900">{patient.name}</div>
        <div className="text-xs text-slate-500">Recovery stagnation detected</div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200/50">
        <div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Adherence</div>
          <div className="text-sm font-bold text-slate-800">{patient.adherence}%</div>
        </div>
        <div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pain Level</div>
          <div className="text-sm font-bold text-rose-600">{patient.last_pain}/10</div>
        </div>
      </div>

      <button className="w-full mt-6 py-3 rounded-xl bg-white text-[11px] font-black uppercase tracking-wider text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100">
        Review Logs
      </button>
    </motion.div>
  )
}
