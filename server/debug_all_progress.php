<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Patient;
use App\Models\PatientProgress;

$email = 'aggarwalkamakshi0@gmail.com';
$user = \App\Models\User::where('email', $email)->first();
$patient = $user->patient;

echo "All Progress for Patient " . $patient->id . ":\n";
$allProgress = PatientProgress::where('patient_id', $patient->id)->get();
foreach ($allProgress as $p) {
    echo " - MS ID: " . $p->milestone_id . " Status: " . $p->status . " at " . $p->completed_at . "\n";
}

$program = $patient->program;
echo "\nCurrent Program: " . $program->name . "\n";
echo "Current Program MS IDs: " . implode(', ', $program->milestones->pluck('id')->toArray()) . "\n";
