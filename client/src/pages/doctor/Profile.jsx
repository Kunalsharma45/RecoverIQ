import React from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Hospital, 
  ShieldCheck,
  RefreshCw,
  Camera,
  Save,
  X,
  Star,
  Users,
  FileText
} from 'lucide-react'
import { doctorApi } from '../../lib/api'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { motion } from 'framer-motion'

export default function Profile() {
  const queryClient = useQueryClient()
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['doctor-profile'],
    queryFn: () => doctorApi.getProfile().then(res => res.data)
  })

  const form = useForm({
    values: {
      name: profileData?.user?.name || '',
      email: profileData?.user?.email || '',
      phone: profileData?.doctor?.phone || '',
      specialization: profileData?.doctor?.specialization || '',
      experience_years: profileData?.doctor?.experience_years || 0,
      qualification: profileData?.doctor?.qualification || '',
      hospital_name: profileData?.doctor?.hospital_name || '',
      bio: profileData?.doctor?.bio || '',
      password: '',
      password_confirmation: '',
      old_password: '',
    }
  })

  const mutation = useMutation({
    mutationFn: (data) => doctorApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctor-profile'])
      alert('Profile updated successfully')
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Update failed')
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    )
  }

  if (!profileData || !profileData.user || !profileData.doctor) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">Failed to load profile details.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div>
        <h1 className="serif-heading text-3xl text-slate-900">Doctor Profile</h1>
        <p className="text-slate-500 mt-1">Manage your professional presence and account security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side - Profile Summary */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 text-center"
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-4xl font-serif italic border-4 border-white shadow-xl">
                {profileData.user.name[0]}
              </div>
              <button className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-600 shadow-lg hover:bg-slate-50 transition-colors">
                <Camera size={18} />
              </button>
            </div>

            <h2 className="serif-heading text-2xl text-slate-900 mb-1">{profileData.user.name}</h2>
            <p className="text-sm font-bold text-emerald-700 uppercase tracking-widest">{profileData.doctor.specialization}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-50">
              <div className="text-center">
                <div className="text-lg font-black text-slate-900">{profileData.doctor.experience_years}y</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-black text-slate-900">4.9</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</div>
              </div>
            </div>

            <div className="mt-8 space-y-3 text-left">
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <Hospital size={14} className="text-emerald-500" />
                {profileData.doctor.hospital_name || 'Clinic not specified'}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <GraduationCap size={14} className="text-emerald-500" />
                {profileData.doctor.qualification || 'Degrees not listed'}
              </div>
            </div>

            <p className="mt-8 text-xs leading-relaxed text-slate-500 italic">
              "{profileData.doctor.bio || 'Your professional medical bio will appear here.'}"
            </p>
          </motion.div>
        </div>

        {/* Right Side - Editable Information */}
        <div className="lg:col-span-8 space-y-8">
          <form onSubmit={form.handleSubmit(v => mutation.mutate(v))} className="space-y-8">
            {/* Professional Info */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
              <h3 className="serif-heading text-xl text-slate-900 mb-8">Professional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Full Name" icon={User}>
                  <Input {...form.register('name')} placeholder="Dr. John Doe" />
                </Field>
                <Field label="Email Address" icon={Mail}>
                  <Input type="email" {...form.register('email')} placeholder="john@example.com" />
                </Field>
                <Field label="Phone Number" icon={Phone}>
                  <Input {...form.register('phone')} placeholder="+1 234 567 890" />
                </Field>
                <Field label="Specialization" icon={Briefcase}>
                  <Input {...form.register('specialization')} placeholder="Physiotherapist" />
                </Field>
                <Field label="Experience (Years)" icon={Star}>
                  <Input type="number" {...form.register('experience_years')} placeholder="10" />
                </Field>
                <Field label="Qualification" icon={GraduationCap}>
                  <Input {...form.register('qualification')} placeholder="MBBS, MD" />
                </Field>
                <Field label="Clinic/Hospital" icon={Hospital} className="md:col-span-2">
                  <Input {...form.register('hospital_name')} placeholder="St. Mary's Rehabilitation Center" />
                </Field>
                <Field label="Professional Bio" icon={FileText} className="md:col-span-2">
                  <textarea 
                    {...form.register('bio')}
                    className="w-full h-32 rounded-2xl border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none"
                    placeholder="Describe your medical background..."
                  />
                </Field>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
              <h3 className="serif-heading text-xl text-slate-900 mb-8 flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" size={24} />
                Account Security
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Field label="Old Password">
                  <Input type="password" {...form.register('old_password')} placeholder="••••••••" />
                </Field>
                <Field label="New Password">
                  <Input type="password" {...form.register('password')} placeholder="••••••••" />
                </Field>
                <Field label="Confirm Password">
                  <Input type="password" {...form.register('password_confirmation')} placeholder="••••••••" />
                </Field>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest italic">Leave blank to keep existing password</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <button type="button" className="px-8 py-3 rounded-2xl border border-slate-100 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <Button type="submit" disabled={mutation.isPending} className="px-10 h-[52px]">
                {mutation.isPending ? 'Saving...' : 'Save Changes'}
                <Save size={18} className="ml-2" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function Field({ label, icon: Icon, children, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
        {Icon && <Icon size={12} className="text-emerald-500" />}
        {label}
      </label>
      {children}
    </div>
  )
}
