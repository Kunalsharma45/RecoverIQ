<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RecoveryProgramController extends Controller
{
    /**
     * GET /api/patient/recovery-program
     */
    public function index(Request $request)
    {
        $patient = $request->user()->patient()
            ->with(['program', 'doctor', 'progress.milestone'])
            ->firstOrFail();

        if (!$patient->program_id) {
            return response()->json(['message' => 'No recovery program assigned.'], 404);
        }

        $program = $patient->program;
        if (!$program) {
            return response()->json(['message' => 'Assigned program not found.'], 404);
        }

        // Calculate progress - ONLY for current program milestones
        $milestoneIds = $program->milestones()->pluck('id');
        $totalMilestones = $milestoneIds->count();
        $completedMilestones = $patient->progress()
            ->whereIn('milestone_id', $milestoneIds)
            ->where('status', 'Completed')
            ->count();
        $overallProgress = $totalMilestones > 0 ? round(($completedMilestones / $totalMilestones) * 100) : 0;

        // Group milestones into weekly phases
        $milestones = $program->milestones()->orderBy('due_day')->get();
        $weeklyRoadmap = [];
        foreach ($milestones as $ms) {
            $week = (int) ceil($ms->due_day / 7);
            $weeklyRoadmap[$week][] = $ms;
        }

        $startDate = \Carbon\Carbon::parse($patient->enrolled_at ?? $patient->created_at)->startOfDay();
        $today = \Carbon\Carbon::today();

        // Use absolute diff + 1 for day index
        $currentDay = (int) $today->diffInDays($startDate) + 1;

        // If somehow today is before start date, current day is 1
        if ($today->lt($startDate)) $currentDay = 1;

        // Get today's milestone
        $completedMilestoneIds = $patient->progress()
            ->whereIn('milestone_id', $milestones->pluck('id'))
            ->where('status', 'Completed')
            ->pluck('milestone_id')
            ->all();

        $todayMilestone = $program->milestones()
            ->where('due_day', $currentDay)
            ->whereNotIn('id', $completedMilestoneIds)
            ->first();

        // If the patient already completed today's milestone, don't return it as "today_milestone"
        if ($todayMilestone) {
            $completed = $patient->progress()
                ->where('milestone_id', $todayMilestone->id)
                ->where('status', 'Completed')
                ->exists();

            if ($completed) {
                $todayMilestone = null;
            }
        }

        // Get next milestone
        $upcomingMilestone = $program->milestones()
            ->where('due_day', '>', $currentDay)
            ->whereNotIn('id', $completedMilestoneIds)
            ->orderBy('due_day')
            ->first();

        return response()->json([
            'program_title' => $program->name,
            'description' => $program->description,
            'duration_days' => $program->duration_days,
            'streak' => $patient->calculateStreak(),
            'doctor' => $patient->doctor ? [
                'name' => $patient->doctor->user->name,
                'specialty' => $patient->doctor->specialty,
            ] : null,
            'overall_progress' => $overallProgress,
            'estimated_completion' => $startDate->copy()->addDays($program->duration_days)->format('Y-m-d'),
            'weekly_roadmap' => $weeklyRoadmap,
            'recovery_phases' => [
                ['name' => 'Initial Phase', 'weeks' => '1-2', 'goal' => 'Stability & Pain Management'],
                ['name' => 'Mobility Phase', 'weeks' => '3-4', 'goal' => 'Range of Motion'],
                ['name' => 'Strengthening Phase', 'weeks' => '5-8', 'goal' => 'Functional Strength'],
            ],
            'today_milestone' => $todayMilestone,
            'upcoming_milestone' => $upcomingMilestone,
        ]);
    }
}
