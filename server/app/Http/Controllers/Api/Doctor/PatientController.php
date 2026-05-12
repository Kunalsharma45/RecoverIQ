<?php

namespace App\Http\Controllers\Api\Doctor;

use App\Http\Controllers\Controller;
use App\Mail\PatientCredentialsMail;
use App\Models\Patient;
use App\Models\PatientDailyLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PatientController extends Controller
{
    /**
     * GET /api/doctor/patients
     * Returns all patients with rich recovery summary.
     */
    public function index(Request $request)
    {
        $doctor = $request->user()->doctor;

        $patients = $doctor->patients()
            ->with(['user', 'program', 'progress.milestone', 'progress.dailyLog', 'appointments'])
            ->get()
            ->map(function ($patient) {
                return $this->buildPatientSummary($patient);
            });

        return response()->json($patients);
    }

    /**
     * POST /api/doctor/patients
     * Creates patient user + sends credentials email.
     */
    public function store(Request $request)
    {
        $doctor = $request->user()->doctor;

        $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:users,email',
            'program_id'    => 'required|exists:rehab_programs,id',
            'appointment_id'=> 'nullable|exists:appointments,id',
        ]);

        $password = Str::random(10);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $password,
            'role'     => 'patient',
        ]);

        $patient = Patient::create([
            'user_id'     => $user->id,
            'doctor_id'   => $doctor->id,
            'program_id'  => $request->program_id,
            'enrolled_at' => now(),
        ]);

        $appointment = null;

        if ($request->appointment_id) {
            $appointment = $doctor->appointments()->find($request->appointment_id);
        }

        if (! $appointment) {
            $appointment = $doctor->appointments()
                ->whereNull('patient_id')
                ->where('booked_by_email', $request->email)
                ->whereIn('status', ['pending', 'confirmed'])
                ->orderBy('slot_at')
                ->first();
        }

        if ($appointment) {
            $appointment->update([
                'patient_id' => $patient->id,
                'status'     => 'confirmed',
            ]);
        }

        // Send credentials email (logged locally in dev)
        Mail::to($user->email)->send(new PatientCredentialsMail($user, $password, $appointment));

        return response()->json([
            'message' => 'Patient created. Credentials sent to ' . $user->email,
            'patient' => $patient->load(['user', 'program']),
        ], 201);
    }

    /**
     * GET /api/doctor/patients/{id}
     * Deep profile: milestones, logs, charts, alerts.
     */
    public function show(Request $request, int $id)
    {
        $doctor  = $request->user()->doctor;
        $patient = $doctor->patients()
            ->with([
                'user',
                'program.milestones',
                'progress.milestone',
                'progress.dailyLog',
                'appointments.doctor.user',
            ])
            ->findOrFail($id);

        $summary = $this->buildPatientSummary($patient);

        // Build daily logs timeline (from progress daily logs)
        $logs = $patient->progress
            ->filter(fn($p) => $p->dailyLog)
            ->map(fn($p) => [
                'date'                => optional($p->completed_at)->toDateString() ?? $p->updated_at->toDateString(),
                'milestone_title'     => $p->milestone->title ?? 'Unknown',
                'pain_level'          => $p->dailyLog->pain_level,
                'mobility_score'      => $p->dailyLog->mobility_score,
                'energy_level'        => $p->dailyLog->energy_level,
                'exercise_completion' => $p->dailyLog->exercise_completion,
                'mood'                => $p->dailyLog->mood,
                'difficulties'        => $p->dailyLog->difficulties,
                'improvements'        => $p->dailyLog->improvements,
                'status'              => $p->status,
                'doctor_notes'        => $p->doctor_notes,
            ])
            ->sortByDesc('date')
            ->values();

        // Build chart data
        $chartData = $patient->progress
            ->filter(fn($p) => $p->dailyLog)
            ->sortBy(fn($p) => $p->completed_at)
            ->map(fn($p) => [
                'date'     => optional($p->completed_at)->format('M d') ?? $p->updated_at->format('M d'),
                'pain'     => (int) $p->dailyLog->pain_level,
                'mobility' => $this->mobilityToNumeric($p->dailyLog->mobility_score),
                'energy'   => (int) $p->dailyLog->energy_level,
            ])
            ->values();

        // Milestone map
        $milestones = $patient->program?->milestones->sortBy('due_day')->map(function ($ms) use ($patient) {
            $progress = $patient->progress->firstWhere('milestone_id', $ms->id);
            return [
                'id'           => $ms->id,
                'title'        => $ms->title,
                'description'  => $ms->description,
                'due_day'      => $ms->due_day,
                'difficulty'   => $ms->difficulty,
                'duration'     => $ms->duration_minutes,
                'instructions' => $ms->exercise_instructions,
                'status'       => $progress?->status ?? 'LOCKED',
                'completed_at' => $progress?->completed_at?->toDateString(),
                'doctor_notes' => $progress?->doctor_notes,
                'progress_id'  => $progress?->id,
                'patient_notes'=> $progress?->notes,
                'log'          => $progress?->dailyLog ? [
                    'pain'     => $progress->dailyLog->pain_level,
                    'mobility' => $progress->dailyLog->mobility_score,
                    'energy'   => $progress->dailyLog->energy_level,
                    'mood'     => $progress->dailyLog->mood,
                ] : null,
            ];
        })->values() ?? collect();

        return response()->json([
            'patient'    => $summary,
            'logs'       => $logs,
            'charts'     => $chartData,
            'milestones' => $milestones,
            'appointments' => $patient->appointments->sortBy('slot_at')->values(),
        ]);
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────

    private function buildPatientSummary(Patient $patient): array
    {
        $totalMilestones    = $patient->program?->milestones->count() ?? 0;
        $completedMilestones= $patient->progress->where('status', 'Completed')->count();
        $completionPercent  = $totalMilestones > 0 ? round(($completedMilestones / $totalMilestones) * 100) : 0;

        // Adherence: % of days since enrollment that have a completed milestone
        $enrolledAt  = $patient->enrolled_at ?? $patient->created_at;
        $daysSince   = max(1, Carbon::now()->startOfDay()->diffInDays($enrolledAt->startOfDay()) + 1);
        $adherence   = min(100, round(($completedMilestones / $daysSince) * 100));

        // Streak
        $streak = $patient->calculateStreak();

        // Latest daily log for pain indicator
        $latestLog = $patient->progress
            ->filter(fn($p) => $p->dailyLog)
            ->sortByDesc(fn($p) => $p->completed_at)
            ->first()?->dailyLog;

        $avgPain = $patient->progress
            ->filter(fn($p) => $p->dailyLog && $p->dailyLog->pain_level)
            ->avg(fn($p) => (int) $p->dailyLog->pain_level) ?? 0;

        // Smart status label
        $status = $this->computeStatus($completionPercent, $adherence, $avgPain, $patient);

        // Alerts
        $alerts = $this->computeAlerts($patient, $adherence, $avgPain, $streak);

        // Next appointment
        $nextAppointment = $patient->appointments
            ->where('slot_at', '>', now())
            ->whereIn('status', ['confirmed', 'pending'])
            ->sortBy('slot_at')
            ->first();

        // Current day in program
        $currentDay = $enrolledAt ? (int) Carbon::now()->startOfDay()->diffInDays($enrolledAt->startOfDay()) + 1 : 1;

        return [
            'id'                  => $patient->id,
            'name'                => $patient->user->name,
            'email'               => $patient->user->email,
            'program_name'        => $patient->program?->name ?? 'No Program',
            'program_duration'    => $patient->program?->duration_days ?? 0,
            'enrolled_at'         => $patient->enrolled_at?->toDateString(),
            'current_day'         => min($currentDay, $patient->program?->duration_days ?? $currentDay),
            'total_milestones'    => $totalMilestones,
            'completed_milestones'=> $completedMilestones,
            'completion_percent'  => $completionPercent,
            'adherence_score'     => $adherence,
            'streak'              => $streak,
            'avg_pain'            => round($avgPain, 1),
            'latest_pain'         => $latestLog ? (int) $latestLog->pain_level : null,
            'latest_mobility'     => $latestLog ? $latestLog->mobility_score : null,
            'latest_energy'       => $latestLog ? (int) $latestLog->energy_level : null,
            'status'              => $status,
            'alerts'              => $alerts,
            'next_appointment'    => $nextAppointment ? [
                'slot_at' => $nextAppointment->slot_at,
                'status'  => $nextAppointment->status,
            ] : null,
        ];
    }

    private function computeStatus(int $completion, int $adherence, float $avgPain, Patient $patient): string
    {
        $lastActivity = $patient->progress
            ->filter(fn($p) => $p->status === 'Completed')
            ->max('completed_at');

        $daysSinceActivity = $lastActivity ? Carbon::now()->diffInDays($lastActivity) : 999;

        if ($avgPain >= 7) return 'High Pain';
        if ($adherence < 30 || $daysSinceActivity > 3) return 'Needs Attention';
        if ($completion >= 80) return 'Excellent Progress';
        if ($adherence >= 70 && $avgPain < 5) return 'Improving';
        return 'Stable';
    }

    private function computeAlerts(Patient $patient, int $adherence, float $avgPain, int $streak): array
    {
        $alerts = [];

        if ($streak === 0) {
            $alerts[] = 'No activity logged recently';
        } elseif ($streak < 2) {
            $alerts[] = 'Streak dropped — missed recent sessions';
        }

        if ($avgPain >= 6) {
            $alerts[] = 'Pain levels elevated (avg ' . round($avgPain, 1) . '/10)';
        }

        if ($adherence < 30) {
            $alerts[] = 'Low adherence: ' . $adherence . '% consistency';
        }

        $missedCount = $patient->progress->where('status', 'Missed')->count();
        if ($missedCount > 0) {
            $alerts[] = "{$missedCount} milestone(s) marked as missed";
        }

        return $alerts;
    }

    private function mobilityToNumeric(?string $score): int
    {
        $map = [
            'Very Stiff'    => 20,
            'Stiff'         => 35,
            'Limited'       => 50,
            'Moderate'      => 65,
            'Good'          => 80,
            'Very Good'     => 90,
            'Full Mobility' => 100,
        ];
        return $map[$score] ?? 50;
    }
}
