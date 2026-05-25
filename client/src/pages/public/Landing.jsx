import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar.jsx'
import HeroSection from '../../components/landing/HeroSection.jsx'
import ServicesSection from '../../components/landing/ServicesSection.jsx'
import ProgramsSection from '../../components/landing/ProgramsSection.jsx'
import DoctorsSection from '../../components/landing/DoctorsSection.jsx'
import TestimonialsSection from '../../components/landing/TestimonialsSection.jsx'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--mutedWhite)] relative overflow-hidden font-sans">
      {/* Global Background Texture/Grain */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      
      {/* Global abstract blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--softLime)]/20 blur-[150px] rounded-full mix-blend-multiply opacity-60" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[var(--primaryGreen)]/10 blur-[150px] rounded-full mix-blend-multiply opacity-60" />
      </div>

      <Navbar />

      <main className="relative z-10 flex flex-col">
        <HeroSection />
        <ServicesSection />
        <ProgramsSection />
        <DoctorsSection />
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] text-white py-16 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10 pb-12 mb-8">
            <div className="flex flex-col gap-2">
              <div className="text-3xl font-bold tracking-tighter serif-heading">
                Recover<span className="text-[var(--primaryGreen)]">IQ</span>
              </div>
              <p className="text-white/40 text-sm max-w-sm">Elevating the standard of recovery through intelligent milestones and compassionate oversight.</p>
            </div>
            <div className="flex flex-wrap gap-8 text-sm font-medium text-white/60">
              <a href="#services" className="hover:text-[var(--primaryGreen)] transition-colors">Services</a>
              <a href="#programs" className="hover:text-[var(--primaryGreen)] transition-colors">Programs</a>
              <a href="#doctors" className="hover:text-[var(--primaryGreen)] transition-colors">Doctors</a>
              <Link to="/login" className="hover:text-[var(--primaryGreen)] transition-colors">Login</Link>
              <Link to="/register-doctor" className="hover:text-[var(--primaryGreen)] transition-colors">Join as Doctor</Link>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
            <p>© 2026 RecoverIQ. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
