<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PatientDailyLog;
use App\Models\PatientProgress;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $patient = $request->user()->patient()
            ->with(['program', 'progress.milestone', 'progress.dailyLog'])
            ->firstOrFail();

        // 1. Summary Metrics
        $totalMilestones = $patient->program?->milestones->count() ?? 0;
        $completedMilestones = $patient->progress()->where('status', 'Completed')->count();
        $completionPercent = $totalMilestones > 0 ? round(($completedMilestones / $totalMilestones) * 100) : 0;
        
        $streak = $patient->calculateStreak();
        
        $mobilityMap = [
            'Very Stiff' => 20,
            'Limited' => 40,
            'Moderate' => 60,
            'Improved' => 80,
            'Fully Comfortable' => 100
        ];

        $logs = PatientDailyLog::where('patient_id', $patient->id)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function($log) use ($mobilityMap) {
                // Attach numeric score for calculations
                $log->mobility_numeric = $mobilityMap[$log->mobility_score] ?? 0;
                return $log;
            });

        $avgPain = $logs->avg('pain_level') ?? 0;
        $avgMobility = $logs->avg('mobility_numeric') ?? 0;
        $avgEnergy = (int) ($logs->avg('energy_level') * 20) ?? 0; // Scale 1-5 to 0-100

        // 2. Chart Data (Daily Logs)
        $chartData = $logs->map(function($log) {
            return [
                'date' => $log->created_at->format('M d'),
                'pain' => (int) $log->pain_level,
                'mobility' => (int) $log->mobility_numeric,
                'energy' => (int) ($log->energy_level * 20),
                'mood' => $log->mood,
                'exercise' => (int) $log->exercise_completion,
            ];
        });

        // 3. Weekly Comparisons
        $weeklyData = $logs->groupBy(function($log) {
            return $log->created_at->startOfWeek()->format('W');
        })->map(function($weekLogs, $weekNum) {
            return [
                'week' => "Week " . $weekNum,
                'avg_pain' => round($weekLogs->avg('pain_level'), 1),
                'avg_mobility' => round($weekLogs->avg('mobility_numeric'), 1),
                'completion' => round($weekLogs->avg('exercise_completion')),
            ];
        })->values();

        // 4. Timeline Feed
        $timelineFeed = collect();
        
        // Add milestone completions
        foreach ($patient->progress as $progress) {
            if ($progress->status === 'Completed') {
                $timelineFeed->push([
                    'type' => 'milestone',
                    'title' => "Milestone Completed",
                    'description' => "Day {$progress->milestone->due_day}: {$progress->milestone->title}",
                    'date' => $progress->completed_at->format('M d, Y'),
                    'timestamp' => $progress->completed_at,
                    'icon' => 'Flag',
                    'color' => 'green'
                ]);
            }
        }

        // Add daily logs as health updates
        foreach ($logs as $log) {
            $timelineFeed->push([
                'type' => 'log',
                'title' => "Health Check-in",
                'description' => "Pain: {$log->pain_level}/10 | Mobility: {$log->mobility_score}%",
                'date' => $log->created_at->format('M d, Y'),
                'timestamp' => $log->created_at,
                'icon' => 'HeartPulse',
                'color' => 'blue'
            ]);
        }

        $timelineFeed = $timelineFeed->sortByDesc('timestamp')->values();

        // 5. Dynamic Insights
        $insights = [];
        if ($logs->count() >= 1) {
            $insights[] = "Your recovery program is active. Keep completing milestones to see physical trends.";
            
            if ($logs->count() >= 2) {
                $firstPain = $logs->first()->pain_level;
                $lastPain = $logs->last()->pain_level;
                if ($lastPain < $firstPain) {
                    $reduction = round((($firstPain - $lastPain) / ($firstPain ?: 1)) * 100);
                    $insights[] = "Pain has reduced by {$reduction}% since you started.";
                }
                
                $firstMobility = $logs->first()->mobility_numeric;
                $lastMobility = $logs->last()->mobility_numeric;
                if ($lastMobility > $firstMobility) {
                    $improvement = $lastMobility - $firstMobility;
                    $insights[] = "Your mobility score improved by {$improvement} points.";
                }
            }
        }

        if ($streak >= 3) {
            $insights[] = "Great consistency! You've maintained a {$streak}-day recovery streak.";
        } else if ($logs->count() > 0 && $logs->last()->exercise_completion < 50) {
            $insights[] = "Try to focus on your exercises today to stay on track.";
        }

        return response()->json([
            'summary' => [
                'completion_percent' => $completionPercent,
                'streak' => $streak,
                'total_completed' => $completedMilestones,
                'total_milestones' => $totalMilestones,
                'avg_pain' => round($avgPain, 1),
                'avg_mobility' => round($avgMobility, 1),
                'avg_energy' => round($avgEnergy, 1),
            ],
            'charts' => [
                'daily' => $chartData,
                'weekly' => $weeklyData,
            ],
            'timeline' => $timelineFeed,
            'insights' => $insights,
            'recommendations' => [
                ['title' => 'Stay Hydrated', 'description' => 'Water intake supports muscle tissue repair.', 'icon' => 'Droplets'],
                ['title' => 'Gentle Stretching', 'description' => 'Focus on mobility exercises before bed.', 'icon' => 'StretchHorizontal'],
                ['title' => 'Rest Well', 'description' => 'Ensure 8 hours of sleep for cellular recovery.', 'icon' => 'Moon'],
            ]
        ]);
    }
}
