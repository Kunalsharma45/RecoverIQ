import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true,
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(err)
  }
)

export const patientApi = {
  getDashboard: () => api.get('/patient/dashboard'),
  getRecoveryProgram: () => api.get('/patient/recovery-program'),
  getAnalytics: () => api.get('/patient/analytics'),
  getMilestones: () => api.get('/patient/milestones'),
  completeMilestone: (id, data) => api.post(`/patient/milestones/${id}/check-in`, data),
  updateProgress: (data) => api.post('/patient/progress', data),
  getAppointments: () => api.get('/patient/appointments'),
  bookAppointment: (data) => api.post('/patient/appointments', data),
  getPrescriptions: () => api.get('/patient/prescriptions'),
  getPrescription: (id) => api.get(`/patient/prescriptions/${id}`),
  getNotifications: () => api.get('/patient/notifications'),
  markNotificationRead: (id) => api.patch(`/patient/notifications/${id}/read`),
}

export const doctorApi = {
  getDashboard: () => api.get('/doctor/dashboard-summary'),
  getPatients: () => api.get('/doctor/patients'),
  getPatientDetail: (id) => api.get(`/doctor/patients/${id}`),
  getPatientNotes: (id) => api.get(`/doctor/patients/${id}/notes`),
  addPatientNote: (id, data) => api.post(`/doctor/patients/${id}/notes`, data),
  getMilestones: (params) => api.get('/doctor/milestones', { params }),
  createMilestone: (programId, data) => api.post(`/doctor/programs/${programId}/milestones`, data),
  updateMilestone: (id, data) => api.patch(`/doctor/milestones/${id}`, data),
  deleteMilestone: (id) => api.delete(`/doctor/milestones/${id}`),
  reviewMilestone: (progressId, data) => api.patch(`/doctor/milestones/review/${progressId}`, data),
  getPrograms: () => api.get('/doctor/programs'),
  createProgram: (data) => api.post('/doctor/programs', data),
  getProgramDetail: (id) => api.get(`/doctor/programs/${id}`),
  updateProgram: (id, data) => api.patch(`/doctor/programs/${id}`, data),
  deleteProgram: (id) => api.delete(`/doctor/programs/${id}`),
  duplicateProgram: (id) => api.post(`/doctor/programs/${id}/duplicate`),
  assignProgram: (patientId, data) => api.post(`/doctor/patients/${patientId}/assign-program`, data),
  getAppointments: () => api.get('/doctor/appointments'),
  updateAppointment: (id, data) => api.patch(`/doctor/appointments/${id}`, data),
  createPrescription: (appointmentId, data) => api.post(`/doctor/appointments/${appointmentId}/prescription`, data),
  getAnalytics: (params) => api.get('/doctor/analytics', { params }),
  getProfile: () => api.get('/doctor/profile'),
  updateProfile: (data) => api.put('/doctor/profile', data),
}

export default api
