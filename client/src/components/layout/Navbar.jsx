import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'

const NavLink = ({ to, hash, label, isActive }) => {
  const navigate = useNavigate()

  const handleClick = (e) => {
    // normalize `to` to a string for fallback behavior
    const toStr = typeof to === 'string' ? to : `${to.pathname || ''}${to.hash || ''}`

    if (hash) {
      // use router navigation so `location` updates and the parent sees the new hash
      e.preventDefault()
      navigate(to)
      // scroll after navigation completes — use a small timeout to allow DOM updates
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1))
        if (element) element.scrollIntoView({ behavior: 'smooth' })
      }, 50)
      return
    }

    if (toStr === '/') {
      if (window.location.pathname === '/') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        // ensure router location is set to root
        navigate('/')
        return
      }
    }
  }

  return (
    <Link to={to} onClick={handleClick} className="relative px-5 py-2 text-sm font-medium transition-colors hover:text-[var(--primaryGreen)] z-10 group">
      <span className="relative z-10">{label}</span>
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute inset-0 bg-white/50 rounded-full -z-10 shadow-sm border border-white"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [activeHash, setActiveHash] = useState(location.hash || '')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // scroll-spy: update activeHash as the user scrolls through sections
  useEffect(() => {
    // keep activeHash in sync when location.hash changes (e.g., via clicks)
    setActiveHash(location.hash || '')
  }, [location.hash])

  useEffect(() => {
    let rafId = null

    const sectionIds = ['services', 'programs', 'doctors', 'testimonials']

    const updateActiveOnScroll = () => {
      // find sections that exist on the page
      const sections = sectionIds.map(id => {
        const el = document.getElementById(id)
        if (!el) return null
        const rect = el.getBoundingClientRect()
        // distance from viewport center
        const dist = Math.abs((rect.top + rect.bottom) / 2 - window.innerHeight / 2)
        return { id: `#${id}`, dist, top: rect.top }
      }).filter(Boolean)

      if (sections.length === 0) {
        // if no sections found, consider Home active when near top
        setActiveHash(window.scrollY < 120 ? '' : activeHash)
        return
      }

      // pick the section whose center is closest to viewport center
      sections.sort((a, b) => a.dist - b.dist)
      const nearest = sections[0]

      // if nearest section is above the fold but we are very close to top, set Home
      if (window.scrollY < 120) {
        setActiveHash('')
      } else {
        setActiveHash(nearest.id)
      }
    }

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateActiveOnScroll)
    }

    updateActiveOnScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <motion.header 
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="pointer-events-auto flex items-center justify-between p-2 rounded-full border border-white/60 shadow-[0_8px_32px_rgba(37,107,82,0.08)] backdrop-blur-2xl bg-white/40 w-full max-w-6xl"
        animate={{
          padding: scrolled ? "0.5rem 0.5rem" : "0.75rem 0.75rem",
          backgroundColor: scrolled ? "rgba(250, 249, 247, 0.85)" : "rgba(250, 249, 247, 0.4)",
        }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/" className="pl-4 lg:pl-6 flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-[var(--primaryGreen)] flex items-center justify-center text-white font-serif italic font-bold">R</div>
          <span className="serif-heading text-xl text-[var(--textDark)] font-bold group-hover:text-[var(--primaryGreen)] transition-colors hidden sm:block">RecoverIQ</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 p-1.5 bg-white/30 rounded-full shadow-inner border border-white/50">
          {['Home', 'Services', 'Programs', 'Doctors', 'Testimonials'].map((item) => {
            const hash = item === 'Home' ? '' : `#${item.toLowerCase()}`
            // build a proper `to` object when using hashes so react-router sets location.hash
            const to = hash ? { pathname: '/', hash } : '/'
            const isActive = activeHash === hash || (item === 'Home' && activeHash === '')
            return <NavLink key={item} to={to} hash={hash} label={item} isActive={isActive} />
          })}
        </nav>

        <div className="flex items-center gap-2 pr-2">
          <Link to="/login" className="hidden md:block text-sm px-5 py-2.5 rounded-full text-[var(--textDark)] font-medium hover:bg-white/50 transition-colors">Login</Link>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-full bg-[var(--primaryGreen)] text-white text-sm font-semibold shadow-lg shadow-[var(--primaryGreen)]/20"
            onClick={() => navigate('/book')}
          >
            Book Session
          </motion.button>
        </div>
      </motion.div>
    </motion.header>
  )
}
