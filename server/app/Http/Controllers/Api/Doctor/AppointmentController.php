<?php

namespace App\Http\Controllers\Api\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;

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
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
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
            'status' => 'required|in:confirmed,completed,cancelled',
            'notes'  => 'nullable|string',
        ]);

        $appointment->update($request->only(['status', 'notes']));

        return response()->json([
            'message'     => 'Appointment updated.',
            'appointment' => $appointment,
        ]);
    }
}
