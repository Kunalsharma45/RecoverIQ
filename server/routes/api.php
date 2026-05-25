<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\ProgramController as AdminProgramController;
use App\Http\Controllers\Api\Admin\AppointmentController as AdminAppointmentController;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\Doctor\PatientController as DoctorPatientController;
use App\Http\Controllers\Api\Doctor\PatientNotesController;
use App\Http\Controllers\Api\Doctor\AppointmentController as DoctorAppointmentController;
use App\Http\Controllers\Api\Doctor\ReviewController;
use App\Http\Controllers\Api\Doctor\MilestoneController;
use App\Http\Controllers\Api\Doctor\ProgramController as DoctorProgramController;
use App\Http\Controllers\Api\Doctor\AnalyticsController as DoctorAnalyticsController;
use App\Http\Controllers\Api\Doctor\DashboardController as DoctorDashboardController;
use App\Http\Controllers\Api\Doctor\ProfileController as DoctorProfileController;
use App\Http\Controllers\Api\Patient\DashboardController;
use App\Http\Controllers\Api\Patient\ProgressController;
use App\Http\Controllers\Api\Patient\AnalyticsController;
use App\Http\Controllers\Api\Patient\AppointmentController as PatientAppointmentController;
use App\Http\Controllers\Api\Public\DoctorController as PublicDoctorController;
use App\Http\Controllers\Api\Public\AppointmentController as PublicAppointmentController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\Auth\VerificationController;

/*
|----------------------------------------------------------------------
| Public routes (no auth required)
|----------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register-doctor', [AuthController::class, 'registerDoctor']);
    Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
    Route::post('/reset-password', [ForgotPasswordController::class, 'reset']);
    Route::get('/verify/{id}/{hash}', [VerificationController::class, 'verify'])->name('doctor.verify');
});

Route::get('/doctors', [PublicDoctorController::class, 'index']);
Route::get('/doctors/{id}/slots', [PublicDoctorController::class, 'slots']);
Route::post('/appointments/public', [PublicAppointmentController::class, 'store']);

/*
|----------------------------------------------------------------------
| Authenticated routes
|----------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Auth — shared
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/change-password', [AuthController::class, 'resetPassword']);

    /*
    | Admin routes
    */
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // Users
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::post('/users', [AdminUserController::class, 'store']);
        Route::patch('/users/{id}', [AdminUserController::class, 'update']);
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

        // Programs
        Route::get('/programs', [AdminProgramController::class, 'index']);
        Route::post('/programs', [AdminProgramController::class, 'store']);
        Route::patch('/programs/{id}', [AdminProgramController::class, 'update']);
        Route::delete('/programs/{id}', [AdminProgramController::class, 'destroy']);

        // Appointments
        Route::get('/appointments', [AdminAppointmentController::class, 'index']);
        Route::patch('/appointments/{id}', [AdminAppointmentController::class, 'update']);

        // Reports
        Route::get('/reports', [ReportController::class, 'index']);
    });

    /*
    | Doctor routes
    */
    Route::middleware('role:doctor')->prefix('doctor')->group(function () {
        // Patients
        Route::get('/patients', [DoctorPatientController::class, 'index']);
        Route::post('/patients', [DoctorPatientController::class, 'store']);
        Route::get('/patients/{id}', [DoctorPatientController::class, 'show']);
        Route::get('/patients/{id}/notes', [PatientNotesController::class, 'index']);
        Route::post('/patients/{id}/notes', [PatientNotesController::class, 'store']);

        // Appointments
        Route::get('/appointments', [DoctorAppointmentController::class, 'index']);
        Route::get('/appointments-counts', [DoctorAppointmentController::class, 'counts']);
        Route::patch('/appointments/{id}', [DoctorAppointmentController::class, 'update']);
        // Prescriptions (doctor)
        Route::post('/appointments/{id}/prescription', [\App\Http\Controllers\Api\Doctor\PrescriptionController::class, 'store']);

        // Reviews
        Route::post('/reviews', [ReviewController::class, 'store']);
        Route::get('/reviews/{patientId}', [ReviewController::class, 'show']);

        // Programs & Milestones
        Route::get('/programs', [DoctorProgramController::class, 'index']);
        Route::post('/programs', [DoctorProgramController::class, 'store']);
        Route::get('/programs/{id}', [DoctorProgramController::class, 'show']);
        Route::patch('/programs/{id}', [DoctorProgramController::class, 'update']);
        Route::delete('/programs/{id}', [DoctorProgramController::class, 'destroy']);
        Route::post('/programs/{id}/duplicate', [DoctorProgramController::class, 'duplicate']);
        Route::post('/patients/{patientId}/assign-program', [DoctorProgramController::class, 'assign']);

        Route::get('/milestones', [MilestoneController::class, 'index']);
        Route::post('/programs/{id}/milestones', [MilestoneController::class, 'store']);
        Route::patch('/milestones/{id}', [MilestoneController::class, 'update']);
        Route::delete('/milestones/{id}', [MilestoneController::class, 'destroy']);
        Route::patch('/milestones/review/{progressId}', [MilestoneController::class, 'review']);

        // Analytics
        Route::get('/analytics', [DoctorAnalyticsController::class, 'index']);

        // Dashboard Summary
        Route::get('/dashboard-summary', [DoctorDashboardController::class, 'index']);

        // Profile
        Route::get('/profile', [DoctorProfileController::class, 'show']);
        Route::put('/profile', [DoctorProfileController::class, 'update']);
    });

    /*
    | Patient routes
    */
    Route::middleware('role:patient')->prefix('patient')->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::get('/feedback', [DashboardController::class, 'feedback']);

        // Recovery Program
        Route::get('/recovery-program', [App\Http\Controllers\Api\Patient\RecoveryProgramController::class, 'index']);
        Route::get('/analytics', [AnalyticsController::class, 'index']);

        // Milestones & Progress
        Route::get('/milestones', [ProgressController::class, 'milestones']);
        Route::post('/milestones/{id}/check-in', [ProgressController::class, 'checkIn']);
        Route::post('/progress', [ProgressController::class, 'store']);
        Route::get('/progress', [ProgressController::class, 'index']);

        // Appointments
        Route::get('/appointments', [PatientAppointmentController::class, 'index']);
        Route::post('/appointments', [PatientAppointmentController::class, 'store']);

        // Prescriptions (patient)
        Route::get('/prescriptions', [\App\Http\Controllers\Api\Patient\PrescriptionController::class, 'index']);
        Route::get('/prescriptions/{id}', [\App\Http\Controllers\Api\Patient\PrescriptionController::class, 'show']);

        // Reviews & Notifications
        Route::get('/reviews', [PatientAppointmentController::class, 'reviews']);
        Route::get('/notifications', [PatientAppointmentController::class, 'notifications']);
        Route::patch('/notifications/{id}/read', [PatientAppointmentController::class, 'markRead']);
    });
});
