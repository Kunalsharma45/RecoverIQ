<?php

namespace Database\Seeders;

use App\Models\ProgramMilestone;
use App\Models\RehabProgram;
use Illuminate\Database\Seeder;

class RehabProgramSeeder extends Seeder
{
    public function run(): void
    {
        $programs = [
            [
                'name'          => 'Quick Recovery (15-Day)',
                'duration_days' => 15,
                'description'   => 'Intensive short-term program for minor injuries and post-procedure recovery.',
                'milestones'    => [
                    ['title' => 'Initial Assessment & Baseline', 'description' => 'Complete intake assessment and document baseline mobility.', 'due_day' => 1],
                    ['title' => 'Pain Management Protocol', 'description' => 'Begin prescribed pain management exercises and ice/heat therapy.', 'due_day' => 3],
                    ['title' => 'Range of Motion Exercises', 'description' => 'Start gentle range-of-motion exercises twice daily.', 'due_day' => 5],
                    ['title' => 'Strength Building Phase 1', 'description' => 'Introduce light resistance exercises.', 'due_day' => 8],
                    ['title' => 'Functional Movement Training', 'description' => 'Practice daily-life functional movements.', 'due_day' => 11],
                    ['title' => 'Final Assessment & Discharge Planning', 'description' => 'Complete final evaluation and set maintenance plan.', 'due_day' => 15],
                ],
            ],
            [
                'name'          => 'Standard Recovery (30-Day)',
                'duration_days' => 30,
                'description'   => 'Balanced program for moderate injuries with progressive strength and mobility goals.',
                'milestones'    => [
                    ['title' => 'Initial Assessment & Goal Setting', 'description' => 'Evaluate condition and set individualized recovery goals.', 'due_day' => 1],
                    ['title' => 'Acute Phase Management', 'description' => 'Manage acute symptoms with rest, ice, compression, elevation.', 'due_day' => 3],
                    ['title' => 'Gentle Mobility Work', 'description' => 'Begin passive and active-assisted range-of-motion exercises.', 'due_day' => 7],
                    ['title' => 'Strength Phase 1 — Isometric', 'description' => 'Start isometric strengthening exercises.', 'due_day' => 10],
                    ['title' => 'Strength Phase 2 — Isotonic', 'description' => 'Progress to isotonic resistance exercises.', 'due_day' => 15],
                    ['title' => 'Balance & Proprioception Training', 'description' => 'Introduce balance and coordination drills.', 'due_day' => 20],
                    ['title' => 'Functional Activity Training', 'description' => 'Practice work/sport-specific functional movements.', 'due_day' => 25],
                    ['title' => 'Final Assessment & Return-to-Activity Plan', 'description' => 'Comprehensive final evaluation and long-term maintenance plan.', 'due_day' => 30],
                ],
            ],
            [
                'name'          => 'Comprehensive Recovery (60-Day)',
                'duration_days' => 60,
                'description'   => 'Thorough program for complex injuries, surgeries, or neurological conditions.',
                'milestones'    => [
                    ['title' => 'Comprehensive Assessment', 'description' => 'Full functional and neurological assessment.', 'due_day' => 1],
                    ['title' => 'Pain & Swelling Management', 'description' => 'Establish pain control and reduce inflammation.', 'due_day' => 5],
                    ['title' => 'Passive Mobility — Phase 1', 'description' => 'Passive range-of-motion work by therapist.', 'due_day' => 10],
                    ['title' => 'Active-Assisted Mobility', 'description' => 'Begin active-assisted exercises with support.', 'due_day' => 15],
                    ['title' => 'Independent Mobility', 'description' => 'Patient performs mobility exercises independently.', 'due_day' => 20],
                    ['title' => 'Strength Phase 1 — Foundation', 'description' => 'Build muscular endurance and foundational strength.', 'due_day' => 25],
                    ['title' => 'Strength Phase 2 — Progressive Loading', 'description' => 'Increase resistance loads progressively.', 'due_day' => 32],
                    ['title' => 'Cardiovascular Conditioning', 'description' => 'Begin low-impact cardiovascular exercise.', 'due_day' => 38],
                    ['title' => 'Balance & Neuromuscular Control', 'description' => 'Advanced proprioception and neuromuscular training.', 'due_day' => 44],
                    ['title' => 'Sport/Work-Specific Training', 'description' => 'Activity-specific functional training and drills.', 'due_day' => 50],
                    ['title' => 'Performance Benchmarking', 'description' => 'Compare current performance to initial baseline.', 'due_day' => 55],
                    ['title' => 'Final Assessment & Long-Term Plan', 'description' => 'Comprehensive discharge assessment and 6-month maintenance plan.', 'due_day' => 60],
                ],
            ],
        ];

        foreach ($programs as $programData) {
            $milestones = $programData['milestones'];
            unset($programData['milestones']);

            $program = RehabProgram::firstOrCreate(
                ['name' => $programData['name']],
                $programData
            );

            foreach ($milestones as $ms) {
                ProgramMilestone::firstOrCreate(
                    ['program_id' => $program->id, 'due_day' => $ms['due_day']],
                    $ms
                );
            }
        }

        $this->command->info('✅ 3 rehab programs seeded (15/30/60 day) with milestones.');
    }
}
