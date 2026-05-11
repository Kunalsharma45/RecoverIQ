import React from 'react'
import { motion } from 'motion/react'
import { Sparkles, LineChart, Stethoscope } from 'lucide-react'

const features = [
  {
    title: 'Personalized Rehabilitation',
    desc: 'Expertly tailored exercises and milestones specifically designed by your doctor for your unique physical recovery journey.',
    icon: <Sparkles size={40} className="text-[var(--textDark)]" />,
    color: 'bg-[var(--softLime)]'
  },
  {
    title: 'Progress Tracking',
    desc: 'Log your daily exercises and watch your consistency score grow over time. Visual progress keeps you motivated.',
    icon: <LineChart size={28} className="text-[var(--textDark)]" />,
    color: 'bg-[var(--lavender)]'
  },
  {
    title: 'Doctor Monitoring',
    desc: 'Real-time oversight allows your provider to adjust your routine dynamically based on your recorded performance.',
    icon: <Stethoscope size={28} className="text-[var(--textDark)]" />,
    color: 'bg-[var(--cream)]'
  }
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-end mb-16">
          <div className="flex-1">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="serif-heading text-5xl md:text-6xl text-[var(--textDark)] leading-tight"
            >
              Elevating the standard of <span className="italic text-[var(--primaryGreen)]">recovery.</span>
            </motion.h2>
          </div>
          <div className="flex-1 pb-2">
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg text-[var(--textSoft)] leading-relaxed max-w-lg"
            >
              We've redesigned the physical therapy experience to be engaging, accountable, and deeply connected to your healthcare provider.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Large Left Card */}
          <motion.div
            className="lg:col-span-7 bg-white/70 backdrop-blur-xl border border-white shadow-xl rounded-[40px] p-12 relative overflow-hidden group"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -10, scale: 1.01 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--softLime)] opacity-40 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000 -z-10" />
            <div className="text-6xl mb-12 bg-white shadow-sm w-24 h-24 flex items-center justify-center rounded-3xl border border-gray-50 group-hover:rotate-12 transition-transform duration-500">{features[0].icon}</div>
            <h3 className="text-4xl font-bold text-[var(--textDark)] mb-4">{features[0].title}</h3>
            <p className="text-xl text-[var(--textSoft)] leading-relaxed max-w-md">{features[0].desc}</p>
          </motion.div>

          {/* Stacked Right Cards */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {features.slice(1).map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex-1 bg-white/70 backdrop-blur-xl border border-white shadow-lg hover:shadow-2xl rounded-[40px] p-10 relative overflow-hidden group flex flex-col justify-center"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className={`absolute -bottom-10 -right-10 w-40 h-40 ${feature.color} opacity-60 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700 -z-10`} />
                <div className="text-4xl mb-6 bg-white shadow-sm w-16 h-16 flex items-center justify-center rounded-2xl border border-gray-50 group-hover:-translate-y-2 transition-transform duration-500">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-[var(--textDark)] mb-3">{feature.title}</h3>
                <p className="text-[var(--textSoft)] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
