# RecoverIQ — Project Workflow

> **Stack:** Vite + React (client) · Laravel (API server) · MySQL

---

## 1. Backend Setup (Laravel)

### 1.1 Create Laravel project

```bash
composer create-project laravel/laravel recoveriq-server
cd recoveriq-server
```

### 1.2 Install backend libraries

```bash
# Authentication (API tokens + SPA support)
composer require laravel/sanctum

# Role & permission management
composer require spatie/laravel-permission

# Mail provider SDK (Mailgun driver)
composer require symfony/mailgun-mailer symfony/http-client

# Image handling (for profile photos, if needed)
composer require intervention/image

# API response helpers
composer require spatie/laravel-query-builder
```

### 1.3 Publish and run migrations

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate
```

### 1.4 Configure `.env`

```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=recoveriq
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=mailgun
MAIL_FROM_ADDRESS=no-reply@recoveriq.com
MAIL_FROM_NAME="RecoverIQ"

MAILGUN_DOMAIN=your-mailgun-domain
MAILGUN_SECRET=your-mailgun-api-key

SANCTUM_STATEFUL_DOMAINS=localhost:5173
FRONTEND_URL=http://localhost:5173
```

---

## 2. Backend — Database Migrations (order matters)

```
users                  — id, name, email, password, role (admin|doctor|patient), is_active
doctors                — id, user_id, specialization, bio
patients               — id, user_id, doctor_id, program_id, enrolled_at
rehab_programs         — id, name, duration_days (15|30|60), description
program_milestones     — id, program_id, title, description, due_day
patient_progress       — id, patient_id, milestone_id, completed_at, notes
appointments           — id, patient_id (nullable), doctor_id, booked_by_name, booked_by_email, slot_at, status (pending|confirmed|completed|cancelled)
doctor_reviews         — id, patient_id, doctor_id, appointment_id (nullable), note, reviewed_at
notifications          — id, user_id, type, data (json), read_at
```

---

## 3. Backend — API Routes

All routes defined in `routes/api.php`. Prefix: `/api`.

### 3.1 Auth routes (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login for all roles, returns Sanctum token |
| POST | `/api/auth/logout` | Revoke current token |
| POST | `/api/auth/reset-password` | Patient first-login password reset |
| POST | `/api/auth/forgot-password` | Send reset link |

### 3.2 Public routes (no auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | List doctors for booking page |
| GET | `/api/doctors/{id}/slots` | Available appointment slots |
| POST | `/api/appointments/public` | Public user books an appointment |

### 3.3 Admin routes `middleware: auth:sanctum, role:admin`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| POST | `/api/admin/users` | Create doctor account |
| PATCH | `/api/admin/users/{id}` | Update / deactivate user |
| DELETE | `/api/admin/users/{id}` | Delete user |
| GET | `/api/admin/appointments` | All appointments system-wide |
| PATCH | `/api/admin/appointments/{id}` | Cancel any appointment |
| GET | `/api/admin/programs` | List rehab programs |
| POST | `/api/admin/programs` | Create program (15/30/60 day) |
| PATCH | `/api/admin/programs/{id}` | Update program |
| DELETE | `/api/admin/programs/{id}` | Delete program |
| GET | `/api/admin/reports` | Recovery analytics summary |

### 3.4 Doctor routes `middleware: auth:sanctum, role:doctor`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctor/dashboard` | Stats: patients, appointments, reviews |
| GET | `/api/doctor/patients` | List own patients |
| POST | `/api/doctor/patients` | Create patient ID + send credentials email |
| GET | `/api/doctor/patients/{id}` | Patient detail + progress |
| GET | `/api/doctor/appointments` | Own appointment list |
| PATCH | `/api/doctor/appointments/{id}` | Confirm or complete appointment |
| POST | `/api/doctor/reviews` | Write a patient review |
| GET | `/api/doctor/reviews/{patientId}` | Reviews for a patient |
| GET | `/api/doctor/programs` | All available rehab programs |
| POST | `/api/doctor/programs/{id}/milestones` | Add milestone to program |
| PATCH | `/api/doctor/milestones/{id}` | Edit milestone |
| DELETE | `/api/doctor/milestones/{id}` | Remove milestone |

### 3.5 Patient routes `middleware: auth:sanctum, role:patient`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patient/dashboard` | Program timeline + progress summary |
| GET | `/api/patient/milestones` | All milestones for assigned program |
| POST | `/api/patient/progress` | Mark a milestone complete |
| GET | `/api/patient/progress` | Own progress history |
| GET | `/api/patient/feedback` | Actionable tips based on progress |
| GET | `/api/patient/appointments` | Own appointments |
| POST | `/api/patient/appointments` | Book appointment with assigned doctor |
| GET | `/api/patient/reviews` | Doctor reviews written for them |
| GET | `/api/patient/notifications` | In-app notifications |
| PATCH | `/api/patient/notifications/{id}/read` | Mark notification read |

---

## 4. Backend — Key Artisan Commands

