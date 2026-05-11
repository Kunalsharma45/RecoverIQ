<?php

namespace App\Services;

use App\Mail\AppointmentConfirmationMail;
use App\Mail\DoctorVerificationMail;
use App\Mail\ForgotPasswordMail;
use App\Mail\PatientCredentialsMail;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\URL;

/**
 * Central mail service for RecoverIQ.
 *
 * All application emails are dispatched from here.
 * To add a new mail type:
 *  1. Create a Mailable extending BaseRecoverIQMail
 *  2. Create the blade view in resources/views/emails/
 *  3. Add a static method here
 *  4. Call MailService::yourMethod() from the controller
 */
class MailService
{
    /**
     * Send patient account credentials after a doctor creates the account.
     *
     * Usage: MailService::sendPatientCredentials($user, $plainPassword);
     */
    public static function sendPatientCredentials(User $user, string $plainPassword): void
    {
        Mail::to($user->email, $user->name)
            ->send(new PatientCredentialsMail($user, $plainPassword));
    }

    /**
     * Send appointment confirmation to whoever booked (patient or public guest).
     *
     * Usage: MailService::sendAppointmentConfirmation($appointment);
     *
     * Automatically resolves the correct recipient from the appointment:
     *  - Registered patient → their user email
     *  - Public guest → booked_by_email
     */
    public static function sendAppointmentConfirmation(Appointment $appointment): void
    {
        // Load relationships if not already loaded
        $appointment->loadMissing(['doctor.user', 'patient.user']);

        if ($appointment->patient_id && $appointment->patient?->user) {
            // Registered patient
            $recipientEmail = $appointment->patient->user->email;
            $recipientName  = $appointment->patient->user->name;
        } else {
            // Public guest
            $recipientEmail = $appointment->booked_by_email;
            $recipientName  = $appointment->booked_by_name ?? 'Guest';
        }

        Mail::to($recipientEmail, $recipientName)
            ->send(new AppointmentConfirmationMail($appointment, $recipientName));
    }

    /**
     * Send a password reset link.
     * Uses Laravel's built-in Password broker (stores token in password_reset_tokens).
     *
     * Usage: MailService::sendForgotPassword($user);
     *
     * Returns Password::RESET_LINK_SENT or Password::INVALID_USER.
     */
    public static function sendForgotPassword(User $user): string
    {
        // Generate reset token via Laravel's broker
        $token = Password::broker()->createToken($user);

        // Build the frontend reset URL (React app handles the form)
        $resetUrl = config('app.frontend_url')
            . '/reset-password'
            . '?token=' . $token
            . '&email=' . urlencode($user->email);

        Mail::to($user->email, $user->name)
            ->send(new ForgotPasswordMail($user, $token));

        // Return the URL too (useful for testing / logging)
        return $resetUrl;
    }

    /**
     * Send doctor profile verification email.
     * Uses a temporary signed URL that expires in 24 hours.
     *
     * Usage: MailService::sendDoctorVerification($user);
     */
    public static function sendDoctorVerification(User $user): void
    {
        // Signed backend route — clicking it marks email_verified_at
        // and redirects the doctor to the frontend dashboard
        $verificationUrl = URL::temporarySignedRoute(
            'doctor.verify',
            now()->addHours(24),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        Mail::to($user->email, $user->name)
            ->send(new DoctorVerificationMail($user, $verificationUrl));
    }
}
