import React from 'react'
import { motion } from 'motion/react'
import { useQuery } from '@tanstack/react-query'
import { Star, ArrowRight } from 'lucide-react'
import api from '../../lib/api.js'

export default function DoctorsSection() {
  const { data: doctors, isLoading } = useQuery({
    queryKey: ['public-doctors'],
    queryFn: async () => {
      const res = await api.get('/doctors')
      return res.data
    }
  })

  // If there are no doctors in the DB yet, show fallback premium UI
  const displayDoctors = doctors?.length ? doctors.slice(0, 3) : [
    { id: 1, name: 'Dr. Sarah Lee', specialization: 'Orthopedic Rehabilitation', experience: '12 Years', rating: '4.9', bio: 'Specializing in sports injuries and post-surgical recovery. Passionate about evidence-based care.' },
    { id: 2, name: 'Dr. James Chen', specialization: 'Neurological Physio', experience: '8 Years', rating: '4.8', bio: 'Expert in spinal cord injuries and neurological movement disorders. Helping patients regain independence.' },
    { id: 3, name: 'Dr. Emily Carter', specialization: 'Geriatric Therapy', experience: '15 Years', rating: '5.0', bio: 'Dedicated to helping seniors regain mobility, confidence, and independence through gentle physical therapy.' }
  ]

  return (
    <section id="doctors" className="py-32 relative z-10">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--lavender)]/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="serif-heading text-5xl text-[var(--textDark)] mb-4"
            >
              Meet Your Recovery Experts
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-[var(--textSoft)]"
            >
              World-class physiotherapists dedicated to guiding you every step of the way.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
            <button className="px-6 py-3 rounded-full border border-[var(--borderSoft)] hover:bg-white transition-colors text-[var(--textDark)] font-medium bg-white/50 backdrop-blur-md shadow-sm">
              View All Doctors
            </button>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="w-12 h-12 border-4 border-[var(--primaryGreen)]/30 border-t-[var(--primaryGreen)] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayDoctors.map((doc, idx) => (
              <motion.div
                key={doc.id}
                className="bg-white/80 backdrop-blur-xl border border-white shadow-lg rounded-[40px] p-8 group relative overflow-hidden flex flex-col"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--darkGreen)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gray-200 overflow-hidden shadow-inner flex-shrink-0 relative">
                     {/* Using a placeholder gradient since real images might not exist */}
                     <div className="absolute inset-0 bg-gradient-to-br from-[var(--softLime)] to-[var(--primaryGreen)] opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                     <div className="absolute inset-0 flex items-center justify-center text-3xl font-serif text-white/80 drop-shadow-md">
                       {doc.name ? doc.name.charAt(0) : 'D'}
                     </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--textDark)] line-clamp-1">{doc.name}</h3>
                    <p className="text-sm font-medium text-[var(--primaryGreen)] mb-2">{doc.specialization}</p>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[var(--textDark)] bg-yellow-100 w-fit px-2 py-0.5 rounded-full">
                      <Star size={12} className="fill-yellow-500 text-yellow-500" /> {doc.rating || '5.0'}
                    </div>
                  </div>
                </div>

                <p className="text-[var(--textSoft)] text-sm leading-relaxed mb-8 flex-grow">
                  {doc.bio || 'Dedicated healthcare professional focused on optimizing patient recovery through evidence-based treatments.'}
                </p>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div className="text-xs text-[var(--textSoft)]">
                    <span className="block font-semibold text-[var(--textDark)]">{doc.experience || '10+ Years'}</span>
                    Experience
                  </div>
                  <button onClick={() => window.location.href = '/book'} className="w-10 h-10 rounded-full bg-[var(--cream)] group-hover:bg-[var(--primaryGreen)] group-hover:text-white flex items-center justify-center transition-colors text-[var(--textDark)] shadow-sm">
                    <ArrowRight size={18} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
