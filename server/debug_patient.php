<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Patient;
use App\Models\PatientProgress;
use Carbon\Carbon;

$email = 'aggarwalkamakshi0@gmail.com';
$user = \App\Models\User::where('email', $email)->first();

if (!$user || !$user->patient) {
    echo "Patient not found\n";
    exit;
}

$patient = $user->patient;
echo "Patient ID: " . $patient->id . "\n";
echo "Enrolled At: " . $patient->enrolled_at . "\n";
echo "Current Program ID: " . $patient->program_id . "\n";

$program = $patient->program;
if ($program) {
    echo "Program: " . $program->name . " (" . $program->duration_days . " days)\n";
    $msIds = $program->milestones->pluck('id')->toArray();
    echo "Program Milestone IDs: " . implode(', ', $msIds) . "\n";
    
    $progress = PatientProgress::where('patient_id', $patient->id)
        ->whereIn('milestone_id', $msIds)
        ->get();
    
    echo "Completed Milestones for this program: " . $progress->count() . "\n";
    foreach ($progress as $p) {
        echo " - MS ID: " . $p->milestone_id . " Status: " . $p->status . " at " . $p->completed_at . "\n";
    }
}

$today = Carbon::today();
$startDate = Carbon::parse($patient->enrolled_at)->startOfDay();
$diff = $today->diffInDays($startDate, false);
echo "Today: " . $today->toDateString() . "\n";
echo "Start Date: " . $startDate->toDateString() . "\n";
echo "Diff: " . $diff . "\n";
echo "Current Day Calculation: " . (abs($diff) + 1) . "\n";
