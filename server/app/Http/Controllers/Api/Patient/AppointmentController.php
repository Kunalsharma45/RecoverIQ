<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * GET /api/patient/appointments
     */
    public function index(Request $request)
    {
        $patient      = $request->user()->patient;

        // Auto-attach any legacy appointments created before patient linkage
        Appointment::whereNull('patient_id')
            ->where('doctor_id', $patient->doctor_id)
            ->where('booked_by_email', $patient->user->email)
            ->whereIn('status', ['pending', 'confirmed'])
            ->update(['patient_id' => $patient->id]);

        $appointments = Appointment::where('patient_id', $patient->id)
            ->with('doctor.user')
            ->orderBy('slot_at')
            ->get();

        return response()->json($appointments);
    }

    /**
     * POST /api/patient/appointments
     * Patient books with their assigned doctor.
     */
    public function store(Request $request)
    {
        $patient = $request->user()->patient()->with('doctor')->firstOrFail();

        if (! $patient->doctor_id) {
            return response()->json(['message' => 'No doctor assigned yet.'], 422);
        }

        $request->validate([
            'slot_at'             => 'required|date|after:now',
            'notes'               => 'nullable|string',
            'problem_description' => 'nullable|string|max:1000',
        ]);

        $appointment = Appointment::create([
            'patient_id'          => $patient->id,
            'doctor_id'           => $patient->doctor_id,
            'slot_at'             => $request->slot_at,
            'notes'               => $request->notes,
            'problem_description' => $request->problem_description,
            'status'              => 'pending',
        ]);

        return response()->json([
            'message'     => 'Appointment booked.',
            'appointment' => $appointment->load('doctor.user'),
        ], 201);
    }

    /**
     * GET /api/patient/reviews
     */
    public function reviews(Request $request)
    {
        $patient = $request->user()->patient;
        $reviews = $patient->reviews()->with('doctor.user')->latest()->get();

        return response()->json($reviews);
    }

    /**
     * GET /api/patient/notifications
     */
    public function notifications(Request $request)
    {
        $notifications = $request->user()->notifications()->latest()->get();

        return response()->json($notifications);
    }

    /**
     * PATCH /api/patient/notifications/{id}/read
     */
    public function markRead(Request $request, int $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->update(['read_at' => now()]);

        return response()->json(['message' => 'Notification marked as read.']);
    }
}
