import React from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell, RadialBarChart, RadialBar
} from 'recharts'

const TooltipStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '24px',
  border: '1px solid #f1f5f9',
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)',
  padding: '12px 16px',
}

export const PainTrendChart = ({ data }) => (
  <div className="h-[300px] w-100%">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} 
          dy={15}
        />
        <YAxis 
          hide 
          domain={[0, 10]}
        />
        <Tooltip 
          contentStyle={TooltipStyle}
          itemStyle={{fontSize: '12px', fontWeight: 'bold', color: '#1e293b'}}
          labelStyle={{fontSize: '10px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em'}}
        />
        <Area 
          type="monotone" 
          dataKey="pain" 
          stroke="#f43f5e" 
          strokeWidth={2} 
          fillOpacity={1} 
          fill="url(#painGradient)" 
          animationDuration={2000}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
)

export const MobilityAreaChart = ({ data }) => (
  <div className="h-[300px] w-100%">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="mobilityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} 
          dy={15}
        />
        <YAxis hide domain={[0, 100]} />
        <Tooltip 
          contentStyle={TooltipStyle}
          itemStyle={{fontSize: '12px', fontWeight: 'bold', color: '#1e293b'}}
          labelStyle={{fontSize: '10px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em'}}
        />
        <Area 
          type="monotone" 
          dataKey="mobility" 
          stroke="#10b981" 
          strokeWidth={2} 
          fillOpacity={1} 
          fill="url(#mobilityGradient)" 
          animationDuration={2000}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
)

export const EnergyBarChart = ({ data }) => (
  <div className="h-[300px] w-100%">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} 
          dy={15}
        />
        <YAxis hide domain={[0, 100]} />
        <Tooltip 
          cursor={{fill: '#f8fafc'}}
          contentStyle={TooltipStyle}
          itemStyle={{fontSize: '12px', fontWeight: 'bold', color: '#1e293b'}}
          labelStyle={{fontSize: '10px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em'}}
        />
        <Bar 
          dataKey="energy" 
          fill="#0ea5e9" 
          radius={[10, 10, 10, 10]} 
          barSize={12}
          animationDuration={2000}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.energy > 70 ? '#10b981' : entry.energy > 40 ? '#0ea5e9' : '#f43f5e'} opacity={0.6} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
)

export const RecoveryRadarChart = ({ data }) => (
  <div className="h-[350px] w-100%">
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#e2e8f0" strokeDasharray="4 4" />
        <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em'}} />
        <Radar
          name="Recovery"
          dataKey="A"
          stroke="#10b981"
          strokeWidth={2}
          fill="#10b981"
          fillOpacity={0.1}
          animationDuration={2500}
        />
      </RadarChart>
    </ResponsiveContainer>
  </div>
)
