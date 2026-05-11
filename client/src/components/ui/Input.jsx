import React from 'react'

export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`rounded-full bg-white/80 border border-[#D9E1D7] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#256B52]/20 ${className}`}
      {...props}
    />
  )
}
