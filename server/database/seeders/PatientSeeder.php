<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\PatientProgress;
use App\Models\ProgramMilestone;
use App\Models\RehabProgram;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        $doctor1 = Doctor::whereHas('user', fn ($q) => $q->where('email', 'sarah.mitchell@recoveriq.com'))->first();
        $doctor2 = Doctor::whereHas('user', fn ($q) => $q->where('email', 'james.okonkwo@recoveriq.com'))->first();

        $program30 = RehabProgram::where('duration_days', 30)->first();
        $program60 = RehabProgram::where('duration_days', 60)->first();

        // Patient 1 — assigned to Dr. Mitchell, 30-day program
        $user1 = User::firstOrCreate(
            ['email' => 'alice.johnson@example.com'],
            [
                'name'      => 'Alice Johnson',
                'password'  => 'password',
                'role'      => 'patient',
                'is_active' => true,
            ]
        );

        $patient1 = Patient::firstOrCreate(
            ['user_id' => $user1->id],
            [
                'doctor_id'   => $doctor1->id,
                'program_id'  => $program30->id,
                'enrolled_at' => Carbon::now()->subDays(15),
            ]
        );

        // Seed some progress for patient 1 (first 4 milestones completed)
        $milestones1 = $program30->milestones()->orderBy('due_day')->take(4)->get();
        foreach ($milestones1 as $i => $ms) {
            PatientProgress::firstOrCreate(
                ['patient_id' => $patient1->id, 'milestone_id' => $ms->id],
                [
                    'completed_at' => Carbon::now()->subDays(14 - ($i * 3)),
                    'notes'        => "Completed on schedule. Good progress noted.",
                ]
            );
        }

        // Add an appointment for patient 1
        Appointment::firstOrCreate(
            ['patient_id' => $patient1->id, 'slot_at' => Carbon::now()->addDays(3)->setHour(10)->setMinute(0)],
            [
                'doctor_id' => $doctor1->id,
                'status'    => 'confirmed',
                'notes'     => 'Follow-up session to review mid-program progress.',
            ]
        );

        // Patient 2 — assigned to Dr. Okonkwo, 60-day program
        $user2 = User::firstOrCreate(
            ['email' => 'robert.chen@example.com'],
            [
                'name'      => 'Robert Chen',
                'password'  => 'password',
                'role'      => 'patient',
                'is_active' => true,
            ]
        );

        $patient2 = Patient::firstOrCreate(
            ['user_id' => $user2->id],
            [
                'doctor_id'   => $doctor2->id,
                'program_id'  => $program60->id,
                'enrolled_at' => Carbon::now()->subDays(30),
            ]
        );

        // Seed progress for patient 2 (first 6 milestones completed)
        $milestones2 = $program60->milestones()->orderBy('due_day')->take(6)->get();
        foreach ($milestones2 as $i => $ms) {
            PatientProgress::firstOrCreate(
                ['patient_id' => $patient2->id, 'milestone_id' => $ms->id],
                [
                    'completed_at' => Carbon::now()->subDays(29 - ($i * 4)),
                    'notes'        => "Milestone achieved. Patient showing strong recovery signals.",
                ]
            );
        }

        // Add a public/guest appointment
        Appointment::firstOrCreate(
            ['booked_by_email' => 'guest@example.com', 'slot_at' => Carbon::now()->addDays(5)->setHour(14)->setMinute(0)],
            [
                'doctor_id'       => $doctor1->id,
                'patient_id'      => null,
                'booked_by_name'  => 'Guest User',
                'booked_by_email' => 'guest@example.com',
                'status'          => 'pending',
                'notes'           => 'Initial consultation request.',
            ]
        );

        $this->command->info('✅ 2 patient profiles created with progress data and appointments.');
    }
}
