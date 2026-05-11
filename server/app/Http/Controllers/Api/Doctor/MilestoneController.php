<?php

namespace App\Http\Controllers\Api\Doctor;

use App\Http\Controllers\Controller;
use App\Models\ProgramMilestone;
use App\Models\RehabProgram;
use Illuminate\Http\Request;

class MilestoneController extends Controller
{
    /**
     * GET /api/doctor/programs
     * All available rehab programs with milestones.
     */
    public function programs()
    {
        $programs = RehabProgram::with('milestones')->orderBy('duration_days')->get();

        return response()->json($programs);
    }

    /**
     * POST /api/doctor/programs/{id}/milestones
     */
    public function store(Request $request, int $programId)
    {
        $program = RehabProgram::findOrFail($programId);

        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_day'     => 'required|integer|min:1|max:' . $program->duration_days,
        ]);

        $milestone = $program->milestones()->create($request->only(['title', 'description', 'due_day']));

        return response()->json(['message' => 'Milestone added.', 'milestone' => $milestone], 201);
    }

    /**
     * PATCH /api/doctor/milestones/{id}
     */
    public function update(Request $request, int $id)
    {
        $milestone = ProgramMilestone::findOrFail($id);

        $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'due_day'     => 'sometimes|integer|min:1',
        ]);

        $milestone->update($request->only(['title', 'description', 'due_day']));

        return response()->json(['message' => 'Milestone updated.', 'milestone' => $milestone]);
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
