<?php

namespace App\Http\Controllers\Api\Doctor;

use App\Http\Controllers\Controller;
use App\Models\DoctorReview;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * POST /api/doctor/reviews
     */
    public function store(Request $request)
    {
        $doctor = $request->user()->doctor;

        $request->validate([
            'patient_id'     => 'required|exists:patients,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'note'           => 'required|string',
        ]);

        // Ensure patient belongs to this doctor
        $patient = $doctor->patients()->findOrFail($request->patient_id);

        $review = DoctorReview::create([
            'patient_id'     => $patient->id,
            'doctor_id'      => $doctor->id,
            'appointment_id' => $request->appointment_id,
            'note'           => $request->note,
            'reviewed_at'    => now(),
        ]);

        return response()->json(['message' => 'Review saved.', 'review' => $review], 201);
    }

    /**
     * GET /api/doctor/reviews/{patientId}
     */
    public function show(Request $request, int $patientId)
    {
        $doctor  = $request->user()->doctor;
        $patient = $doctor->patients()->findOrFail($patientId);

        $reviews = DoctorReview::where('doctor_id', $doctor->id)
            ->where('patient_id', $patient->id)
            ->latest()
            ->get();

        return response()->json($reviews);
    }
}
