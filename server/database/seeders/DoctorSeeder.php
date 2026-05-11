<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        $doctors = [
            [
                'name'           => 'Dr. Sarah Mitchell',
                'email'          => 'sarah.mitchell@recoveriq.com',
                'specialization' => 'Orthopedic Rehabilitation',
                'bio'            => 'Specialist in post-surgical orthopedic recovery with 12 years of experience.',
            ],
            [
                'name'           => 'Dr. James Okonkwo',
                'email'          => 'james.okonkwo@recoveriq.com',
                'specialization' => 'Neurological Rehabilitation',
                'bio'            => 'Expert in stroke recovery and neurological motor function restoration.',
            ],
        ];

        foreach ($doctors as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name'      => $data['name'],
                    'password'  => 'password',
                    'role'      => 'doctor',
                    'is_active' => true,
                ]
            );

            Doctor::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'specialization' => $data['specialization'],
                    'bio'            => $data['bio'],
                ]
            );
        }

        $this->command->info('✅ 2 doctor profiles created.');
    }
}
