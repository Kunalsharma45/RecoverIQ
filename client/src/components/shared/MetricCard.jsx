import React from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

export default function MetricCard({ title, value, unit, icon: Icon, trend, trendValue, color = "green", sparklineData = [] }) {
  const isPositive = trend === "up"
  
  const colorMap = {
    green: {
      text: 'text-emerald-600',
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-100/50',
      chart: '#10b981'
    },
    blue: {
      text: 'text-sky-600',
      bg: 'bg-sky-50/50',
      border: 'border-sky-100/50',
      chart: '#0ea5e9'
    },
    red: {
      text: 'text-rose-600',
      bg: 'bg-rose-50/50',
      border: 'border-rose-100/50',
      chart: '#f43f5e'
    },
    amber: {
      text: 'text-amber-600',
      bg: 'bg-amber-50/50',
      border: 'border-amber-100/50',
      chart: '#f59e0b'
    }
  }

  const activeColor = colorMap[color] || colorMap.green

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-500 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${activeColor.bg} ${activeColor.text} transition-colors group-hover:bg-white group-hover:border group-hover:${activeColor.border}`}>
          <Icon size={20} strokeWidth={1.5} />
        </div>
        {trendValue && (
          <div className={`flex items-center gap-1 text-[11px] font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'} bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100`}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trendValue}%
          </div>
        )}
      </div>

      <div>
        <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1.5">{title}</h4>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
          {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
        </div>
      </div>

      {sparklineData.length > 0 && (
        <div className="h-12 mt-6 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={activeColor.chart} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={activeColor.chart} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={activeColor.chart} 
                strokeWidth={2}
                fill={`url(#grad-${title})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  )
}
