<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\PatientProgress;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * GET /api/admin/reports
     * Recovery analytics summary.
     */
    public function index()
    {
        $totalUsers        = User::count();
        $totalDoctors      = User::where('role', 'doctor')->count();
        $totalPatients     = User::where('role', 'patient')->count();
        $totalAppointments = Appointment::count();

        $appointmentsByStatus = Appointment::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $completionRate = 0;
        $totalProgress  = PatientProgress::count();
        $totalMilestones = Patient::with('program.milestones')
            ->get()
            ->sum(fn ($p) => $p->program?->milestones->count() ?? 0);

        if ($totalMilestones > 0) {
            $completionRate = round(($totalProgress / $totalMilestones) * 100, 1);
        }

        $recentAppointments = Appointment::with(['doctor.user', 'patient.user'])
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'total_users'          => $totalUsers,
            'total_doctors'        => $totalDoctors,
            'total_patients'       => $totalPatients,
            'total_appointments'   => $totalAppointments,
            'appointments_by_status' => $appointmentsByStatus,
            'milestone_completion_rate' => $completionRate . '%',
            'recent_appointments'  => $recentAppointments,
        ]);
    }
}
