import React from 'react'

export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`h-16 w-full rounded-2xl border border-[#DCE3DA] bg-white px-6 text-lg transition-all duration-300 focus:ring-4 focus:ring-[#256B52]/10 focus:border-[#256B52] focus:shadow-lg ${className}`}
      {...props}
    />
  )
}
