import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Activity, HeartPulse, Flag, TrendingUp, 
  Calendar, AlertCircle, CheckCircle2, 
  Droplets, Moon, Info, ArrowRight,
  TrendingDown, Zap, Smile, Search
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { patientApi } from '../../lib/api'
import MetricCard from '../../components/shared/MetricCard'
import { 
  PainTrendChart, MobilityAreaChart, 
  EnergyBarChart, RecoveryRadarChart 
} from '../../components/shared/RecoveryCharts'

export default function Timeline() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['patient-analytics'],
    queryFn: async () => {
      const res = await patientApi.getAnalytics()
      return res.data
    }
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-100 border-t-[var(--primaryGreen)] rounded-full animate-spin" />
          <HeartPulse className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--primaryGreen)]" size={24} />
        </div>
        <p className="text-slate-500 font-medium animate-pulse">Syncing your recovery intelligence...</p>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
        <AlertCircle size={48} className="mx-auto text-rose-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Connection Interrupted</h2>
        <p className="text-slate-500 mt-2">We couldn't retrieve your analytics at this moment.</p>
      </div>
    )
  }

  const { summary, charts, timeline, insights, recommendations } = analytics

  // Radar data format
  const radarData = [
    { subject: 'Pain Control', A: 100 - (summary.avg_pain * 10), fullMark: 100 },
    { subject: 'Mobility', A: summary.avg_mobility, fullMark: 100 },
    { subject: 'Energy', A: summary.avg_energy, fullMark: 100 },
    { subject: 'Consistency', A: summary.completion_percent, fullMark: 100 },
    { subject: 'Mood', A: 85, fullMark: 100 },
  ]

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Summary Section - Redesigned for Premium Medical Aesthetic */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-[var(--cream)] rounded-[48px] p-12 border border-slate-200/50 shadow-xl shadow-slate-200/20"
      >
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 text-emerald-600 mb-6"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <Activity size={16} />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Recovery Overview</span>
            </motion.div>
            
            <h1 className="serif-heading text-6xl text-slate-900 mb-8 leading-[1.1]">
              Rehabilitation <br />
              <span className="text-emerald-700">Trajectory</span>
            </h1>
            
            <p className="text-slate-500 text-lg max-w-xl leading-relaxed mb-12">
              Your recovery is being monitored in real-time. This comprehensive assessment visualizes your physical resilience and healing journey.
            </p>
            
            <div className="flex flex-wrap gap-10">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Global Adherence</span>
                <span className="text-4xl font-black text-slate-900">{summary.completion_percent}<span className="text-lg text-slate-300 ml-1">%</span></span>
              </div>
              <div className="w-px h-12 bg-slate-200 hidden sm:block" />
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Streak</span>
                <span className="text-4xl font-black text-slate-900">{summary.streak}<span className="text-lg text-slate-300 ml-1">Days</span></span>
              </div>
              <div className="w-px h-12 bg-slate-200 hidden sm:block" />
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Milestones Met</span>
                <span className="text-4xl font-black text-slate-900">{summary.total_completed}<span className="text-lg text-slate-300 ml-1">/ {summary.total_milestones}</span></span>
              </div>
            </div>
          </div>

          {/* Redesigned Thinner, Elegant Progress Ring */}
          <div className="relative w-72 h-72 lg:w-80 lg:h-80 flex items-center justify-center bg-white/40 backdrop-blur-xl rounded-[64px] border border-white/60 shadow-inner">
             <svg className="w-64 h-64 lg:w-72 lg:h-72 transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="118"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-slate-100"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="118"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 118}
                  initial={{ strokeDashoffset: 2 * Math.PI * 118 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 118 * (1 - summary.completion_percent / 100) }}
                  transition={{ duration: 2.5, ease: [0.34, 1.56, 0.64, 1] }}
                  strokeLinecap="round"
                  className="text-emerald-500/80 drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-6xl font-black text-slate-900 tracking-tighter"
                >
                  {summary.completion_percent}<span className="text-2xl text-slate-300 font-bold">%</span>
                </motion.div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Overall Healing</div>
             </div>
          </div>
        </div>

        {/* Subtle Background Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -mr-80 -mt-80" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[100px] -ml-40 -mb-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      </motion.div>

      {/* Metrics Grid - Updated to the redesigned MetricCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard 
          title="Avg Pain Intensity" 
          value={summary.avg_pain} 
          unit="/ 10"
          icon={Activity} 
          trend={summary.avg_pain < 5 ? "down" : "up"}
          trendValue={22}
          color="red"
          sparklineData={charts.daily.map(d => ({ value: d.pain }))}
        />
        <MetricCard 
          title="Mobility Range" 
          value={summary.avg_mobility} 
          unit="pts"
          icon={Zap} 
          trend="up"
          trendValue={12}
          color="green"
          sparklineData={charts.daily.map(d => ({ value: d.mobility }))}
        />
        <MetricCard 
          title="Vitality Level" 
          value={summary.avg_energy} 
          unit="%"
          icon={TrendingUp} 
          trend="up"
          trendValue={8}
          color="blue"
          sparklineData={charts.daily.map(d => ({ value: d.energy }))}
        />
        <MetricCard 
          title="Exercise Fidelity" 
          value={summary.completion_percent} 
          unit="%"
          icon={CheckCircle2} 
          trend="up"
          trendValue={4}
          color="green"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
        <div className="space-y-10">
           {/* Pain Trend */}
           <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/20">
             <div className="flex items-center justify-between mb-10">
                <div>
                   <h3 className="serif-heading text-2xl text-slate-900">Pain Reduction Analysis</h3>
                   <p className="text-sm text-slate-500 mt-1 font-medium">Longitudinal discomfort monitoring</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-2xl text-[11px] font-bold text-slate-500 uppercase tracking-widest border border-slate-100">
                   <Calendar size={14} className="text-emerald-600" /> Last {charts.daily.length} Cycles
                </div>
             </div>
             <PainTrendChart data={charts.daily} />
           </div>

           {/* Mobility Area */}
           <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/20">
             <div className="flex items-center justify-between mb-10">
                <div>
                   <h3 className="serif-heading text-2xl text-slate-900">Range of Motion</h3>
                   <p className="text-sm text-slate-500 mt-1 font-medium">Kinematic improvement over duration</p>
                </div>
             </div>
             <MobilityAreaChart data={charts.daily} />
           </div>
        </div>

        <div className="space-y-10">
           {/* Radar Chart */}
           <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm h-full transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/20">
             <h3 className="serif-heading text-2xl text-slate-900 mb-1">Recovery Equilibrium</h3>
             <p className="text-sm text-slate-500 mb-10 font-medium">Multidimensional rehabilitation balance</p>
             <RecoveryRadarChart data={radarData} />
             
             <div className="mt-10 space-y-3">
                {radarData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-slate-100/50 group hover:bg-white hover:border-emerald-100 transition-all duration-300">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{item.subject}</span>
                    <span className="text-lg font-black text-slate-900">{item.A}%</span>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>

      {/* Energy & Weekly */}
      <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10">
        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/20">
           <h3 className="serif-heading text-2xl text-slate-900 mb-10 flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center border border-sky-100 shadow-sm">
                <Zap size={20} />
             </div>
             Energy Stability
           </h3>
           <EnergyBarChart data={charts.daily} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Dynamic Insights */}
           <div className="bg-emerald-900 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl shadow-emerald-950/20">
             <h3 className="serif-heading text-2xl mb-8 flex items-center gap-3">
               <Smile size={24} className="text-emerald-400" />
               Recovery Logic
             </h3>
             <div className="space-y-5 relative z-10">
               {insights.length > 0 ? (
                 insights.map((insight, i) => (
                   <motion.div 
                     key={i} 
                     initial={{ opacity: 0, x: -10 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="p-5 bg-white/10 rounded-[28px] border border-white/10 text-sm font-medium leading-relaxed backdrop-blur-sm"
                   >
                     {insight}
                   </motion.div>
                 ))
               ) : (
                 <div className="p-8 bg-white/5 rounded-3xl border border-dashed border-white/20 text-xs text-green-200 text-center">
                   Synthesizing medical data... Complete more milestones for clinical insights.
                 </div>
               )}
             </div>
             <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-[80px] -mr-24 -mt-24" />
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
           </div>

           {/* Recommendations */}
           <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm">
             <h3 className="serif-heading text-2xl text-slate-900 mb-8">Clinical Focus</h3>
             <div className="space-y-6">
               {recommendations.map((rec, i) => (
                 <div key={i} className="flex gap-5 group">
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Droplets size={20} className="text-sky-500" />
                   </div>
                   <div>
                     <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{rec.title}</div>
                     <div className="text-xs text-slate-500 mt-1 leading-relaxed">{rec.description}</div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
