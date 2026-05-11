import React from 'react'
import { motion } from 'motion/react'

const programs = [
  {
    days: 15,
    title: 'Rapid Recovery',
    focus: 'Minor injuries & post-op mobility',
    milestones: 6,
    color: 'from-blue-500/20 to-blue-500/5',
    borderColor: 'border-blue-500/30'
  },
  {
    days: 30,
    title: 'Standard Rehabilitation',
    focus: 'Mobility & Strength Restoration',
    milestones: 12,
    color: 'from-[var(--primaryGreen)]/20 to-[var(--primaryGreen)]/5',
    borderColor: 'border-[var(--primaryGreen)]/30'
  },
  {
    days: 60,
    title: 'Complete Transformation',
    focus: 'Severe injuries & chronic pain management',
    milestones: 24,
    color: 'from-purple-500/20 to-purple-500/5',
    borderColor: 'border-purple-500/30'
  }
]

export default function ProgramsSection() {
  return (
    <section id="programs" className="py-32 relative z-10 bg-white/30 backdrop-blur-3xl border-t border-b border-white/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="serif-heading text-5xl text-[var(--textDark)] mb-6"
          >
            Structured for Success
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[var(--textSoft)]"
          >
            Choose a recovery timeline that fits your injury severity and goals. Every program includes daily exercises and weekly doctor check-ins.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Background connecting line */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-[var(--primaryGreen)]/20 to-transparent -translate-y-1/2 z-0" />
          
          {programs.map((prog, idx) => (
            <motion.div
              key={idx}
              className={`relative z-10 bg-white/80 backdrop-blur-xl border ${prog.borderColor} shadow-xl hover:shadow-2xl rounded-[40px] p-8 overflow-hidden group cursor-pointer`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${prog.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="flex items-center justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center font-serif italic text-2xl font-bold text-[var(--textDark)] border border-white/50">
                  {prog.days}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--textSoft)] bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">Days</div>
              </div>

              <h3 className="text-2xl font-bold text-[var(--textDark)] mb-2 relative z-10">{prog.title}</h3>
              <p className="text-sm text-[var(--textSoft)] mb-8 h-10 relative z-10">{prog.focus}</p>

              {/* Progress visual mock */}
              <div className="space-y-3 relative z-10 mb-8">
                <div className="flex justify-between text-xs font-medium text-[var(--textDark)]">
                  <span>Progress Path</span>
                  <span>{prog.milestones} Milestones</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[var(--primaryGreen)] rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "60%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 + (idx * 0.2) }}
                  />
                </div>
              </div>

              <button className="w-full py-4 rounded-full bg-[var(--textDark)] text-white font-medium group-hover:bg-[var(--primaryGreen)] transition-colors relative z-10 shadow-lg group-hover:shadow-[var(--primaryGreen)]/30">
                View Program Details
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
