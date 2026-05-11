import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { Award, TrendingUp } from 'lucide-react'
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
    <div className="min-h-screen bg-[var(--cream)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 items-stretch">
          <motion.div
            className="rounded-[40px] overflow-hidden shadow-xl bg-[var(--cream)] flex items-center justify-center p-12 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="absolute top-16 left-8 sm:left-12 bg-white/80 backdrop-blur-md border border-[var(--borderSoft)] rounded-2xl p-4 shadow-lg flex items-center gap-4 z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="w-10 h-10 rounded-full bg-[var(--softLime)] flex items-center justify-center text-[var(--darkGreen)]">
                <Award size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--textDark)]">Top Healthcare Network</p>
                <p className="text-xs text-[var(--textSoft)]">Join 1k+ Verified Doctors</p>
              </div>
            </motion.div>

            <motion.div 
              className="absolute bottom-24 right-8 sm:right-12 bg-white/80 backdrop-blur-md border border-[var(--borderSoft)] rounded-2xl p-4 shadow-lg flex items-center gap-4 z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="w-10 h-10 rounded-full bg-[var(--darkGreen)] text-white flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--textDark)]">Track Recovery</p>
                <p className="text-xs text-[var(--textSoft)]">Monitor patient milestones</p>
              </div>
            </motion.div>
            
            <img src={DoctorsBro} alt="Doctors illustration" className="w-full h-auto max-w-md object-contain pt-12" />
          </motion.div>

          <motion.div
            className="rounded-[40px] bg-white/70 border border-[var(--borderSoft)] shadow-lg p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h1 className="serif-heading text-4xl">Join as a Doctor</h1>
            <p className="mt-3 text-lg leading-relaxed text-[var(--textSoft)]">
              Become part of a premium rehabilitation network focused on compassionate recovery.
            </p>

            <form className="mt-8 space-y-5" onSubmit={form.handleSubmit(values => mutation.mutate(values))}>
              <Input placeholder="Full name" {...form.register('name')} />
              {form.formState.errors.name && <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>}

              <Input placeholder="Email address" {...form.register('email')} />
              {form.formState.errors.email && <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>}

              <Input type="password" placeholder="Password" {...form.register('password')} />
              {form.formState.errors.password && <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>}

              <Input type="password" placeholder="Confirm password" {...form.register('confirmPassword')} />
              {form.formState.errors.confirmPassword && <p className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p>}

              <Input placeholder="Specialization" {...form.register('specialization')} />
              {form.formState.errors.specialization && <p className="text-sm text-red-600">{form.formState.errors.specialization.message}</p>}

              <textarea
                rows={4}
                className="w-full rounded-[24px] bg-white/80 border border-[#D9E1D7] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#256B52]/20"
                placeholder="Short professional bio"
                {...form.register('bio')}
              />
              {form.formState.errors.bio && <p className="text-sm text-red-600">{form.formState.errors.bio.message}</p>}

              <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? 'Submitting...' : 'Create Doctor Account'}
              </Button>
              {serverSuccess && (
                <div className="rounded-[24px] bg-[var(--softLime)] border border-[var(--borderSoft)] px-4 py-3 text-sm text-[var(--textDark)]">
                  {serverSuccess}
                </div>
              )}
              {serverError && (
                <div className="rounded-[24px] bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                  {serverError}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
