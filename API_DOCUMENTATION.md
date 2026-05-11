# RecoverIQ API Documentation & Testing Guide

## Project Overview
- **Frontend**: React + Vite (http://localhost:5173)
- **Backend**: Laravel (http://localhost:8000/api)
- **Database**: MySQL
- **Authentication**: Laravel Sanctum (Bearer Token)

---

## Authentication Endpoints

### 1. Login (Public)
- **Route**: `POST /api/auth/login`
- **Auth**: None
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: `{ token, user: { id, name, email, role, profile } }`
- **Frontend Service**: `AuthService.login(email, password)`
- **Status**: ✅ Implemented & Working

### 2. Register Doctor (Public)
- **Route**: `POST /api/auth/register-doctor`
- **Auth**: None
- **Request Body**:
  ```json
  {
    "name": "Dr. John Doe",
    "email": "doctor@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "specialization": "Physical Therapy",
    "bio": "Expert in rehabilitation"
  }
  ```
- **Response**: `{ token, user }`
- **Frontend Service**: `AuthService.registerDoctor(data)`
- **Status**: ✅ Implemented & Working

### 3. Logout (Protected)
- **Route**: `POST /api/auth/logout`
- **Auth**: Required (Bearer Token)
- **Response**: `{ message: "Logged out successfully" }`
- **Frontend Service**: `AuthService.logout()`
- **Status**: ✅ Implemented & Working

### 4. Forgot Password (Public)
- **Route**: `POST /api/auth/forgot-password`
- **Auth**: None
- **Request Body**: `{ email: "user@example.com" }`
- **Response**: `{ message }`
- **Frontend Service**: `AuthService.forgotPassword(email)`
- **Status**: ✅ Implemented & Working

### 5. Reset Password (Protected)
- **Route**: `POST /api/auth/reset-password`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "current_password": "oldpass123",
    "password": "newpass123",
    "password_confirmation": "newpass123"
  }
  ```
- **Response**: `{ message }`
- **Frontend Service**: `AuthService.resetPassword(data)`
- **Status**: ✅ Implemented & Working

### 6. Doctor Verification (Public)
- **Route**: `GET /api/auth/verify/{id}/{hash}`
- **Auth**: None
- **Status**: ✅ Implemented (Email verification)

---

## Public Endpoints

### 1. Get All Doctors
- **Route**: `GET /api/doctors`
- **Auth**: None
- **Query Params**: `?page=1&specialization=Physical+Therapy`
- **Response**: `[ { id, name, specialization, bio, ... } ]`
- **Frontend Service**: `PublicService.getDoctors(filters)`
- **Status**: ✅ Implemented
- **Frontend Usage**: Landing page, doctor search

### 2. Get Doctor Slots
- **Route**: `GET /api/doctors/{id}/slots`
- **Auth**: None
- **Response**: `[ { slot_at, available: true/false } ]`
- **Frontend Service**: `PublicService.getDoctorSlots(doctorId)`
- **Status**: ✅ Implemented
- **Frontend Usage**: Doctor appointment booking

### 3. Create Public Appointment
- **Route**: `POST /api/appointments/public`
- **Auth**: None
- **Request Body**:
  ```json
  {
    "booked_by_name": "John Doe",
    "booked_by_email": "john@example.com",
    "doctor_id": 1,
    "slot_at": "2026-05-15 14:00:00"
  }
  ```
- **Response**: `{ message, appointment }`
- **Frontend Service**: `PublicService.bookAppointment(data)`
- **Status**: ✅ Implemented
- **Frontend Usage**: Public appointment booking

---

## Admin Endpoints

### Users Management
| Method | Endpoint | Description | Service |
|--------|----------|-------------|---------|
| GET | `/api/admin/users` | List all users (paginated) | `AdminService.getUsers()` |
| POST | `/api/admin/users` | Create doctor/admin user | `AdminService.createUser(data)` |
| PATCH | `/api/admin/users/{id}` | Update user | `AdminService.updateUser(id, data)` |
| DELETE | `/api/admin/users/{id}` | Delete user | `AdminService.deleteUser(id)` |

**Status**: ✅ All Implemented

### Programs Management
| Method | Endpoint | Description | Service |
|--------|----------|-------------|---------|
| GET | `/api/admin/programs` | List all programs | `AdminService.getPrograms()` |
| POST | `/api/admin/programs` | Create program | `AdminService.createProgram(data)` |
| PATCH | `/api/admin/programs/{id}` | Update program | `AdminService.updateProgram(id, data)` |
| DELETE | `/api/admin/programs/{id}` | Delete program | `AdminService.deleteProgram(id)` |

**Status**: ✅ All Implemented

### Appointments Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/appointments` | List all appointments |
| PATCH | `/api/admin/appointments/{id}` | Update appointment status |

**Status**: ✅ Implemented

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/reports` | Get system reports |

**Status**: ✅ Implemented

---

## Doctor Endpoints

### Patients Management
| Method | Endpoint | Description | Service |
|--------|----------|-------------|---------|
| GET | `/api/doctor/patients` | List assigned patients | `DoctorService.getPatients()` |
| POST | `/api/doctor/patients` | Create patient | `DoctorService.createPatient(data)` |
| GET | `/api/doctor/patients/{id}` | Get patient details | `DoctorService.getPatientDetails(id)` |

**Status**: ✅ All Implemented

### Appointments Management
| Method | Endpoint | Description | Service |
|--------|----------|-------------|---------|
| GET | `/api/doctor/appointments` | List appointments | `DoctorService.getAppointments()` |
| PATCH | `/api/doctor/appointments/{id}` | Update appointment status | `DoctorService.updateAppointmentStatus(id, status, notes)` |

**Status**: ✅ All Implemented

### Reviews
| Method | Endpoint | Description | Service |
|--------|----------|-------------|---------|
| GET | `/api/doctor/reviews/{patientId}` | Get patient reviews | `DoctorService.getPatientReviews(patientId)` |
| POST | `/api/doctor/reviews` | Create review | `DoctorService.createReview(data)` |

**Status**: ✅ All Implemented

### Programs & Milestones
| Method | Endpoint | Description | Service |
|--------|----------|-------------|---------|
| GET | `/api/doctor/programs` | Get programs | `DoctorService.getPrograms()` |
| POST | `/api/doctor/programs/{id}/milestones` | Add milestone | `DoctorService.addMilestone(programId, data)` |
| PATCH | `/api/doctor/milestones/{id}` | Update milestone | `DoctorService.updateMilestone(id, data)` |
| DELETE | `/api/doctor/milestones/{id}` | Delete milestone | `DoctorService.deleteMilestone(id)` |

**Status**: ✅ All Implemented

---

## Patient Endpoints

### Dashboard
| Method | Endpoint | Description | Service |
|--------|----------|-------------|---------|
| GET | `/api/patient/dashboard` | Get dashboard data | `PatientService.getDashboard()` |
| GET | `/api/patient/feedback` | Get feedback & tips | `PatientService.getFeedback()` |

**Status**: ✅ Implemented

### Milestones & Progress
| Method | Endpoint | Description | Service |
|--------|----------|-------------|---------|
| GET | `/api/patient/milestones` | List milestones | `PatientService.getMilestones()` |
| POST | `/api/patient/progress` | Mark milestone complete | `PatientService.markMilestoneComplete(data)` |
| GET | `/api/patient/progress` | Get progress history | `PatientService.getProgressHistory()` |

**Status**: ✅ Implemented

### Appointments
| Method | Endpoint | Description | Service |
|--------|----------|-------------|---------|
| GET | `/api/patient/appointments` | List appointments | `PatientService.getAppointments()` |
| POST | `/api/patient/appointments` | Book appointment | `PatientService.bookAppointment(data)` |

**Status**: ✅ Implemented

### Reviews & Notifications
| Method | Endpoint | Description | Service |
|--------|----------|-------------|---------|
| GET | `/api/patient/reviews` | Get reviews | `PatientService.getReviews()` |
| GET | `/api/patient/notifications` | Get notifications | `PatientService.getNotifications()` |
| PATCH | `/api/patient/notifications/{id}/read` | Mark notification as read | `PatientService.markNotificationRead(id)` |

**Status**: ✅ Implemented

---

## Testing Checklist

### Phase 1: Auth Testing
- [ ] Test login with valid credentials (all roles)
- [ ] Test login with invalid credentials
- [ ] Test doctor registration
- [ ] Test logout
- [ ] Test forgot password flow
- [ ] Test reset password

### Phase 2: Public Testing
- [ ] Get all doctors
- [ ] Get doctor slots
- [ ] Book public appointment

### Phase 3: Admin Testing
- [ ] Get/Create/Update/Delete users
- [ ] Get/Create/Update/Delete programs
- [ ] Get/Update appointments
- [ ] Get reports

### Phase 4: Doctor Testing
- [ ] Get patients list
- [ ] Create patient
- [ ] Get patient details
- [ ] Get/Update appointments
- [ ] Get/Create reviews
- [ ] Get programs & manage milestones

### Phase 5: Patient Testing
- [ ] Get dashboard data
- [ ] Get feedback
- [ ] Get/Track milestones
- [ ] Record progress
- [ ] Get/Book appointments
- [ ] Get notifications

---

## Frontend Service Integration Status

| Service | Status | Missing Endpoints |
|---------|--------|-------------------|
| AuthService | ✅ Complete | None |
| PublicService | ⚠️ Needs Review | Verify all endpoints |
| AdminService | ⚠️ Needs Review | Verify implementation |
| DoctorService | ✅ Complete | None |
| PatientService | ✅ Complete | None |

---

## Frontend Routes Status

| Route | Component | Status | Dependencies |
|-------|-----------|--------|--------------|
| `/` | LandingPage | ⚠️ Needs Redesign | Modern UI |
| `/login` | LoginPage | ✅ Functional | Needs styling |
| `/register-doctor` | DoctorRegisterPage | ✅ Functional | Needs styling |
| `/admin` | AdminDashboard | ❌ Placeholder | Needs implementation |
| `/doctor` | DoctorDashboard | ⚠️ Incomplete | Missing features |
| `/patient` | PatientDashboard | ⚠️ Incomplete | Missing features |

---

## Next Steps

1. ✅ Document all endpoints (Done)
2. Create Postman collection for testing
3. Test backend endpoints with real data
4. Verify frontend service integration
5. Redesign landing page (Spotify-like)
6. Build complete dashboards
7. Implement modern UI components
