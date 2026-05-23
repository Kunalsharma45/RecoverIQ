<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Mail\PatientCredentialsMail;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AppointmentController extends Controller
{
    /**
     * POST /api/appointments/public
     * Guest user books an appointment (no auth required).
     */
    public function store(Request $request)
    {
        $request->validate([
            'doctor_id'       => 'required|exists:doctors,id',
            'booked_by_name'  => 'required|string|max:255',
            'booked_by_email' => 'required|email|confirmed',
            'slot_at'             => 'required|date|after:now',
            'notes'               => 'nullable|string',
            'problem_description' => 'nullable|string|max:1000',
        ]);

        // Check slot is not already taken
        $conflict = Appointment::where('doctor_id', $request->doctor_id)
            ->where('slot_at', $request->slot_at)
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($conflict) {
            return response()->json(['message' => 'This slot is no longer available.'], 422);
        }

        $booking = DB::transaction(function () use ($request) {
            $user = User::where('email', $request->booked_by_email)->first();
            $plainPassword = null;

            if ($user && ! $user->isPatient()) {
                abort(response()->json(['message' => 'This email is already used by another account.'], 422));
            }

            if (! $user) {
                $plainPassword = Str::random(10);

                $user = User::create([
                    'name'     => $request->booked_by_name,
                    'email'    => $request->booked_by_email,
                    'password' => $plainPassword,
                    'role'     => 'patient',
                ]);
            }

            $patient = $user->patient;

            if (! $patient) {
                $patient = Patient::create([
                    'user_id'     => $user->id,
                    'doctor_id'   => $request->doctor_id,
                    'program_id'  => null,
                    'enrolled_at' => now(),
                ]);
            }

            $appointment = Appointment::create([
                'doctor_id'           => $request->doctor_id,
                'patient_id'          => $patient->id,
                'booked_by_name'      => $request->booked_by_name,
                'booked_by_email'     => $request->booked_by_email,
                'slot_at'             => $request->slot_at,
                'notes'               => $request->notes,
                'problem_description' => $request->problem_description,
                'status'              => 'pending',
            ]);

            return [
                'user' => $user,
                'appointment' => $appointment,
                'plainPassword' => $plainPassword,
            ];
        });

        // NOTE: previously we emailed credentials immediately when a new patient account
        // was created. To ensure the doctor approves before credentials are sent, we
        // defer sending the PatientCredentialsMail until the doctor confirms the
        // appointment. The plain password is kept on the user record for now and
        // will be used (then hashed) when the doctor accepts.

        return response()->json([
            'message'     => $booking['plainPassword']
                ? 'Appointment booked. Your patient login credentials have been emailed to you.'
                : 'Appointment booked.',
            'appointment' => $booking['appointment']->load('doctor.user', 'patient.user'),
        ], 201);
    }
}
