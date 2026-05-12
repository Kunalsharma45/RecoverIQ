import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { ShieldCheck, ArrowRight, Activity } from 'lucide-react'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import AnxietyBro from '../../assets/Anxiety-bro.svg'

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['patient', 'doctor', 'admin']),
})

export default function Login() {
  const [serverError, setServerError] = React.useState('')
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      role: 'patient',
    },
  })

  const mutation = useMutation({
    mutationFn: async values => {
      const res = await api.post('/auth/login', values)
      return res.data
    },
    onMutate: () => setServerError(''),
    onSuccess: data => {
      login({ user: data.user, token: data.token })
      if (data.user.role === 'admin') navigate('/admin')
      else if (data.user.role === 'doctor') navigate('/doctor')
      else navigate('/patient')
    },
    onError: err => {
      const message = err?.response?.data?.message || 'Login failed. Please check your credentials.'
      setServerError(message)
    },
  })

  return (
    <div className="min-h-screen bg-[var(--mutedWhite)] flex justify-center items-center font-sans overflow-hidden relative">
      {/* Cinematic Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--mutedWhite)] via-white to-[var(--cream)] opacity-90 -z-20" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay -z-10 pointer-events-none" />

      <div className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row min-h-screen items-stretch px-6 sm:px-8">
        
        {/* Left Side - Cinematic Illustration Environment */}
        <div className="hidden md:flex md:w-[45%] relative flex-col items-center justify-center p-12 lg:p-20 z-10 overflow-hidden">
          
          {/* Atmospheric Background Blending */}
          <div className="absolute top-[15%] left-[5%] w-[600px] h-[600px] bg-[var(--softLime)]/40 rounded-full blur-[140px] mix-blend-multiply opacity-70 -z-10" />
          <div className="absolute bottom-[10%] right-[0%] w-[500px] h-[500px] bg-[var(--lavender)]/40 rounded-full blur-[140px] mix-blend-multiply opacity-70 -z-10" />
          <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/50 rounded-full blur-[120px] -z-10" />
          
          {/* Central Focal Spotlight */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--cream)]/60 rounded-full blur-[80px] -z-10" />

          <div className="w-full max-w-2xl relative z-10 flex flex-col h-full pt-12">
            {/* Logo Area with Lighting */}
            <div className="relative mb-auto">
              <div className="absolute -inset-4 bg-white/30 blur-2xl rounded-full -z-10" />
              <Link to="/" className="inline-flex items-center gap-3 group w-fit">
                <div className="w-12 h-12 rounded-full bg-[var(--primaryGreen)] flex items-center justify-center text-white font-serif italic font-bold text-2xl shadow-lg">R</div>
                <span className="serif-heading text-3xl text-[var(--textDark)] font-bold group-hover:text-[var(--primaryGreen)] transition-colors">RecoverIQ</span>
              </Link>
            </div>

            {/* Illustration Composition */}
            <div className="relative flex-grow flex items-center justify-center mb-16">
              <div className="relative w-[85%] max-w-[620px] mix-blend-multiply opacity-95">
                <motion.img 
                  src={AnxietyBro} 
                  alt="Recovery illustration" 
                  className="w-full h-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.08)]"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                />
                
                {/* Intentional Orbiting Badges */}
                <motion.div 
                  className="absolute -top-12 -left-8 bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex items-center gap-4 z-20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0, y: [0, 10, 0] }}
                  transition={{ 
                    opacity: { duration: 1 },
                    x: { duration: 1 },
                    y: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1.5 }
                  }}
                >
                  <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Activity size={22} />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-[var(--textDark)] leading-tight">10k+ Sessions</p>
                    <p className="text-xs text-[var(--textSoft)] mt-0.5">Trusted globally</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute -bottom-6 -right-12 bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex items-center gap-4 z-20"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
                  transition={{ 
                    opacity: { duration: 1, delay: 0.2 },
                    x: { duration: 1, delay: 0.2 },
                    y: { repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }
                  }}
                >
                  <div className="w-11 h-11 rounded-full bg-[var(--softLime)] flex items-center justify-center text-[var(--darkGreen)]">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-[var(--textDark)] leading-tight">HIPAA Secure</p>
                    <p className="text-xs text-[var(--textSoft)] mt-0.5">Encrypted Data</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Luxury Form Card */}
        <div className="w-full md:w-[55%] flex items-center justify-center p-4 sm:p-12 lg:p-24 relative z-20">
          
          {/* Overlapping Blend Glow */}
          <div className="absolute left-[-20%] top-[50%] -translate-y-1/2 w-[400px] h-[800px] bg-white/50 blur-[140px] -z-10 rounded-full pointer-events-none" />

          <motion.div 
            className="w-full max-w-[480px] bg-white/95 backdrop-blur-2xl rounded-[48px] shadow-[0_30px_100px_rgba(0,0,0,0.08)] border border-[#E5E7E2] px-10 py-12 sm:px-14 sm:py-14"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-10 text-center sm:text-left">
              <h1 className="text-5xl font-serif leading-[1.1] tracking-tight text-[var(--textDark)] mb-4">Welcome Back</h1>
              <p className="text-lg text-[#5C6B63] leading-relaxed">Please enter your details to access your dashboard.</p>
            </div>

            <form onSubmit={form.handleSubmit(v => mutation.mutate(v))} className="flex flex-col gap-6">
              {serverError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="rounded-2xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-start gap-3"
                >
                   <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   {serverError}
                </motion.div>
              )}

              <div className="flex flex-col gap-4">
                <div>
                  <Input type="email" placeholder="Email address" {...form.register('email')} />
                  {form.formState.errors.email && <span className="text-red-500 text-sm mt-2 block pl-4">{form.formState.errors.email.message}</span>}
                </div>

                <div>
                  <Input type="password" placeholder="Password" {...form.register('password')} />
                  {form.formState.errors.password && <span className="text-red-500 text-sm mt-2 block pl-4">{form.formState.errors.password.message}</span>}
                </div>

                <div className="relative">
                  <select 
                    {...form.register('role')} 
                    className="h-[64px] w-full rounded-2xl border border-[#DCE3DA] bg-white px-6 text-lg transition-all duration-300 focus:ring-4 focus:ring-[#256B52]/10 focus:border-[#256B52] focus:shadow-lg appearance-none cursor-pointer"
                  >
                    <option value="patient">Login as Patient</option>
                    <option value="doctor">Login as Doctor</option>
                  </select>
                  <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-[var(--textSoft)]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-8">
                <Button type="submit" disabled={mutation.isPending} className="group h-[64px]">
                  {mutation.isPending ? 'Authenticating...' : 'Sign In'}
                  {!mutation.isPending && <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                </Button>

                <div className="flex flex-col items-center gap-2 text-base text-[#5C6B63] mt-2">
                  <p>Don't have an account?</p>
                  <Link to="/register-doctor" className="font-medium text-[var(--primaryGreen)] hover:text-[var(--darkGreen)] transition-colors decoration-2 underline-offset-4 hover:underline">
                    Join as a Provider
                  </Link>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
