import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[var(--mutedWhite)]">
      <Navbar />
      <Outlet />
    </div>
  )
}
