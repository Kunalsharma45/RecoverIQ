<?php

namespace App\Http\Controllers\Api\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\PatientProgress;
use App\Models\ProgramMilestone;
use App\Models\RehabProgram;
use Illuminate\Http\Request;

class MilestoneController extends Controller
{
    /**
     * GET /api/doctor/milestones
     * Get all milestones for patients assigned to the doctor.
     */
    public function index(Request $request)
    {
        $doctor = $request->user()->doctor;
        $patientIds = $doctor->patients()->pluck('id');

        $query = PatientProgress::whereIn('patient_id', $patientIds)
            ->with(['milestone.program', 'patient.user', 'dailyLog']);

        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        if ($request->has('program_id')) {
            $query->whereHas('milestone', function($q) use ($request) {
                $q->where('program_id', $request->program_id);
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $milestones = $query->latest()->get();

        return response()->json($milestones);
    }

    /**
     * POST /api/doctor/programs/{id}/milestones
     */
    public function store(Request $request, int $programId)
    {
        $program = RehabProgram::findOrFail($programId);

        $request->validate([
            'title'                 => 'required|string|max:255',
            'description'           => 'nullable|string',
            'due_day'               => 'required|integer|min:1|max:' . $program->duration_days,
            'difficulty'            => 'sometimes|string|in:Easy,Medium,Hard',
            'duration_minutes'      => 'nullable|integer|min:1',
            'category'              => 'nullable|string',
            'exercise_instructions' => 'nullable|string',
            'media_url'             => 'nullable|url',
        ]);

        $milestone = $program->milestones()->create($request->all());

        return response()->json(['message' => 'Milestone added.', 'milestone' => $milestone], 201);
    }

    /**
     * PATCH /api/doctor/milestones/{id}
     */
    public function update(Request $request, int $id)
    {
        $milestone = ProgramMilestone::findOrFail($id);

        $request->validate([
            'title'                 => 'sometimes|string|max:255',
            'description'           => 'nullable|string',
            'due_day'               => 'sometimes|integer|min:1',
            'difficulty'            => 'sometimes|string|in:Easy,Medium,Hard',
            'duration_minutes'      => 'nullable|integer|min:1',
            'category'              => 'nullable|string',
            'exercise_instructions' => 'nullable|string',
            'media_url'             => 'nullable|url',
        ]);

        $milestone->update($request->all());

        return response()->json(['message' => 'Milestone updated.', 'milestone' => $milestone]);
    }

    /**
     * PATCH /api/doctor/milestones/review/{id}
     * Review a patient's progress.
     */
    public function review(Request $request, int $progressId)
    {
        $progress = PatientProgress::findOrFail($progressId);

        $request->validate([
            'status'       => 'required|string|in:Completed,Missed,Needs Review,In Progress',
            'doctor_notes' => 'nullable|string',
        ]);

        $progress->update([
            'status'       => $request->status,
            'doctor_notes' => $request->doctor_notes,
            'reviewed_at'  => now(),
        ]);

        // Notify the patient about the doctor's review
        $patientUser = $progress->patient?->user;
        if ($patientUser) {
            Notification::create([
                'user_id' => $patientUser->id,
                'type'    => 'milestone_review',
                'data'    => [
                    'title'         => 'Milestone Reviewed by Doctor',
                    'message'       => 'Your doctor reviewed milestone: ' . ($progress->milestone?->title ?? 'your session') . '.',
                    'status'        => $request->status,
                    'doctor_notes'  => $request->doctor_notes,
                    'milestone_id'  => $progress->milestone_id,
                    'reviewed_at'   => now()->toDateTimeString(),
                ],
                'read_at' => null,
            ]);

            // Keep only the 3 most recent notifications — delete older ones
            $keepIds = Notification::where('user_id', $patientUser->id)
                ->latest()
                ->limit(3)
                ->pluck('id');

            Notification::where('user_id', $patientUser->id)
                ->whereNotIn('id', $keepIds)
                ->delete();
        }

        return response()->json(['message' => 'Review submitted.', 'progress' => $progress->load('milestone')]);
    }

    /**
     * DELETE /api/doctor/milestones/{id}
     */
    public function destroy(int $id)
    {
        $milestone = ProgramMilestone::findOrFail($id);
        $milestone->delete();

        return response()->json(['message' => 'Milestone removed.']);
    }
}
