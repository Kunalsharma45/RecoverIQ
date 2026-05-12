<?php

namespace App\Http\Controllers\Api\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\ProgramMilestone;
use App\Models\RehabProgram;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProgramController extends Controller
{
    /**
     * GET /api/doctor/programs
     */
    public function index()
    {
        $programs = RehabProgram::withCount(['patients', 'milestones'])
            ->get()
            ->map(function ($program) {
                // Mock some analytics for the premium UI
                $program->completion_rate = rand(65, 95); 
                $program->adherence_score = rand(70, 90);
                return $program;
            });

        return response()->json($programs);
    }

    /**
     * POST /api/doctor/programs
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'duration_days'    => 'required|integer',
            'description'      => 'nullable|string',
            'category'         => 'required|string',
            'difficulty'       => 'required|string',
            'target_patients'  => 'nullable|string',
            'recovery_focus'   => 'nullable|string',
            'milestones'       => 'nullable|array',
            'milestones.*.title'                 => 'required|string',
            'milestones.*.description'           => 'nullable|string',
            'milestones.*.due_day'               => 'required|integer',
            'milestones.*.difficulty'            => 'required|string',
            'milestones.*.intensity'             => 'required|string',
            'milestones.*.duration_minutes'      => 'required|integer',
            'milestones.*.exercise_instructions' => 'nullable|string',
            'milestones.*.precautions'           => 'nullable|string',
            'milestones.*.recovery_goals'        => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $program = RehabProgram::create($validated);

            if (isset($validated['milestones'])) {
                foreach ($validated['milestones'] as $ms) {
                    $program->milestones()->create($ms);
                }
            }

            return response()->json([
                'message' => 'Program created successfully.',
                'program' => $program->load('milestones'),
            ], 201);
        });
    }

    /**
     * GET /api/doctor/programs/{id}
     */
    public function show(int $id)
    {
        $program = RehabProgram::with(['milestones' => function($q) {
            $q->orderBy('due_day');
        }])->withCount('patients')->findOrFail($id);

        return response()->json($program);
    }

    /**
     * PATCH /api/doctor/programs/{id}
     */
    public function update(Request $request, int $id)
    {
        $program = RehabProgram::findOrFail($id);

        $validated = $request->validate([
            'name'             => 'sometimes|string|max:255',
            'duration_days'    => 'sometimes|integer',
            'description'      => 'nullable|string',
            'category'         => 'sometimes|string',
            'difficulty'       => 'sometimes|string',
            'target_patients'  => 'nullable|string',
            'recovery_focus'   => 'sometimes|string|nullable',
            'milestones'       => 'nullable|array',
            'milestones.*.id'                    => 'nullable|integer',
            'milestones.*.title'                 => 'required|string',
            'milestones.*.description'           => 'nullable|string',
            'milestones.*.due_day'               => 'required|integer',
            'milestones.*.difficulty'            => 'required|string',
            'milestones.*.intensity'             => 'required|string',
            'milestones.*.duration_minutes'      => 'required|integer',
            'milestones.*.exercise_instructions' => 'nullable|string',
            'milestones.*.precautions'           => 'nullable|string',
            'milestones.*.recovery_goals'        => 'nullable|string',
        ]);

        return DB::transaction(function () use ($program, $validated) {
            $program->update(collect($validated)->except('milestones')->toArray());

            if (isset($validated['milestones'])) {
                $milestoneIds = [];
                foreach ($validated['milestones'] as $msData) {
                    if (isset($msData['id'])) {
                        $milestone = ProgramMilestone::where('program_id', $program->id)
                            ->findOrFail($msData['id']);
                        // Filter out id to avoid redundant update
                        $milestone->update(collect($msData)->except(['id', 'program_id'])->toArray());
                        $milestoneIds[] = $milestone->id;
                    } else {
                        $newMs = $program->milestones()->create($msData);
                        $milestoneIds[] = $newMs->id;
                    }
                }

                // Delete milestones not in the new list
                $program->milestones()->whereNotIn('id', $milestoneIds)->delete();
            }

            return response()->json([
                'message' => 'Program updated successfully.',
                'program' => $program->load('milestones'),
            ]);
        });
    }

    /**
     * DELETE /api/doctor/programs/{id}
     */
    public function destroy(int $id)
    {
        $program = RehabProgram::withCount('patients')->findOrFail($id);

        if ($program->patients_count > 0) {
            return response()->json([
                'message' => 'Cannot delete program with enrolled patients. Archive it instead.',
            ], 422);
        }

        $program->delete();

        return response()->json(['message' => 'Program deleted successfully.']);
    }

    /**
     * POST /api/doctor/programs/{id}/duplicate
     */
    public function duplicate(int $id)
    {
        $original = RehabProgram::with('milestones')->findOrFail($id);

        return DB::transaction(function () use ($original) {
            $duplicate = $original->replicate();
            $duplicate->name = $original->name . ' (Copy)';
            $duplicate->save();

            foreach ($original->milestones as $ms) {
                $newMs = $ms->replicate();
                $newMs->program_id = $duplicate->id;
                $newMs->save();
            }

            return response()->json([
                'message' => 'Program duplicated successfully.',
                'program' => $duplicate->load('milestones'),
            ]);
        });
    }

    /**
     * POST /api/doctor/patients/{patientId}/assign-program
     */
    public function assign(Request $request, int $patientId)
    {
        $request->validate([
            'program_id' => 'required|exists:rehab_programs,id',
            'start_date' => 'nullable|date',
        ]);

        $patient = Patient::findOrFail($patientId);
        $patient->update([
            'program_id'  => $request->program_id,
            'enrolled_at' => \Carbon\Carbon::parse($request->start_date ?? now())->startOfDay(),
        ]);

        return response()->json([
            'message' => 'Program assigned successfully.',
            'patient' => $patient->load('program'),
        ]);
    }
}
