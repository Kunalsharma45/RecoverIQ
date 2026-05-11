import React from 'react'
import { motion } from 'motion/react'
import Button from '../../components/ui/Button.jsx'

const imageA = 'https://images.unsplash.com/photo-1576765608866-5b51046452be?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3'
const imageB = 'https://images.unsplash.com/photo-1580281658629-4db8e8b93092?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3'
const imageC = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3'

export default function Landing() {
  return (
    <main className="pt-36">
      <section className="bg-[var(--darkGreen)] text-[var(--cream)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
            <div className="space-y-8">
              <motion.h1
                className="serif-heading text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                Recover Better. Track Every Step.
              </motion.h1>
              <motion.p
                className="text-lg leading-relaxed text-[var(--cream)]/90 max-w-xl"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
              >
                RecoverIQ helps patients monitor rehabilitation progress while staying connected with compassionate rehabilitation experts.
              </motion.p>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => window.location.href = '/book'}>Book Session</Button>
                <Button variant="secondary" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>Learn More</Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-[var(--cream)]/80">
                <span>Doctor?</span>
                <a className="underline underline-offset-4" href="/register-doctor">Sign up</a>
                <span>or</span>
                <a className="underline underline-offset-4" href="/login">Login</a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                {[
                  'Personalized rehab plans',
                  'Expert-reviewed milestones',
                  'Gentle, guided progress'
                ].map(label => (
                  <div key={label} className="rounded-[32px] bg-white/10 border border-white/20 px-4 py-3 text-sm">
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <motion.div
                className="absolute -top-8 -left-6 w-44 rounded-[32px] bg-[var(--cream)] text-[var(--textDark)] p-4 border border-[var(--borderSoft)] shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-xs text-[var(--textSoft)]">Recovery Progress</div>
                <div className="font-semibold">Day 7 • Mobility Improving</div>
              </motion.div>

              <motion.div
                className="absolute -bottom-8 left-10 w-48 rounded-[32px] bg-[var(--cream)] text-[var(--textDark)] p-4 border border-[var(--borderSoft)] shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="text-xs text-[var(--textSoft)]">30 Day Recovery Program</div>
                <div className="font-semibold">68% Completed</div>
              </motion.div>

              <motion.div
                className="absolute top-16 right-0 w-44 rounded-[32px] bg-[var(--cream)] text-[var(--textDark)] p-4 border border-[var(--borderSoft)] shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.25 }}
                viewport={{ once: true }}
              >
                <div className="text-xs text-[var(--textSoft)]">Dr. Sarah Lee</div>
                <div className="font-semibold">Weekly Review Completed</div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[40px] overflow-hidden shadow-xl">
                  <img src={imageA} alt="physiotherapy session" className="w-full h-64 object-cover" />
                </div>
                <div className="rounded-[40px] overflow-hidden shadow-xl mt-10">
                  <img src={imageB} alt="rehabilitation therapy" className="w-full h-64 object-cover" />
                </div>
                <div className="rounded-[40px] overflow-hidden shadow-xl col-span-2">
                  <img src={imageC} alt="recovery consultation" className="w-full h-60 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-[var(--cream)] py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="serif-heading text-4xl">Services Preview</div>
          <p className="mt-4 text-lg leading-relaxed text-[var(--textSoft)] max-w-2xl">
            Three core services built around human-first recovery and expert oversight.
          </p>
        </div>
      </section>
    </main>
  )
}
