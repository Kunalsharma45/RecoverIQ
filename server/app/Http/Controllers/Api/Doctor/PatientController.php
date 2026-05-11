<?php

namespace App\Http\Controllers\Api\Doctor;

use App\Http\Controllers\Controller;
use App\Mail\PatientCredentialsMail;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PatientController extends Controller
{
    /**
     * GET /api/doctor/patients
     */
    public function index(Request $request)
    {
        $doctor = $request->user()->doctor;

        $patients = $doctor->patients()
            ->with(['user', 'program', 'progress'])
            ->paginate(20);

        return response()->json($patients);
    }

    /**
     * POST /api/doctor/patients
     * Creates patient user + sends credentials email.
     */
    public function store(Request $request)
    {
        $doctor = $request->user()->doctor;

        $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:users,email',
            'program_id'    => 'required|exists:rehab_programs,id',
            'appointment_id'=> 'nullable|exists:appointments,id',
        ]);

        $password = Str::random(10);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $password,
            'role'     => 'patient',
        ]);

        $patient = Patient::create([
            'user_id'     => $user->id,
            'doctor_id'   => $doctor->id,
            'program_id'  => $request->program_id,
            'enrolled_at' => now(),
        ]);

        $appointment = null;

        if ($request->appointment_id) {
            $appointment = $doctor->appointments()->find($request->appointment_id);
        }

        if (! $appointment) {
            $appointment = $doctor->appointments()
                ->whereNull('patient_id')
                ->where('booked_by_email', $request->email)
                ->whereIn('status', ['pending', 'confirmed'])
                ->orderBy('slot_at')
                ->first();
        }

        if ($appointment) {
            $appointment->update([
                'patient_id' => $patient->id,
                'status'     => 'confirmed',
            ]);
        }

        // Send credentials email (logged locally in dev)
        Mail::to($user->email)->send(new PatientCredentialsMail($user, $password));

        return response()->json([
            'message' => 'Patient created. Credentials sent to ' . $user->email,
            'patient' => $patient->load(['user', 'program']),
        ], 201);
    }

    /**
     * GET /api/doctor/patients/{id}
     */
    public function show(Request $request, int $id)
    {
        $doctor  = $request->user()->doctor;
        $patient = $doctor->patients()
            ->with(['user', 'program.milestones', 'progress.milestone', 'appointments', 'reviews'])
            ->findOrFail($id);

        return response()->json($patient);
    }
}
