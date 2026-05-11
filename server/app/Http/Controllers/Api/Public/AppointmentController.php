<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use Illuminate\Http\Request;

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
            'booked_by_email' => 'required|email',
            'slot_at'         => 'required|date|after:now',
            'notes'           => 'nullable|string',
        ]);

        // Check slot is not already taken
        $conflict = Appointment::where('doctor_id', $request->doctor_id)
            ->where('slot_at', $request->slot_at)
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($conflict) {
            return response()->json(['message' => 'This slot is no longer available.'], 422);
        }

        $appointment = Appointment::create([
            'doctor_id'       => $request->doctor_id,
            'patient_id'      => null,
            'booked_by_name'  => $request->booked_by_name,
            'booked_by_email' => $request->booked_by_email,
            'slot_at'         => $request->slot_at,
            'notes'           => $request->notes,
            'status'          => 'pending',
        ]);

        return response()->json([
            'message'     => 'Appointment booked. You will receive a confirmation soon.',
            'appointment' => $appointment->load('doctor.user'),
        ], 201);
    }
}
