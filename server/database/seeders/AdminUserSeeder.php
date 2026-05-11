<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@recoveriq.com'],
            [
                'name' => 'Admin',
                'password' => 'recoveriq123',
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        $this->command->info('✅ Admin user created: admin@recoveriq.com / recoveriq123');
    }
}
