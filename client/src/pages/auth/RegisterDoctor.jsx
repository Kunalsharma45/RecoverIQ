import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Award, TrendingUp, ArrowRight } from 'lucide-react'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../lib/api.js'
import DoctorsBro from '../../assets/Doctors-bro.svg'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password is required'),
  confirmPassword: z.string().min(6, 'Confirm password'),
  specialization: z.string().min(2, 'Specialization is required'),
  bio: z.string().min(10, 'Short bio is required'),
}).refine(values => values.password === values.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export default function RegisterDoctor() {
  const [serverError, setServerError] = React.useState('')
  const [serverSuccess, setServerSuccess] = React.useState('')
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      specialization: '',
      bio: '',
    },
  })

  const mutation = useMutation({
    mutationFn: async values => {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        specialization: values.specialization,
        bio: values.bio,
      }
      const res = await api.post('/auth/register-doctor', payload)
      return res.data
    },
    onMutate: () => {
      setServerError('')
      setServerSuccess('')
    },
    onSuccess: data => {
      setServerSuccess(data?.message || 'Registration successful. Please check your email for verification.')
      form.reset()
    },
    onError: err => {
      const message = err?.response?.data?.message
      const firstField = err?.response?.data?.errors
        ? Object.values(err.response.data.errors)[0]?.[0]
        : null
      setServerError(firstField || message || 'Registration failed. Please check your details.')
    },
  })

  return (
    <div className="min-h-screen bg-[var(--mutedWhite)] flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Left Side - 45% Illustration & Brand */}
      <div className="hidden md:flex md:w-[45%] relative bg-[var(--cream)] flex-col justify-center items-center p-12 lg:p-20 border-r border-white/50 z-10 shadow-2xl">
        {/* Background Blobs */}
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-[var(--softLime)]/40 rounded-full blur-[100px] mix-blend-multiply opacity-60 -z-10" />
        <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-[var(--lavender)]/40 rounded-full blur-[100px] mix-blend-multiply opacity-60 -z-10" />
        
        <div className="w-full max-w-md relative z-10 flex flex-col h-full">
          <Link to="/" className="inline-flex items-center gap-3 group mb-16">
            <div className="w-12 h-12 rounded-full bg-[var(--primaryGreen)] flex items-center justify-center text-white font-serif italic font-bold text-2xl shadow-lg">R</div>
            <span className="serif-heading text-3xl text-[var(--textDark)] font-bold group-hover:text-[var(--primaryGreen)] transition-colors">RecoverIQ</span>
          </Link>

          <div className="flex-grow flex items-center justify-center relative">
            <img src={DoctorsBro} alt="Doctors network illustration" className="w-full h-auto drop-shadow-2xl mix-blend-darken mb-12" />
            
            <motion.div 
              className="absolute bottom-16 -right-12 bg-white/90 backdrop-blur-md border border-[var(--borderSoft)] rounded-2xl p-5 shadow-xl flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="w-12 h-12 rounded-full bg-[var(--softLime)] flex items-center justify-center text-[var(--darkGreen)]">
                <Award size={24} />
              </div>
              <div>
                <p className="text-base font-semibold text-[var(--textDark)]">Top Healthcare Network</p>
                <p className="text-sm text-[var(--textSoft)]">Join 1k+ Verified Doctors</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side - 55% Form */}
      <div className="w-full md:w-[55%] min-h-screen overflow-y-auto flex items-center justify-center p-6 sm:p-12 lg:p-24 relative">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl -z-10" />

        <motion.div 
          className="w-full max-w-xl bg-white/90 backdrop-blur-xl rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-[#E5E7E2] p-10 sm:p-14 my-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-12">
            <h1 className="text-5xl font-serif leading-[1] tracking-tight text-[var(--textDark)] mb-4">Join RecoverIQ</h1>
            <p className="text-lg text-[#5C6B63] leading-relaxed">Create your provider account to start tracking patient milestones.</p>
          </div>

          <form onSubmit={form.handleSubmit(v => mutation.mutate(v))} className="space-y-6">
            {serverError && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-start gap-3">
                 <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 {serverError}
              </div>
            )}
            
            {serverSuccess && (
              <div className="rounded-2xl bg-[var(--softLime)] p-4 text-sm text-[var(--textDark)] border border-[var(--primaryGreen)]/30 flex items-start gap-3">
                 <Award className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--primaryGreen)]" />
                 {serverSuccess}
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input placeholder="Full Name" {...form.register('name')} />
                  {form.formState.errors.name && <span className="text-red-500 text-sm mt-2 block pl-4">{form.formState.errors.name.message}</span>}
                </div>
                <div>
                  <Input type="email" placeholder="Email Address" {...form.register('email')} />
                  {form.formState.errors.email && <span className="text-red-500 text-sm mt-2 block pl-4">{form.formState.errors.email.message}</span>}
                </div>
              </div>

              <div>
                <Input placeholder="Specialization (e.g., Neurological Physio)" {...form.register('specialization')} />
                {form.formState.errors.specialization && <span className="text-red-500 text-sm mt-2 block pl-4">{form.formState.errors.specialization.message}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input type="password" placeholder="Password" {...form.register('password')} />
                  {form.formState.errors.password && <span className="text-red-500 text-sm mt-2 block pl-4">{form.formState.errors.password.message}</span>}
                </div>
                <div>
                  <Input type="password" placeholder="Confirm Password" {...form.register('confirmPassword')} />
                  {form.formState.errors.confirmPassword && <span className="text-red-500 text-sm mt-2 block pl-4">{form.formState.errors.confirmPassword.message}</span>}
                </div>
              </div>

              <div>
                <textarea 
                  className="min-h-[120px] w-full rounded-2xl border border-[#DCE3DA] bg-white px-6 py-4 text-lg transition-all duration-300 focus:ring-4 focus:ring-[#256B52]/10 focus:border-[#256B52] focus:shadow-lg resize-none"
                  placeholder="Brief biography highlighting your experience..." 
                  {...form.register('bio')} 
                />
                {form.formState.errors.bio && <span className="text-red-500 text-sm mt-2 block pl-4">{form.formState.errors.bio.message}</span>}
              </div>
            </div>

            <div className="pt-6 flex flex-col gap-8">
              <Button type="submit" disabled={mutation.isPending} className="group">
                {mutation.isPending ? 'Creating Account...' : 'Apply as Provider'}
                {!mutation.isPending && <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />}
              </Button>

              <div className="flex flex-col items-center gap-2 text-base text-[#5C6B63]">
                <p>Already have an account?</p>
                <Link to="/login" className="font-medium text-[var(--primaryGreen)] hover:text-[var(--darkGreen)] transition-colors decoration-2 underline-offset-4 hover:underline">
                  Sign in instead
                </Link>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
