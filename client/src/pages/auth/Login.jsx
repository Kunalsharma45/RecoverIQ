import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'

const schema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  remember: z.boolean().optional(),
})

const image = 'https://images.unsplash.com/photo-1580281658706-8b7a3f495fe3?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [serverError, setServerError] = React.useState('')
  const [fieldErrors, setFieldErrors] = React.useState({})

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: true },
  })

  const mutation = useMutation({
    mutationFn: async values => {
      const res = await api.post('/auth/login', {
        email: values.email,
        password: values.password,
      })
      return res.data
    },
    onMutate: () => {
      setServerError('')
      setFieldErrors({})
    },
    onSuccess: data => {
      login({ token: data.token, user: data.user })
      if (data?.user?.role === 'admin') navigate('/admin')
      else if (data?.user?.role === 'doctor') navigate('/doctor')
      else navigate('/patient')
    },
    onError: err => {
      const status = err?.response?.status
      const message = err?.response?.data?.message
      const errors = err?.response?.data?.errors || {}

      if (status === 403 && message) {
        setServerError(message)
        return
      }

      if (Object.keys(errors).length) {
        setFieldErrors(errors)
        const firstField = Object.values(errors)[0]?.[0]
        setServerError(firstField || 'Login failed. Please check your details.')
        return
      }

      setServerError(message || 'Login failed. Please check your details.')
    },
  })

  return (
    <div className="min-h-screen bg-[var(--mutedWhite)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-stretch">
          <motion.div
            className="rounded-[40px] overflow-hidden shadow-xl bg-[var(--cream)]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img src={image} alt="rehabilitation care" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            className="rounded-[40px] bg-white/70 border border-[var(--borderSoft)] shadow-lg p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h1 className="serif-heading text-4xl">Welcome Back</h1>
            <p className="mt-3 text-lg leading-relaxed text-[var(--textSoft)]">
              Patient and doctor login. Patients can access only after doctor approval.
            </p>

            <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(values => mutation.mutate(values))}>
              <div>
                <Input type="text" placeholder="Email address" {...form.register('email')} />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-2">{form.formState.errors.email.message}</p>
                )}
                {fieldErrors.email && (
                  <p className="text-sm text-red-600 mt-2">{fieldErrors.email[0]}</p>
                )}
              </div>

              <div>
                <Input type="password" placeholder="Password" {...form.register('password')} />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-600 mt-2">{form.formState.errors.password.message}</p>
                )}
                {fieldErrors.password && (
                  <p className="text-sm text-red-600 mt-2">{fieldErrors.password[0]}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-[var(--textSoft)]">
                  <input type="checkbox" {...form.register('remember')} />
                  Remember me
                </label>
                <button type="button" className="text-[var(--primaryGreen)]">Forgot password?</button>
              </div>

              <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? 'Signing in...' : 'Login'}
              </Button>
              {serverError && (
                <div className="rounded-[24px] bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                  {serverError}
                </div>
              )}
              <p className="text-sm text-[var(--textSoft)] text-center">
                Doctor account needed? <a className="text-[var(--primaryGreen)]" href="/register-doctor">Sign up here</a>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
