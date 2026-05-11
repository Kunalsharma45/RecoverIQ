import React from 'react'

export default function Button({ variant = 'primary', className = '', ...props }) {
  const base = 'rounded-full px-8 py-3 font-medium transition-all duration-500 hover:-translate-y-1'
  const styles = variant === 'secondary'
    ? 'bg-[var(--cream)] text-[var(--primaryGreen)] border border-[var(--primaryGreen)]'
    : 'bg-[var(--primaryGreen)] text-[var(--cream)]'

  return <button className={`${base} ${styles} ${className}`} {...props} />
}
