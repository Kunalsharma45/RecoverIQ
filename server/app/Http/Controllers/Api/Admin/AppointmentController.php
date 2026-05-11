<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * GET /api/admin/appointments
     */
    public function index(Request $request)
    {
        $query = Appointment::with(['doctor.user', 'patient.user']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('doctor_id')) {
            $query->where('doctor_id', $request->doctor_id);
        }

        $appointments = $query->latest('slot_at')->paginate(20);

        return response()->json($appointments);
    }

    /**
     * PATCH /api/admin/appointments/{id}
     * Admin can cancel any appointment.
     */
    public function update(Request $request, int $id)
    {
        $appointment = Appointment::findOrFail($id);

        $request->validate([
            'status' => 'required|in:cancelled',
        ]);

        $appointment->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Appointment cancelled.', 'appointment' => $appointment]);
    }
}
