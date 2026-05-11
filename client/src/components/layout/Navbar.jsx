import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../ui/Button.jsx'

const NavLink = ({ to, children }) => (
  <Link to={to} className="px-4 py-2 text-sm font-medium text-[var(--textDark)] hover:text-[var(--primaryGreen)]">
    {children}
  </Link>
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[92%]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          className={`rounded-full border border-white/20 shadow-lg backdrop-blur-xl transition-all duration-500 ${
            scrolled ? 'bg-[rgba(250,249,247,0.92)]' : 'bg-[rgba(250,249,247,0.72)]'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-6">
              <Link to="/" className="serif-heading text-2xl text-[var(--primaryGreen)]">RecoverIQ</Link>
              <nav className="hidden lg:flex items-center">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/#services">Services</NavLink>
                <NavLink to="/#programs">Programs</NavLink>
                <NavLink to="/#doctors">Doctors</NavLink>
                <NavLink to="/#testimonials">Testimonials</NavLink>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm px-4 py-2 rounded-full text-[var(--textDark)] hover:bg-[var(--cream)]">Login</Link>
              <Link to="/register-doctor" className="text-sm px-4 py-2 rounded-full text-[var(--textDark)] hover:bg-[var(--cream)]">Sign Up</Link>
              <Button className="px-6 py-2" onClick={() => navigate('/book')}>Book Session</Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
