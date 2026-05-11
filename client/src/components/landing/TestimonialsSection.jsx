import React from 'react'
import { motion } from 'motion/react'

const testimonials = [
  { text: "I finally regained shoulder mobility after weeks of pain. RecoverIQ helped me stay motivated every single day.", author: "James T.", type: "Post-Op Recovery" },
  { text: "The personalized milestones made the overwhelming process of rehab feel achievable and rewarding.", author: "Sarah M.", type: "Sports Injury" },
  { text: "My doctor could monitor my consistency and adjust my program perfectly. I've never felt more supported.", author: "David L.", type: "Chronic Pain" },
  { text: "A truly premium experience. It doesn't feel like a clinical app, it feels like a wellness journey.", author: "Emma W.", type: "General Mobility" },
  { text: "I finally regained shoulder mobility after weeks of pain. RecoverIQ helped me stay motivated every single day.", author: "James T.", type: "Post-Op Recovery" }, 
  { text: "The personalized milestones made the overwhelming process of rehab feel achievable and rewarding.", author: "Sarah M.", type: "Sports Injury" },
]

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-32 overflow-hidden relative z-10 bg-[var(--darkGreen)] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center">
         <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="serif-heading text-5xl mb-4"
          >
            Real Recovery Stories
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/60 max-w-2xl mx-auto"
          >
            Hear from patients who have successfully transformed their mobility and reclaimed their lives using RecoverIQ.
          </motion.p>
      </div>

      <div className="relative w-full flex overflow-hidden mask-edges py-10">
        <motion.div 
          className="flex gap-8 px-4 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          style={{ width: "max-content" }}
        >
          {testimonials.map((test, idx) => (
            <div key={idx} className="w-[400px] whitespace-normal bg-white/5 border border-white/10 backdrop-blur-md rounded-[32px] p-8 flex flex-col justify-between hover:bg-white/10 transition-colors cursor-pointer group">
               <div className="text-[var(--softLime)] text-5xl font-serif leading-none mb-4 group-hover:-translate-y-2 transition-transform">"</div>
               <p className="text-lg leading-relaxed text-white/90 mb-8 font-medium">
                 {test.text}
               </p>
               <div className="flex items-center gap-4 border-t border-white/10 pt-6 mt-auto">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[var(--softLime)] to-white flex items-center justify-center text-[var(--darkGreen)] font-bold text-lg shadow-lg">
                   {test.author.charAt(0)}
                 </div>
                 <div>
                   <p className="font-semibold text-white">{test.author}</p>
                   <p className="text-xs text-[var(--softLime)]">{test.type}</p>
                 </div>
               </div>
            </div>
          ))}
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .mask-edges {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}} />
    </section>
  )
}
