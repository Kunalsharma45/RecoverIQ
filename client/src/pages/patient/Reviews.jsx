import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import api from '../../lib/api.js'

export default function PatientReviews() {
  const reviewsQuery = useQuery({
    queryKey: ['patient-reviews'],
    queryFn: async () => {
      const res = await api.get('/patient/reviews')
      return res.data || []
    },
  })

  const reviews = reviewsQuery.data || []

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-[var(--cream)] border border-[var(--borderSoft)] shadow-lg p-6">
        <h2 className="serif-heading text-3xl">Doctor Reviews</h2>
        <p className="mt-2 text-[var(--textSoft)]">Encouraging notes from your care team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reviews.map(review => (
          <motion.div
            key={review.id}
            className="rounded-[32px] bg-white/80 border border-[var(--borderSoft)] shadow-lg p-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-[var(--textDark)]">{review.note}</p>
            <div className="mt-4 text-sm text-[var(--textSoft)]">— {review.doctor?.user?.name || 'Doctor'}</div>
          </motion.div>
        ))}

        {reviews.length === 0 && (
          <div className="rounded-[32px] bg-white/80 border border-[var(--borderSoft)] shadow-lg p-8 text-[var(--textSoft)]">
            No reviews yet. Your doctor will share feedback soon.
          </div>
        )}
      </div>
    </div>
  )
}
