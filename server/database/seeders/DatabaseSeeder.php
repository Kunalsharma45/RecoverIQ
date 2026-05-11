<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,    // 1. Admin account
            RehabProgramSeeder::class, // 2. Programs + milestones (doctors need these)
            DoctorSeeder::class,       // 3. Doctor users
            PatientSeeder::class,      // 4. Patients + progress + appointments
        ]);

        $this->command->info('');
        $this->command->info('=== RecoverIQ Seed Complete ===');
        $this->command->info('Admin:   admin@recoveriq.com  / password');
        $this->command->info('Doctor1: sarah.mitchell@recoveriq.com / password');
        $this->command->info('Doctor2: james.okonkwo@recoveriq.com / password');
        $this->command->info('Patient1: alice.johnson@example.com / password');
        $this->command->info('Patient2: robert.chen@example.com / password');
    }
}
