<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * GET /api/patient/dashboard
     * Program timeline + progress summary.
     */
    public function index(Request $request)
    {
        $patient = $request->user()->patient()
            ->with(['doctor.user', 'program.milestones', 'progress.milestone'])
            ->firstOrFail();

        $totalMilestones     = $patient->program?->milestones->count() ?? 0;
        $completedMilestones = $patient->progress->whereNotNull('completed_at')->count();
        $completionPercent   = $totalMilestones > 0
            ? round(($completedMilestones / $totalMilestones) * 100)
            : 0;

        $daysSinceEnrolled = $patient->enrolled_at
            ? (int) $patient->enrolled_at->diffInDays(now())
            : 0;

        return response()->json([
            'patient'             => $patient,
            'total_milestones'    => $totalMilestones,
            'completed_milestones'=> $completedMilestones,
            'completion_percent'  => $completionPercent,
            'days_since_enrolled' => $daysSinceEnrolled,
            'program_duration'    => $patient->program?->duration_days,
        ]);
    }

    /**
     * GET /api/patient/feedback
     * Simple actionable tips based on progress.
     */
    public function feedback(Request $request)
    {
        $patient = $request->user()->patient()
            ->with(['program.milestones', 'progress'])
            ->firstOrFail();

        $completedIds  = $patient->progress->whereNotNull('completed_at')->pluck('milestone_id');
        $nextMilestone = $patient->program?->milestones
            ->whereNotIn('id', $completedIds)
            ->sortBy('due_day')
            ->first();

        $tips = [];

        if ($nextMilestone) {
            $tips[] = "Your next goal: \"{$nextMilestone->title}\" — due by day {$nextMilestone->due_day}.";
        }

        $totalMilestones = $patient->program?->milestones->count() ?? 0;
        $completedCount  = $completedIds->count();

        if ($totalMilestones > 0) {
            $pct = round(($completedCount / $totalMilestones) * 100);
            if ($pct >= 80) {
                $tips[] = "Excellent progress! You\'re {$pct}% through your recovery program.";
            } elseif ($pct >= 50) {
                $tips[] = "Good work! You\'re halfway through. Keep it up!";
            } else {
                $tips[] = "Stay consistent — small daily steps lead to full recovery.";
            }
        }

        return response()->json(['tips' => $tips, 'next_milestone' => $nextMilestone]);
    }
}
