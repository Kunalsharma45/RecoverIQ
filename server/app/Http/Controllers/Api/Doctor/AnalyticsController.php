<?php

namespace App\Http\Controllers\Api\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\PatientProgress;
use App\Models\PatientDailyLog;
use App\Models\RehabProgram;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $doctor = $user->doctor;

        if (!$doctor) {
            return response()->json(['error' => 'Doctor record not found'], 404);
        }

        $days = $request->query('days', 30);
        $startDate = Carbon::now()->subDays($days);

        // 1. Overview Metrics (Scoped to doctor)
        $totalPatients = $doctor->patients()->count();
        $activePatients = $doctor->patients()->whereHas('program')->count();
        
        // Sum total milestones across all doctor's active programs
        $totalAssignedMilestones = $doctor->patients()->whereHas('program')->get()->sum(function($p) {
            return $p->program ? $p->program->milestones()->count() : 0;
        });
        
        // Completion Rate
        $completionRate = $totalAssignedMilestones > 0 
            ? round((PatientProgress::whereHas('patient', fn($q) => $q->where('doctor_id', $doctor->id))
                ->where('status', 'Completed')->count() / $totalAssignedMilestones) * 100, 1)
            : 0;

        // Avg Pain Reduction
        $avgPainReduction = $this->calculateAvgPainReduction($doctor);

        // 2. Recovery Progress Trend
        $recoveryTrend = PatientProgress::whereHas('patient', fn($q) => $q->where('doctor_id', $doctor->id))
            ->where('completed_at', '>=', $startDate)
            ->select(
                DB::raw('DATE(completed_at) as date'),
                DB::raw('COUNT(*) as completions')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // 3. Pain Reduction Analytics
        $painTrend = PatientDailyLog::whereHas('patient', fn($q) => $q->where('doctor_id', $doctor->id))
            ->where('created_at', '>=', $startDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('AVG(pain_level) as avg_pain')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // 4. Adherence Analytics
        $adherenceData = PatientDailyLog::whereHas('patient', fn($q) => $q->where('doctor_id', $doctor->id))
            ->where('created_at', '>=', $startDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('AVG(exercise_completion) as avg_completion')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // 5. Program Performance (Scoped to doctor's patients)
        $programPerformance = RehabProgram::withCount(['patients' => function($q) use ($doctor) {
                $q->where('doctor_id', $doctor->id);
            }])
            ->get()
            ->map(function($program) use ($doctor) {
                $milestoneIds = $program->milestones->pluck('id');
                $totalCompleted = PatientProgress::whereIn('milestone_id', $milestoneIds)
                    ->whereHas('patient', fn($q) => $q->where('doctor_id', $doctor->id))
                    ->where('status', 'Completed')
                    ->count();
                $totalPossible = $program->patients_count * $program->milestones->count();
                
                return [
                    'name' => $program->name,
                    'patients' => $program->patients_count,
                    'completion_rate' => $totalPossible > 0 ? round(($totalCompleted / $totalPossible) * 100, 1) : 0,
                    'avg_recovery_speed' => 'Optimal',
                ];
            })
            ->filter(fn($p) => $p['patients'] > 0)
            ->values();

        // 6. Recovery Risk Analysis
        $riskPatients = $doctor->patients()->with(['user', 'program'])
            ->get()
            ->map(function($patient) {
                $lastLog = $patient->logs()->latest()->first();
                $adherence = $this->calculatePatientAdherence($patient);
                $riskScore = 0;
                
                if ($adherence < 50) $riskScore += 40;
                if ($lastLog && $lastLog->pain_level > 7) $riskScore += 30;
                if (!$lastLog || $lastLog->created_at->lt(Carbon::now()->subDays(3))) $riskScore += 30;

                return [
                    'id' => $patient->id,
                    'name' => $patient->user->name,
                    'risk_score' => $riskScore,
                    'adherence' => $adherence,
                    'last_pain' => $lastLog ? $lastLog->pain_level : 'N/A',
                    'status' => $riskScore > 60 ? 'High Risk' : ($riskScore > 30 ? 'Moderate' : 'Stable'),
                ];
            })
            ->filter(fn($p) => $p['risk_score'] > 30)
            ->sortByDesc('risk_score')
            ->values();

        // 7. Top Improving Patients
        $topPatients = $doctor->patients()->with(['user', 'program'])
            ->get()
            ->map(function($patient) {
                return [
                    'id' => $patient->id,
                    'name' => $patient->user->name,
                    'progress' => $this->calculatePatientProgress($patient),
                    'adherence' => $this->calculatePatientAdherence($patient),
                ];
            })
            ->sortByDesc('progress')
            ->take(5)
            ->values();

        // 8. Appointment Stats
        $appointmentStats = [
            'completed' => $doctor->appointments()->where('status', 'completed')->count(),
            'upcoming' => $doctor->appointments()->where('status', 'confirmed')->where('slot_at', '>=', now())->count(),
            'missed' => $doctor->appointments()->where('status', 'cancelled')->count(),
        ];

        return response()->json([
            'stats' => [
                'total_patients' => $totalPatients,
                'active_patients' => $activePatients,
                'avg_adherence' => round(PatientDailyLog::avg('exercise_completion') ?? 0, 1),
                'completion_rate' => $completionRate,
                'avg_pain_reduction' => $avgPainReduction,
                'weekly_improvement' => '+12%', // Mock trend
            ],
            'charts' => [
                'recovery' => $recoveryTrend,
                'pain' => $painTrend,
                'adherence' => $adherenceData,
                'programs' => $programPerformance,
            ],
            'risk_patients' => $riskPatients,
            'top_patients' => $topPatients,
            'appointment_stats' => $appointmentStats,
        ]);
    }

    private function calculateAvgPainReduction($doctor)
    {
        // Simple logic: avg pain level 30 days ago vs today (Scoped to doctor)
        $oldAvg = PatientDailyLog::whereHas('patient', fn($q) => $q->where('doctor_id', $doctor->id))
            ->where('created_at', '<=', Carbon::now()->subDays(20))->avg('pain_level') ?: 0;
            
        $newAvg = PatientDailyLog::whereHas('patient', fn($q) => $q->where('doctor_id', $doctor->id))
            ->where('created_at', '>=', Carbon::now()->subDays(7))->avg('pain_level') ?: 0;
        
        return round($oldAvg - $newAvg, 1);
    }

    private function calculatePatientAdherence($patient)
    {
        $totalDays = $patient->enrolled_at ? $patient->enrolled_at->diffInDays(now()) + 1 : 1;
        $completedLogs = $patient->logs()->count();
        return round(($completedLogs / max(1, $totalDays)) * 100, 1);
    }

    private function calculatePatientProgress($patient)
    {
        if (!$patient->program) return 0;
        $totalMilestones = $patient->program->milestones()->count();
        $completed = $patient->progress()->where('status', 'Completed')->count();
        return $totalMilestones > 0 ? round(($completed / $totalMilestones) * 100, 1) : 0;
    }
}
