import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'motion/react'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../lib/api.js'

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

const image = 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3'

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
            className="rounded-[40px] overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img src={image} alt="doctor wellness" className="w-full h-full object-cover" />
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
