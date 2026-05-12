<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use App\Models\PatientProgress;
use Illuminate\Http\Request;

use App\Models\PatientDailyLog;
use Carbon\Carbon;

class ProgressController extends Controller
{
    /**
     * GET /api/patient/milestones
     */
    public function milestones(Request $request)
    {
        $patient = $request->user()->patient()
            ->with(['program.milestones', 'progress.dailyLog'])
            ->firstOrFail();

        $completedMap = $patient->progress->keyBy('milestone_id');
        $allMilestones = $patient->program?->milestones->sortBy('due_day')->values();
        
        $startDate = ($patient->enrolled_at ?? $patient->created_at)->startOfDay();
        $currentDay = (int) now()->startOfDay()->diffInDays($startDate) + 1;
        $today = Carbon::today();
        
        // Check if any milestone was completed today
        $completedToday = $patient->progress()
            ->whereDate('completed_at', $today)
            ->where('status', 'Completed')
            ->exists();

        $milestones = [];
        $previousCompleted = true; // First one is unlocked if previous is true

        foreach ($allMilestones as $index => $ms) {
            $progress = $completedMap->get($ms->id);
            $scheduledDate = $startDate->copy()->addDays($ms->due_day - 1)->startOfDay();
            
            $isCompleted = ($progress?->status === 'Completed');
            $isLocked = !$previousCompleted || $scheduledDate->isFuture();
            
            // Available if not locked, not completed, and nothing else completed today
            $isAvailableToday = !$isLocked && !$isCompleted && !$completedToday;

            $milestones[] = [
                'id'           => $ms->id,
                'title'        => $ms->title,
                'description'  => $ms->description,
                'due_day'      => $ms->due_day,
                'scheduled_date' => $scheduledDate->toDateString(),
                'difficulty'   => $ms->difficulty,
                'duration'     => $ms->duration_minutes,
                'category'     => $ms->category,
                'instructions' => $ms->exercise_instructions,
                'media_url'    => $ms->media_url,
                'status'       => $progress?->status ?? 'LOCKED',
                'is_locked'    => $isLocked,
                'is_available_today' => $isAvailableToday,
                'completed_at' => $progress?->completed_at,
                'daily_log'    => $progress?->dailyLog,
                'doctor_notes' => $progress?->doctor_notes,
            ];

            $previousCompleted = $isCompleted;
        }

        return response()->json([
            'streak' => $patient->calculateStreak(),
            'milestones' => $milestones
        ]);
    }

    /**
     * POST /api/patient/milestones/{id}/check-in
     */
    public function checkIn(Request $request, $id)
    {
        $patient = $request->user()->patient;
        $milestone = $patient->program->milestones()->findOrFail($id);

        $request->validate([
            'pain_level' => 'required|integer|min:0|max:10',
            'energy_level' => 'required|integer|min:1|max:5',
            'mobility_score' => 'required|string',
            'exercise_completion' => 'required|integer|min:0|max:100',
            'mood' => 'nullable|string',
            'difficulties' => 'nullable|string',
            'improvements' => 'nullable|string',
        ]);

        // 1. Check if already completed
        $existing = PatientProgress::where('patient_id', $patient->id)
            ->where('milestone_id', $milestone->id)
            ->first();

        if ($existing && $existing->status === 'Completed') {
            return response()->json(['message' => 'Milestone already completed.'], 422);
        }

        // 2. Check if multiple in one day
        $completedToday = $patient->progress()
            ->whereDate('completed_at', Carbon::today())
            ->where('status', 'Completed')
            ->exists();

        if ($completedToday) {
            return response()->json(['message' => 'You can only complete one milestone per day.'], 422);
        }

        // 3. Check sequential unlocking
        $previousMilestone = $patient->program->milestones()
            ->where('due_day', '<', $milestone->due_day)
            ->orderBy('due_day', 'desc')
            ->first();

        if ($previousMilestone) {
            $prevProgress = PatientProgress::where('patient_id', $patient->id)
                ->where('milestone_id', $previousMilestone->id)
                ->first();
            
            if (!$prevProgress || $prevProgress->status !== 'Completed') {
                return response()->json(['message' => 'Please complete the previous milestone first.'], 403);
            }
        }

        // 4. Check time logic
        $startDate = ($patient->enrolled_at ?? $patient->created_at)->startOfDay();
        $scheduledDate = $startDate->copy()->addDays($milestone->due_day - 1)->startOfDay();
        
        if ($scheduledDate->isFuture()) {
            return response()->json(['message' => 'This milestone is scheduled for ' . $scheduledDate->toDateString()], 403);
        }

        // All checks passed, perform atomic transaction
        return \DB::transaction(function () use ($patient, $milestone, $request) {
            $progress = PatientProgress::updateOrCreate(
                ['patient_id' => $patient->id, 'milestone_id' => $milestone->id],
                [
                    'status' => 'Completed',
                    'completed_at' => now(),
                ]
            );

            PatientDailyLog::create([
                'patient_id' => $patient->id,
                'milestone_id' => $milestone->id,
                'progress_id' => $progress->id,
                'pain_level' => $request->pain_level,
                'energy_level' => $request->energy_level,
                'mobility_score' => $request->mobility_score,
                'exercise_completion' => $request->exercise_completion,
                'mood' => $request->mood,
                'difficulties' => $request->difficulties,
                'improvements' => $request->improvements,
            ]);

            return response()->json([
                'message' => 'Day ' . $milestone->due_day . ' completed! Great job.',
                'progress' => $progress
            ], 201);
        });
    }

    public function store(Request $request)
    {
        // Legacy store method - redirect to checkIn or keep for simple updates
        return $this->checkIn($request, $request->milestone_id);
    }

    public function index(Request $request)
    {
        $patient  = $request->user()->patient;
        $progress = PatientProgress::where('patient_id', $patient->id)
            ->with(['milestone', 'dailyLog'])
            ->latest('completed_at')
            ->get();

        return response()->json($progress);
    }
}
