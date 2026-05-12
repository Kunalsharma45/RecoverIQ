<?php

namespace App\Http\Controllers\Api\Doctor;

use App\Http\Controllers\Controller;
use App\Models\DoctorPatientNote;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientNotesController extends Controller
{
    /**
     * GET /api/doctor/patients/{id}/notes
     */
    public function index(Request $request, int $patientId)
    {
        $doctor  = $request->user()->doctor;
        $patient = $doctor->patients()->findOrFail($patientId);

        $notes = DoctorPatientNote::where('doctor_id', $doctor->id)
            ->where('patient_id', $patient->id)
            ->latest()
            ->get();

        return response()->json($notes);
    }

    /**
     * POST /api/doctor/patients/{id}/notes
     */
    public function store(Request $request, int $patientId)
    {
        $doctor  = $request->user()->doctor;
        $patient = $doctor->patients()->findOrFail($patientId);

        $request->validate(['note' => 'required|string|max:2000']);

        $note = DoctorPatientNote::create([
            'doctor_id'  => $doctor->id,
            'patient_id' => $patient->id,
            'note'       => $request->note,
        ]);

        return response()->json(['message' => 'Note added.', 'note' => $note], 201);
    }
}
