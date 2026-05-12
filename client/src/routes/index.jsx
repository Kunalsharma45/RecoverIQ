import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from '../pages/public/Landing.jsx'
import Login from '../pages/auth/Login.jsx'
import RegisterDoctor from '../pages/auth/RegisterDoctor.jsx'
import Book from '../pages/public/Book.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import PublicLayout from '../layouts/PublicLayout.jsx'
import DoctorLayout from '../layouts/DoctorLayout.jsx'
import DoctorDashboard from '../pages/doctor/Dashboard.jsx'
import DoctorAppointments from '../pages/doctor/Appointments.jsx'
import DoctorPatients from '../pages/doctor/Patients.jsx'
import DoctorPrograms from '../pages/doctor/Programs.jsx'
import DoctorAnalytics from '../pages/doctor/Analytics.jsx'
import DoctorProfile from '../pages/doctor/Profile.jsx'
import PatientLayout from '../layouts/PatientLayout.jsx'
import PatientDashboard from '../pages/patient/Dashboard.jsx'
import PatientMilestones from '../pages/patient/Milestones.jsx'
import PatientAppointments from '../pages/patient/Appointments.jsx'
import PatientSettings from '../pages/patient/Settings.jsx'

import PatientRecoveryProgram from '../pages/patient/RecoveryProgram.jsx'
import PatientTimeline from '../pages/patient/Timeline.jsx'

const Placeholder = ({ title }) => (
  <div className="pt-36">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <h1 className="serif-heading text-4xl">{title}</h1>
      <p className="mt-4 text-[var(--textSoft)]">This area will be built next.</p>
    </div>
  </div>
)

export default function RoutesIndex() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/book" element={<Book />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register-doctor" element={<RegisterDoctor />} />

      <Route
        path="/doctor"
        element={<ProtectedRoute roles={["doctor"]}><DoctorLayout /></ProtectedRoute>}
      >
        <Route index element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="programs" element={<DoctorPrograms />} />
        <Route path="analytics" element={<DoctorAnalytics />} />
        <Route path="profile" element={<DoctorProfile />} />
      </Route>

      <Route
        path="/patient"
        element={<ProtectedRoute roles={["patient"]}><PatientLayout /></ProtectedRoute>}
      >
        <Route index element={<PatientDashboard />} />
        <Route path="milestones" element={<PatientMilestones />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="program" element={<PatientRecoveryProgram />} />
        <Route path="timeline" element={<PatientTimeline />} />
        <Route path="settings" element={<PatientSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
