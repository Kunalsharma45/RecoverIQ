import React from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, Stethoscope } from 'lucide-react'
import HeroSVG from '../../assets/Physical therapy exercise-amico.svg'

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
      {/* Decorative Blobs */}
      <motion.div 
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-[var(--softLime)]/50 rounded-full blur-[120px] -z-10 mix-blend-multiply" 
      />
      <motion.div 
        animate={{ rotate: -360, scale: [1, 1.2, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-[var(--lavender)]/40 rounded-full blur-[100px] -z-10 mix-blend-multiply" 
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--primaryGreen)] animate-pulse"></span>
              <span className="text-sm font-medium text-[var(--textDark)]">The standard in modern recovery</span>
            </motion.div>
            
            <motion.h1
              className="serif-heading text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight text-[var(--textDark)]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            >
              Heal Better. <br/>
              <span className="italic font-light text-[var(--primaryGreen)]">Track Every Step.</span>
            </motion.h1>
            
            <motion.p
              className="text-lg md:text-xl text-[var(--textSoft)] max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              RecoverIQ brings expert physiotherapy and intelligent milestone tracking into a beautiful, seamless experience. Your journey to wellness starts here.
            </motion.p>
            
            <motion.div
              className="flex flex-wrap items-center gap-4 pt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/book'} 
                className="px-8 py-4 rounded-full bg-[var(--darkGreen)] text-white font-medium hover:bg-[var(--primaryGreen)] transition-colors shadow-xl shadow-[var(--darkGreen)]/20"
              >
                Start Your Recovery
              </motion.button>
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} 
                className="px-8 py-4 rounded-full bg-white/50 backdrop-blur-md text-[var(--textDark)] font-medium border border-white shadow-sm hover:bg-white/80 transition-all"
              >
                See How It Works
              </button>
            </motion.div>
          </div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative z-10 flex justify-center items-center">
              <img src={HeroSVG} alt="Recovery Illustration" className="w-full h-auto drop-shadow-2xl max-w-md lg:max-w-none" />
              
              <motion.div
                className="absolute top-10 -right-6 bg-white/90 backdrop-blur-md border border-[var(--borderSoft)] rounded-2xl p-4 shadow-xl flex items-center gap-3 z-20"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-10 h-10 rounded-full bg-[var(--softLime)] flex items-center justify-center text-[var(--darkGreen)]">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--textDark)]">Milestone</p>
                  <p className="text-xs text-[var(--textSoft)]">Goal Achieved</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-10 -left-8 bg-white/90 backdrop-blur-md border border-[var(--borderSoft)] rounded-2xl p-4 shadow-xl flex items-center gap-3 z-20"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="w-10 h-10 rounded-full bg-[var(--lavender)] flex items-center justify-center text-[var(--darkGreen)]">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--textDark)]">Doctor Reviewed</p>
                  <p className="text-xs text-[var(--textSoft)]">Program Updated</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
