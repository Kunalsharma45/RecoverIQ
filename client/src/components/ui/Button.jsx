import React from 'react'

export default function Button({ variant = 'primary', className = '', ...props }) {
  const base = 'h-16 rounded-full text-lg font-medium shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center w-full'
  const styles = variant === 'secondary'
    ? 'bg-[var(--cream)] text-[var(--primaryGreen)] border border-[var(--primaryGreen)]'
    : 'bg-[var(--darkGreen)] text-[var(--cream)] hover:bg-[var(--primaryGreen)]'

  return <button className={`${base} ${styles} ${className}`} {...props} />
}
