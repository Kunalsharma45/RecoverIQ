import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion as Motion } from 'motion/react'

const NavLink = ({ to, label, isActive }) => {
  const navigate = useNavigate()

  const handleClick = (e) => {
    if (to.startsWith('#')) {
      const element = document.getElementById(to.substring(1))
      if (element) {
        e.preventDefault()
        // navigate via react-router so location updates and active state changes
        navigate(to)
        // scroll after navigation — small delay to ensure DOM updated
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 60)
      }
    } else if (to === '/') {
      if (window.location.pathname === '/') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        navigate('/')
      }
    }
  }

  return (
    <Link to={to} onClick={handleClick} className="relative px-5 py-2 text-sm font-medium transition-colors hover:text-[var(--primaryGreen)] z-10 group">
      <span className="relative z-10">{label}</span>
      {isActive && (
        <Motion.div
          layoutId="navbar-indicator"
          className="absolute inset-0 bg-white/50 rounded-full -z-10 shadow-sm border border-white"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const navigate = useNavigate()

  useEffect(() => {
    let frameId = 0

    const updateScrollState = () => {
      const nextScrolled = window.scrollY > 20
      const viewportCenter = window.scrollY + window.innerHeight * 0.42
      const sectionIds = ['services', 'programs', 'doctors', 'testimonials']

      let nextSection = 'home'
      for (const id of sectionIds) {
        const section = document.getElementById(id)
        if (!section) continue

        const top = section.offsetTop
        const bottom = top + section.offsetHeight
        if (viewportCenter >= top && viewportCenter < bottom) {
          nextSection = id
          break
        }
      }

      setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled))
      setActiveSection((prev) => (prev === nextSection ? prev : nextSection))
      frameId = 0
    }

    const onScroll = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateScrollState)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <Motion.header 
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <Motion.div
        className="pointer-events-auto flex items-center justify-between p-2 rounded-full border border-white/60 shadow-[0_8px_32px_rgba(37,107,82,0.08)] backdrop-blur-2xl bg-white/40 w-full max-w-6xl"
        animate={{
          padding: scrolled ? "0.5rem 0.5rem" : "0.75rem 0.75rem",
          backgroundColor: scrolled ? "rgba(250, 249, 247, 0.85)" : "rgba(250, 249, 247, 0.4)",
        }}
        transition={{ type: 'spring', stiffness: 140, damping: 22, mass: 0.8 }}
      >
        <Link to="/" className="pl-4 lg:pl-6 flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-[var(--primaryGreen)] flex items-center justify-center text-white font-serif italic font-bold">R</div>
          <span className="serif-heading text-xl text-[var(--textDark)] font-bold group-hover:text-[var(--primaryGreen)] transition-colors hidden sm:block">RecoverIQ</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 p-1.5 bg-white/30 rounded-full shadow-inner border border-white/50">
          {['Home', 'Services', 'Programs', 'Doctors', 'Testimonials'].map((item) => {
            const hash = item === 'Home' ? '' : `#${item.toLowerCase()}`
            const isActive = activeSection === (hash ? item.toLowerCase() : 'home')
            return <NavLink key={item} to={hash || '/'} label={item} isActive={isActive} />
          })}
        </nav>

        <div className="flex items-center gap-2 pr-2">
          <Link to="/login" className="hidden md:block text-sm px-5 py-2.5 rounded-full text-[var(--textDark)] font-medium hover:bg-white/50 transition-colors">Login</Link>
          <Motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-full bg-[var(--primaryGreen)] text-white text-sm font-semibold shadow-lg shadow-[var(--primaryGreen)]/20"
            onClick={() => navigate('/book')}
          >
            Book Session
          </Motion.button>
        </div>
      </Motion.div>
    </Motion.header>
  )
}
