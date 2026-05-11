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
import PatientLayout from '../layouts/PatientLayout.jsx'
import PatientDashboard from '../pages/patient/Dashboard.jsx'
import PatientMilestones from '../pages/patient/Milestones.jsx'
import PatientAppointments from '../pages/patient/Appointments.jsx'
import PatientReviews from '../pages/patient/Reviews.jsx'
import PatientSettings from '../pages/patient/Settings.jsx'

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
        <Route path="/login" element={<Login />} />
        <Route path="/register-doctor" element={<RegisterDoctor />} />
        <Route path="/book" element={<Book />} />
      </Route>

      <Route
        path="/doctor"
        element={<ProtectedRoute roles={["doctor"]}><DoctorLayout /></ProtectedRoute>}
      >
        <Route index element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="patients" element={<Placeholder title="Patients" />} />
        <Route path="programs" element={<Placeholder title="Programs" />} />
        <Route path="milestones" element={<Placeholder title="Milestones" />} />
        <Route path="reviews" element={<Placeholder title="Reviews & Notes" />} />
        <Route path="analytics" element={<Placeholder title="Analytics" />} />
        <Route path="profile" element={<Placeholder title="Profile" />} />
      </Route>

      <Route
        path="/patient"
        element={<ProtectedRoute roles={["patient"]}><PatientLayout /></ProtectedRoute>}
      >
        <Route index element={<PatientDashboard />} />
        <Route path="milestones" element={<PatientMilestones />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="reviews" element={<PatientReviews />} />
        <Route path="program" element={<Placeholder title="Recovery Program" />} />
        <Route path="timeline" element={<Placeholder title="Progress Timeline" />} />
        <Route path="settings" element={<PatientSettings />} />
      </Route>
      <Route
        path="/admin/*"
        element={<ProtectedRoute roles={["admin"]}><Placeholder title="Admin" /></ProtectedRoute>}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
