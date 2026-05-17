<?php

namespace App\Http\Controllers\Api\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\PatientProgress;
use App\Models\PatientDailyLog;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $doctor = $user->doctor;

        if (!$doctor) {
            return response()->json(['error' => 'Doctor record not found'], 404);
        }

        // 1. Top Metrics (Scoped to doctor)
        $activePatients = $doctor->patients()->count();
        $successRate = 92; // Placeholder
        $pendingReviews = PatientProgress::whereHas('patient', function ($q) use ($doctor) {
            $q->where('doctor_id', $doctor->id);
        })->where('status', 'Pending Review')->count();

        $todayAppointments = $doctor->appointments()
            ->whereDate('slot_at', Carbon::today())
            ->where('status', 'confirmed')
            ->count();

        // 2. Upcoming Appointments (Next 5)
        $upcomingAppointments = $doctor->appointments()
            ->with(['patient.user', 'patient.program', 'prescription'])
            ->where('slot_at', '>=', now())
            ->where('status', 'confirmed')
            ->orderBy('slot_at', 'asc')
            ->take(5)
            ->get();

        // 3. Recent Activity (Scoped to doctor's patients)
        $activities = PatientProgress::whereHas('patient', function ($q) use ($doctor) {
            $q->where('doctor_id', $doctor->id);
        })
            ->with(['patient.user', 'milestone'])
            ->where('status', 'Completed')
            ->latest('completed_at')
            ->take(10)
            ->get()
            ->map(function ($progress) {
                return [
                    'id' => $progress->id,
                    'patient_name' => $progress->patient->user->name,
                    'activity' => "Completed Milestone: " . $progress->milestone->title,
                    'time' => $progress->completed_at->diffForHumans(),
                    'type' => 'milestone'
                ];
            });

        // 4. Patients Needing Attention
        $attentionNeeded = $doctor->patients()
            ->with(['user'])
            ->get()
            ->map(function ($patient) {
                $lastLog = $patient->logs()->latest()->first();
                $risk = 0;
                $issue = '';

                if (!$lastLog || $lastLog->created_at->lt(now()->subDays(2))) {
                    $risk = 40;
                    $issue = 'Inactive for 2 days';
                } elseif ($lastLog->pain_level > 7) {
                    $risk = 70;
                    $issue = 'Reporting high pain';
                }

                return [
                    'id' => $patient->id,
                    'name' => $patient->user->name,
                    'issue' => $issue,
                    'risk' => $risk,
                ];
            })
            ->filter(fn($p) => $p['risk'] > 0)
            ->sortByDesc('risk')
            ->take(4)
            ->values();

        // 5. Recovery Snapshot (Scoped to doctor's patients)
        $snapshot = PatientProgress::whereHas('patient', function ($q) use ($doctor) {
            $q->where('doctor_id', $doctor->id);
        })
            ->where('completed_at', '>=', now()->subDays(7))
            ->selectRaw('DATE(completed_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'stats' => [
                ['label' => 'Active Recovery Patients', 'value' => $activePatients, 'change' => '+12% this month'],
                ['label' => 'Recovery Success Rate', 'value' => $successRate . '%', 'change' => '+3% this quarter'],
                ['label' => 'Pending Reviews', 'value' => $pendingReviews, 'change' => 'Awaiting review'],
                ['label' => "Today's Sessions", 'value' => $todayAppointments, 'change' => 'Next at 11:00'],
            ],
            'appointments' => $upcomingAppointments,
            'activities' => $activities,
            'attention' => $attentionNeeded,
            'snapshot' => $snapshot,
        ]);
    }
}
