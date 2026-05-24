<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
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

        $programMilestoneIds = $patient->program?->milestones->pluck('id') ?? collect();
        $totalMilestones     = $programMilestoneIds->count();

        $completedMilestones = \App\Models\PatientProgress::where('patient_id', $patient->id)
            ->whereIn('milestone_id', $programMilestoneIds)
            ->where('status', 'Completed')
            ->count();

        $completionPercent = $totalMilestones > 0
            ? round(($completedMilestones / $totalMilestones) * 100)
            : 0;

        $startDate = \Carbon\Carbon::parse($patient->enrolled_at ?? $patient->created_at)->startOfDay();
        $daysSinceEnrolled = (int) \Carbon\Carbon::today()->diffInDays($startDate);

        $upcomingAppointment = $patient->appointments()
            ->with('doctor.user')
            ->where('slot_at', '>', now())
            ->whereIn('status', ['pending', 'confirmed', 'in_progress'])
            ->orderBy('slot_at')
            ->first();

        if (! $upcomingAppointment) {
            $latestPrescription = Prescription::where('patient_id', $patient->id)
                ->whereNotNull('next_visit_date')
                ->orderByDesc('next_visit_date')
                ->first();

            if ($latestPrescription) {
                $upcomingAppointment = [
                    'slot_at' => $latestPrescription->next_visit_date->copy()->setTime(10, 0),
                    'status' => 'confirmed',
                    'source' => 'prescription',
                ];
            }
        }

        return response()->json([
            'patient'             => $patient,
            'total_milestones'    => $totalMilestones,
            'completed_milestones' => $completedMilestones,
            'completion_percent'  => $completionPercent,
            'days_since_enrolled' => $daysSinceEnrolled,
            'program_duration'    => $patient->program?->duration_days,
            'upcoming_appointment' => $upcomingAppointment,
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

        $programMilestones = $patient->program?->milestones ?? collect();
        $programMilestoneIds = $programMilestones->pluck('id');

        $completedIds = $patient->progress()
            ->whereIn('milestone_id', $programMilestoneIds)
            ->whereNotNull('completed_at')
            ->pluck('milestone_id');
        $nextMilestone = $patient->program?->milestones
            ->whereNotIn('id', $completedIds)
            ->sortBy('due_day')
            ->first();

        $tips = [];

        if ($nextMilestone) {
            $tips[] = "Your next goal: \"{$nextMilestone->title}\" — due by day {$nextMilestone->due_day}.";
        }

        $totalMilestones = $programMilestones->count();
        $completedCount  = $completedIds->count();

        $startDate = \Carbon\Carbon::parse($patient->enrolled_at ?? $patient->created_at)->startOfDay();
        $today = \Carbon\Carbon::today();
        $currentDay = (int) $today->diffInDays($startDate) + 1;

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
