<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProgramMilestone;
use App\Models\RehabProgram;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    /**
     * GET /api/admin/programs
     */
    public function index()
    {
        $programs = RehabProgram::withCount('patients')
            ->with('milestones')
            ->orderBy('duration_days')
            ->get();

        return response()->json($programs);
    }

    /**
     * POST /api/admin/programs
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'duration_days' => 'required|in:15,30,60',
            'description'   => 'nullable|string',
            'milestones'    => 'nullable|array',
            'milestones.*.title'       => 'required_with:milestones|string',
            'milestones.*.description' => 'nullable|string',
            'milestones.*.due_day'     => 'required_with:milestones|integer|min:1',
        ]);

        $program = RehabProgram::create($request->only(['name', 'duration_days', 'description']));

        if ($request->has('milestones')) {
            foreach ($request->milestones as $ms) {
                $program->milestones()->create($ms);
            }
        }

        return response()->json([
            'message' => 'Program created.',
            'program' => $program->load('milestones'),
        ], 201);
    }

    /**
     * PATCH /api/admin/programs/{id}
     */
    public function update(Request $request, int $id)
    {
        $program = RehabProgram::findOrFail($id);

        $request->validate([
            'name'          => 'sometimes|string|max:255',
            'duration_days' => 'sometimes|in:15,30,60',
            'description'   => 'nullable|string',
        ]);

        $program->update($request->only(['name', 'duration_days', 'description']));

        return response()->json(['message' => 'Program updated.', 'program' => $program]);
    }

    /**
     * DELETE /api/admin/programs/{id}
     */
    public function destroy(int $id)
    {
        $program = RehabProgram::findOrFail($id);
        $program->delete();

        return response()->json(['message' => 'Program deleted.']);
    }
}
