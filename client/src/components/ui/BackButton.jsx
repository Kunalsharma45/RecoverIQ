import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function BackButton({ className = '', label = 'Back' }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--primaryGreen)]/20 bg-white/85 text-[var(--textDark)] shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primaryGreen)] hover:bg-[var(--primaryGreen)] hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--primaryGreen)] focus:ring-offset-2 ${className}`}
      aria-label={label}
    >
      <span aria-hidden="true" className="text-xl leading-none">←</span>
    </button>
  )
}