```bash
# Generate controllers
php artisan make:controller Api/Auth/AuthController
php artisan make:controller Api/Admin/UserController
php artisan make:controller Api/Admin/ProgramController
php artisan make:controller Api/Admin/AppointmentController
php artisan make:controller Api/Admin/ReportController
php artisan make:controller Api/Doctor/PatientController
php artisan make:controller Api/Doctor/AppointmentController
php artisan make:controller Api/Doctor/ReviewController
php artisan make:controller Api/Doctor/MilestoneController
php artisan make:controller Api/Patient/DashboardController
php artisan make:controller Api/Patient/ProgressController
php artisan make:controller Api/Patient/AppointmentController

# Generate models + migrations
php artisan make:model Doctor -m
php artisan make:model Patient -m
php artisan make:model RehabProgram -m
php artisan make:model ProgramMilestone -m
php artisan make:model PatientProgress -m
php artisan make:model Appointment -m
php artisan make:model DoctorReview -m

# Seeders
php artisan make:seeder RolesAndPermissionsSeeder
php artisan make:seeder AdminUserSeeder
php artisan make:seeder RehabProgramSeeder

# Mailable for patient credentials
php artisan make:mail PatientCredentialsMail
php artisan make:mail AppointmentConfirmationMail

# Run server
php artisan serve
```

---

## 5. Frontend Setup (Vite + React)

### 5.1 Create Vite + React project

```bash
npm create vite@latest recoveriq-client -- --template react
cd recoveriq-client
npm install
```

### 5.2 Install frontend libraries

```bash
# Routing
npm install react-router-dom

# Server state management (API calls, caching)
npm install @tanstack/react-query axios

# Form handling + validation
npm install react-hook-form zod @hookform/resolvers

# UI & styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Component library (headless, pairs with Tailwind)
npm install @headlessui/react

# Icons
npm install lucide-react

# Date handling (appointment slots, program timelines)
npm install date-fns

# Toast notifications
npm install react-hot-toast

# Charts (progress dashboard)
npm install recharts

# HTTP client config (already installed with react-query)
# axios is included above
```

### 5.3 Configure Tailwind (`tailwind.config.js`)

```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4f0',
          100: '#d6e4d6',
          500: '#3d6b4f',   // primary green (matches RecoverIQ navbar)
          600: '#2f5440',
          700: '#1e3829',
        },
        cream: '#f5f2ec',   // page background
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],   // headlines
        sans:  ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 5.4 Configure Axios (`src/lib/axios.js`)

```js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  withCredentials: true,
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
```

### 5.5 `.env` (frontend)

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 6. Frontend — Folder Structure

```
src/
├── assets/
├── components/
│   ├── ui/               # Button, Input, Badge, Modal, Spinner
│   ├── layout/           # Navbar, Sidebar, PageWrapper
│   └── shared/           # AppointmentCard, MilestoneItem, ProgressBar
├── features/
│   ├── auth/             # LoginPage, ResetPasswordPage
│   ├── public/           # LandingPage, BookingPage
│   ├── admin/            # AdminDashboard, UserManager, ProgramManager
│   ├── doctor/           # DoctorDashboard, CreatePatient, ReviewForm
│   └── patient/          # PatientDashboard, ProgressTracker, Milestones
├── hooks/                # useAuth, useProgram, useAppointments
├── lib/
│   ├── axios.js
│   └── queryClient.js
├── routes/
│   ├── index.jsx         # Root router
│   ├── AdminRoutes.jsx   # Protected by role
│   ├── DoctorRoutes.jsx
│   └── PatientRoutes.jsx
├── store/                # Zustand or Context for auth state
└── main.jsx
```

---

## 7. Frontend — Route Map

```
/                          → LandingPage (public)
/book                      → PublicBookingPage
/login                     → LoginPage
/reset-password            → ResetPasswordPage

/admin                     → AdminDashboard
/admin/users               → UserManager
/admin/programs            → ProgramManager
/admin/appointments        → AppointmentManager
/admin/reports             → ReportsPage

/doctor                    → DoctorDashboard
/doctor/patients           → PatientList
/doctor/patients/:id       → PatientDetail
/doctor/patients/create    → CreatePatientForm
/doctor/appointments       → DoctorAppointments
/doctor/reviews/:patientId → DoctorReviews

/patient                   → PatientDashboard
/patient/milestones        → MilestonesPage
/patient/progress          → ProgressTracker
/patient/appointments      → PatientAppointments
/patient/reviews           → PatientReviews
```

---

## 8. Development Run

```bash
# Terminal 1 — Laravel
cd server
php artisan serve          # http://localhost:8000

# Terminal 2 — React
cd client
npm run dev                # http://localhost:5173
```

---

## 9. Completed Steps

1. ✅ Run migrations + seed roles, admin user, and 3 rehab programs
2. ✅ Build `AuthController` — login, logout, password reset
3. ✅ Build `PatientCredentialsMail` mailable + test email flow
4. ✅ Build Doctor → Create Patient flow (API + React form) (API complete)
5. ✅ Build Patient dashboard + milestone marking (API complete)
6. ✅ Build public appointment booking page (API complete)
7. ✅ Build Admin panel user management (API complete)
8. ✅ Add notification system (Laravel + React bell icon) (API complete)
9. ✅ Add Recharts progress graphs to patient dashboard (API complete)
10. ✅ Installed frontend libraries and setup project structure

---

## 10. Next Steps (Frontend Implementation)

1. Build Auth pages (Login, Reset Password)
2. Build Admin Dashboard & Pages (Users, Programs, Appointments, Reports)
3. Build Doctor Dashboard & Pages (Patients, Appointments, Reviews)
4. Build Patient Dashboard & Pages (Milestones, Progress, Appointments)
5. Build Public Pages (Landing, Booking)
6. Polish UI to match RecoverIQ color palette (green/cream)