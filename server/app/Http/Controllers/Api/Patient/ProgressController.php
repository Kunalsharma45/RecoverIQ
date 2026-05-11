<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use App\Models\PatientProgress;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    /**
     * GET /api/patient/milestones
     * All milestones for the patient's program with completion status.
     */
    public function milestones(Request $request)
    {
        $patient = $request->user()->patient()
            ->with(['program.milestones', 'progress'])
            ->firstOrFail();

        $completedMap = $patient->progress->keyBy('milestone_id');

        $milestones = $patient->program?->milestones->map(function ($ms) use ($completedMap) {
            $progress = $completedMap->get($ms->id);
            return [
                'id'           => $ms->id,
                'title'        => $ms->title,
                'description'  => $ms->description,
                'due_day'      => $ms->due_day,
                'completed'    => (bool) $progress?->completed_at,
                'completed_at' => $progress?->completed_at,
                'notes'        => $progress?->notes,
            ];
        })->sortBy('due_day')->values();

        return response()->json($milestones);
    }

    /**
     * POST /api/patient/progress
     * Mark a milestone as complete.
     */
    public function store(Request $request)
    {
        $patient = $request->user()->patient;

        $request->validate([
            'milestone_id' => 'required|exists:program_milestones,id',
            'notes'        => 'nullable|string',
        ]);

        // Ensure the milestone belongs to the patient's program
        $milestone = $patient->program->milestones()->findOrFail($request->milestone_id);

        $progress = PatientProgress::updateOrCreate(
            ['patient_id' => $patient->id, 'milestone_id' => $milestone->id],
            ['completed_at' => now(), 'notes' => $request->notes]
        );

        return response()->json(['message' => 'Milestone marked complete.', 'progress' => $progress], 201);
    }

    /**
     * GET /api/patient/progress
     * Own progress history.
     */
    public function index(Request $request)
    {
        $patient  = $request->user()->patient;
        $progress = PatientProgress::where('patient_id', $patient->id)
            ->with('milestone')
            ->latest('completed_at')
            ->get();

        return response()->json($progress);
    }
}
