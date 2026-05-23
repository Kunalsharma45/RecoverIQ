<?php

namespace App\Http\Controllers\Api\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Notification as AppNotification;
use App\Events\AppointmentCompleted;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Mail\PatientCredentialsMail;

class AppointmentController extends Controller
{
    /**
     * GET /api/doctor/appointments
     */
    public function index(Request $request)
    {
        $doctor = $request->user()->doctor;

        $appointments = $doctor->appointments()
            ->with(['patient.user'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->orderBy('slot_at')
            ->paginate(20);

        return response()->json($appointments);
    }

    /**
     * PATCH /api/doctor/appointments/{id}
     * Doctor can confirm or complete their own appointments.
     */
    public function update(Request $request, int $id)
    {
        $doctor      = $request->user()->doctor;
        $appointment = $doctor->appointments()->findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,confirmed,in_progress,completed,cancelled',
            'notes'  => 'nullable|string',
        ]);

        $data = $request->only(['status', 'notes']);

        // If moving to in_progress, ensure appointment is confirmed first
        if (isset($data['status']) && $data['status'] === 'in_progress' && $appointment->status === 'pending') {
            // allow doctor to start the session directly
        }

        $oldStatus = $appointment->status;
        $appointment->update($data);

        // If appointment moved to completed, create notifications and log
        if (($oldStatus !== 'completed') && ($appointment->status === 'completed')) {
            try {
                $message = "Appointment #{$appointment->id} marked completed by doctor_id={$appointment->doctor_id}";
                // If appointment moved to confirmed, send patient credentials (if present and not yet sent)
                if (($oldStatus !== 'confirmed') && ($appointment->status === 'confirmed')) {
                    try {
                        if ($appointment->patient && $appointment->patient->user) {
                            $user = $appointment->patient->user;

                            // If the user's password appears to be stored in plaintext (legacy), send it now
                            if (!str_starts_with($user->password, '$2y$') && !str_starts_with($user->password, '$argon')) {
                                $plain = $user->password;
                                Mail::to($user->email)->send(new PatientCredentialsMail($user, $plain, $appointment));

                                // Hash the password after emailing so it is not stored in plaintext
                                $user->password = Hash::make($plain);
                                $user->save();
                            }
                        }
                    } catch (\Throwable $e) {
                        Log::error('Failed to send patient credentials on confirm: ' . $e->getMessage());
                    }
                }


                // Notify patient
                if ($appointment->patient && $appointment->patient->user) {
                    AppNotification::create([
                        'user_id' => $appointment->patient->user->id,
                        'type' => 'appointment_completed',
                        'data' => [
                            'appointment_id' => $appointment->id,
                            'message' => 'Your appointment has been marked completed by the doctor.',
                        ],
                    ]);
                    // Broadcast
                    event(new AppointmentCompleted($appointment, $appointment->patient->user->id));
                }

                // Notify doctor (self) as a record
                if ($appointment->doctor && $appointment->doctor->user) {
                    AppNotification::create([
                        'user_id' => $appointment->doctor->user->id,
                        'type' => 'appointment_completed',
                        'data' => [
                            'appointment_id' => $appointment->id,
                            'message' => 'You have completed the appointment.',
                        ],
                    ]);
                    event(new AppointmentCompleted($appointment, $appointment->doctor->user->id));
                }
            } catch (\Throwable $e) {
                Log::error('Failed to create completion notifications: ' . $e->getMessage());
            }
        }
        return response()->json([
            'message'     => 'Appointment updated.',
            'appointment' => $appointment,
        ]);
    }

    /**
     * GET /api/doctor/appointments-counts
     * Returns counts per status for the authenticated doctor.
     */
    public function counts(Request $request)
    {
        $doctor = $request->user()->doctor;

        $counts = [
            'pending' => Appointment::where('doctor_id', $doctor->id)->where('status', 'pending')->count(),
            'confirmed' => Appointment::where('doctor_id', $doctor->id)->where('status', 'confirmed')->count(),
            'in_progress' => Appointment::where('doctor_id', $doctor->id)->where('status', 'in_progress')->count(),
            'completed' => Appointment::where('doctor_id', $doctor->id)->where('status', 'completed')->count(),
            'cancelled' => Appointment::where('doctor_id', $doctor->id)->where('status', 'cancelled')->count(),
            'all' => Appointment::where('doctor_id', $doctor->id)->count(),
        ];

        return response()->json($counts);
    }
}
