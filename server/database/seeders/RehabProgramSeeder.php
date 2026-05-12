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
                    [
                        'title' => 'Initial Recovery Assessment & Mobility Screening',
                        'description' => 'Complete a full rehabilitation assessment including pain level, posture, joint mobility, and movement limitations.',
                        'due_day' => 1,
                        'duration_minutes' => 20,
                        'difficulty' => 'Easy',
                        'exercise_instructions' => 'Practice deep breathing and gentle neck, shoulder, and ankle mobility exercises. Move slowly and avoid sudden strain.'
                    ],
                    [
                        'title' => 'Pain Reduction & Relaxation Therapy',
                        'description' => 'Focus on reducing stiffness and calming inflamed muscles through controlled therapeutic movement.',
                        'due_day' => 2,
                        'duration_minutes' => 20,
                        'difficulty' => 'Easy',
                        'exercise_instructions' => 'Apply guided stretching with ice/heat therapy. Perform slow seated stretches and maintain steady breathing.'
                    ],
                    [
                        'title' => 'Assisted Joint Mobility Activation',
                        'description' => 'Begin controlled assisted range-of-motion exercises to restore flexibility safely.',
                        'due_day' => 3,
                        'duration_minutes' => 25,
                        'difficulty' => 'Easy',
                        'exercise_instructions' => 'Perform assisted arm raises, knee bends, and hip rotations with controlled movement. Stop if sharp pain occurs.'
                    ],
                    [
                        'title' => 'Flexibility & Muscle Release Session',
                        'description' => 'Improve muscle flexibility and reduce tightness around affected joints.',
                        'due_day' => 4,
                        'duration_minutes' => 25,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete full-body therapeutic stretches focusing on hamstrings, lower back, shoulders, and calves. Hold each stretch for 20 seconds.'
                    ],
                    [
                        'title' => 'Core Stability & Posture Training',
                        'description' => 'Activate core muscles to improve posture, balance, and rehabilitation stability.',
                        'due_day' => 5,
                        'duration_minutes' => 30,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice pelvic tilts, seated core holds, and posture correction drills. Keep your spine aligned throughout exercises.'
                    ],
                    [
                        'title' => 'Walking Mechanics & Balance Control',
                        'description' => 'Improve walking posture, coordination, and controlled movement patterns.',
                        'due_day' => 6,
                        'duration_minutes' => 30,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform slow walking drills, heel-to-toe balance practice, and controlled stepping exercises on flat ground.'
                    ],
                    [
                        'title' => 'Mid-Recovery Progress Evaluation',
                        'description' => 'Review pain reduction, flexibility improvement, and mobility progress.',
                        'due_day' => 7,
                        'duration_minutes' => 30,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete combined stretching and movement exercises. Record pain levels and movement comfort after the session.'
                    ],
                    [
                        'title' => 'Resistance Band Strength Activation',
                        'description' => 'Introduce light resistance training to safely strengthen weakened muscles.',
                        'due_day' => 8,
                        'duration_minutes' => 35,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Use light resistance bands for arm pulls, seated leg extensions, and shoulder activation exercises.'
                    ],
                    [
                        'title' => 'Balance & Coordination Recovery Drills',
                        'description' => 'Enhance coordination and movement confidence using stability exercises.',
                        'due_day' => 9,
                        'duration_minutes' => 35,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice single-leg standing support drills, controlled side stepping, and balance holds near a stable surface.'
                    ],
                    [
                        'title' => 'Isometric Strength Rehabilitation',
                        'description' => 'Build muscle strength without excessive joint movement.',
                        'due_day' => 10,
                        'duration_minutes' => 35,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform wall sits, static leg presses, and gentle muscle contraction holds for 10–15 seconds each.'
                    ],
                    [
                        'title' => 'Endurance & Controlled Conditioning',
                        'description' => 'Improve stamina and movement endurance through low-impact rehabilitation activities.',
                        'due_day' => 11,
                        'duration_minutes' => 40,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete slow treadmill walking or stationary cycling while maintaining controlled breathing and posture.'
                    ],
                    [
                        'title' => 'Functional Daily Movement Training',
                        'description' => 'Rebuild confidence performing normal daily movements safely and efficiently.',
                        'due_day' => 12,
                        'duration_minutes' => 40,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice sit-to-stand transitions, stair stepping, reaching exercises, and light functional mobility drills.'
                    ],
                    [
                        'title' => 'Dynamic Strength & Mobility Integration',
                        'description' => 'Combine mobility and strengthening exercises into coordinated recovery movement.',
                        'due_day' => 13,
                        'duration_minutes' => 45,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform controlled squats, resistance-based arm exercises, and coordinated movement circuits at moderate intensity.'
                    ],
                    [
                        'title' => 'Advanced Recovery Assessment',
                        'description' => 'Evaluate overall recovery improvements in flexibility, balance, strength, and endurance.',
                        'due_day' => 14,
                        'duration_minutes' => 45,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete full recovery mobility circuit and compare current movement quality with Day 1 assessment.'
                    ],
                    [
                        'title' => 'Return-to-Activity & Maintenance Planning',
                        'description' => 'Prepare for safe transition into regular activity with long-term recovery strategies.',
                        'due_day' => 15,
                        'duration_minutes' => 45,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform full-body rehabilitation routine followed by guided recovery planning, posture training, and injury prevention exercises.'
                    ],
                ],
            ],
            [
                'name'          => 'Standard Recovery (30-Day)',
                'duration_days' => 30,
                'description'   => 'Balanced program for moderate injuries with progressive strength and mobility goals.',
                'milestones'    => [
                    [
                        'title' => 'Initial Clinical Assessment & Recovery Planning',
                        'description' => 'Perform a complete rehabilitation assessment including posture, pain level, mobility, balance, and strength evaluation.',
                        'due_day' => 1,
                        'duration_minutes' => 20,
                        'difficulty' => 'Easy',
                        'exercise_instructions' => 'Practice deep breathing, posture correction, and gentle neck, shoulder, and ankle mobility exercises.'
                    ],
                    [
                        'title' => 'Pain & Inflammation Management',
                        'description' => 'Reduce swelling, stiffness, and discomfort through controlled therapeutic recovery techniques.',
                        'due_day' => 2,
                        'duration_minutes' => 20,
                        'difficulty' => 'Easy',
                        'exercise_instructions' => 'Apply guided stretching with cold/heat therapy and perform slow seated flexibility movements.'
                    ],
                    [
                        'title' => 'Passive Range of Motion Training',
                        'description' => 'Begin assisted mobility exercises to restore safe joint movement and flexibility.',
                        'due_day' => 3,
                        'duration_minutes' => 25,
                        'difficulty' => 'Easy',
                        'exercise_instructions' => 'Perform controlled arm raises, assisted knee bends, hip circles, and gentle spinal mobility drills.'
                    ],
                    [
                        'title' => 'Therapeutic Stretching Session',
                        'description' => 'Improve muscle flexibility and reduce tissue tightness surrounding affected areas.',
                        'due_day' => 4,
                        'duration_minutes' => 25,
                        'difficulty' => 'Easy',
                        'exercise_instructions' => 'Complete slow hamstring, calf, shoulder, and lower back stretches while maintaining proper breathing.'
                    ],
                    [
                        'title' => 'Posture & Core Stability Activation',
                        'description' => 'Strengthen posture-supporting muscles and improve movement stability.',
                        'due_day' => 5,
                        'duration_minutes' => 30,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice pelvic tilts, seated core holds, wall posture drills, and gentle abdominal activation exercises.'
                    ],
                    [
                        'title' => 'Walking Mechanics Rehabilitation',
                        'description' => 'Improve gait control, balance, and movement coordination during walking.',
                        'due_day' => 6,
                        'duration_minutes' => 30,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform heel-to-toe walking drills, controlled step training, and walking posture correction exercises.'
                    ],
                    [
                        'title' => 'Week 1 Recovery Assessment',
                        'description' => 'Evaluate flexibility, pain reduction, posture improvement, and movement confidence.',
                        'due_day' => 7,
                        'duration_minutes' => 30,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete a full-body mobility routine and reassess movement comfort compared to Day 1.'
                    ],
                    [
                        'title' => 'Resistance Band Introduction',
                        'description' => 'Introduce light resistance training to activate weakened muscles safely.',
                        'due_day' => 8,
                        'duration_minutes' => 35,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Use resistance bands for arm pulls, seated leg extensions, shoulder presses, and controlled side movements.'
                    ],
                    [
                        'title' => 'Balance & Coordination Therapy',
                        'description' => 'Enhance movement stability and improve body coordination.',
                        'due_day' => 9,
                        'duration_minutes' => 35,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice supported balance drills, side stepping, single-leg support holds, and coordination exercises.'
                    ],
                    [
                        'title' => 'Lower Body Strength Activation',
                        'description' => 'Develop lower body support and movement endurance.',
                        'due_day' => 10,
                        'duration_minutes' => 35,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform assisted squats, wall sits, calf raises, and seated leg strengthening exercises.'
                    ],
                    [
                        'title' => 'Upper Body Recovery Strengthening',
                        'description' => 'Improve upper body muscle control and rehabilitation stability.',
                        'due_day' => 11,
                        'duration_minutes' => 35,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice resistance band rows, shoulder stabilization exercises, and controlled arm strengthening drills.'
                    ],
                    [
                        'title' => 'Joint Stabilization Therapy',
                        'description' => 'Improve joint control and reduce instability during movement.',
                        'due_day' => 12,
                        'duration_minutes' => 40,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform controlled knee stabilization, ankle mobility drills, and shoulder joint strengthening exercises.'
                    ],
                    [
                        'title' => 'Functional Balance Recovery',
                        'description' => 'Enhance body control during everyday activities and directional movement.',
                        'due_day' => 13,
                        'duration_minutes' => 40,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice balance walking, directional stepping, and controlled movement transition exercises.'
                    ],
                    [
                        'title' => 'Week 2 Strength Evaluation',
                        'description' => 'Assess muscle activation, endurance progression, and balance improvements.',
                        'due_day' => 14,
                        'duration_minutes' => 40,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete combined mobility and strengthening circuit with guided progress reassessment.'
                    ],
                    [
                        'title' => 'Functional Movement Reintegration',
                        'description' => 'Begin retraining safe daily movement patterns and body coordination.',
                        'due_day' => 15,
                        'duration_minutes' => 40,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice sit-to-stand drills, reaching exercises, stair stepping, and controlled body movement routines.'
                    ],
                    [
                        'title' => 'Low-Impact Endurance Conditioning',
                        'description' => 'Improve cardiovascular endurance and recovery stamina.',
                        'due_day' => 16,
                        'duration_minutes' => 40,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform treadmill walking, stationary cycling, or light endurance movement with controlled breathing.'
                    ],
                    [
                        'title' => 'Coordination & Reaction Training',
                        'description' => 'Enhance movement timing, coordination, and body awareness.',
                        'due_day' => 17,
                        'duration_minutes' => 45,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice coordination ladders, directional stepping drills, and controlled reaction exercises.'
                    ],
                    [
                        'title' => 'Advanced Mobility Restoration',
                        'description' => 'Increase movement flexibility and joint mobility safely.',
                        'due_day' => 18,
                        'duration_minutes' => 45,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform dynamic stretching, hip mobility exercises, spinal flexibility drills, and shoulder range-of-motion work.'
                    ],
                    [
                        'title' => 'Dynamic Strength Development',
                        'description' => 'Combine movement and strength exercises to improve rehabilitation performance.',
                        'due_day' => 19,
                        'duration_minutes' => 45,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice resistance squats, controlled lunges, arm strengthening, and balance-strength circuits.'
                    ],
                    [
                        'title' => 'Controlled Resistance Progression',
                        'description' => 'Increase muscle resistance safely to improve recovery strength.',
                        'due_day' => 20,
                        'duration_minutes' => 45,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Use moderate resistance bands and controlled bodyweight exercises for full-body strengthening.'
                    ],
                    [
                        'title' => 'Week 3 Recovery Progress Assessment',
                        'description' => 'Evaluate endurance, mobility, flexibility, and strength progression.',
                        'due_day' => 21,
                        'duration_minutes' => 45,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete a guided rehabilitation circuit and compare performance improvements with previous assessments.'
                    ],
                    [
                        'title' => 'Advanced Balance & Stability Training',
                        'description' => 'Improve complex balance control and movement confidence.',
                        'due_day' => 22,
                        'duration_minutes' => 45,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform dynamic balance drills, unstable surface training, and controlled movement coordination exercises.'
                    ],
                    [
                        'title' => 'Movement Confidence Restoration',
                        'description' => 'Rebuild confidence during functional movement and physical activity.',
                        'due_day' => 23,
                        'duration_minutes' => 45,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Practice full-body movement patterns with controlled pace and posture correction.'
                    ],
                    [
                        'title' => 'Full Body Rehabilitation Circuit',
                        'description' => 'Combine flexibility, endurance, and strength into one integrated rehabilitation session.',
                        'due_day' => 24,
                        'duration_minutes' => 50,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform guided circuit training including mobility, resistance, balance, and controlled endurance exercises.'
                    ],
                    [
                        'title' => 'Functional Activity Simulation',
                        'description' => 'Practice real-life activity movement patterns and task-based rehabilitation.',
                        'due_day' => 25,
                        'duration_minutes' => 50,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform lifting simulations, directional walking drills, stair mobility, and body coordination exercises.'
                    ],
                    [
                        'title' => 'Recovery Endurance Challenge',
                        'description' => 'Improve long-duration movement stamina and physical consistency.',
                        'due_day' => 26,
                        'duration_minutes' => 50,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Complete low-impact endurance training while maintaining controlled breathing and posture.'
                    ],
                    [
                        'title' => 'Strength & Flexibility Integration',
                        'description' => 'Combine muscle strengthening with advanced flexibility rehabilitation.',
                        'due_day' => 27,
                        'duration_minutes' => 50,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform dynamic stretching, resistance circuits, and mobility-strength integration exercises.'
                    ],
                    [
                        'title' => 'Advanced Mobility Benchmarking',
                        'description' => 'Measure overall flexibility, movement quality, and rehabilitation performance.',
                        'due_day' => 28,
                        'duration_minutes' => 50,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete advanced mobility routines and compare range-of-motion progress from earlier sessions.'
                    ],
                    [
                        'title' => 'Long-Term Recovery Planning',
                        'description' => 'Develop sustainable rehabilitation habits and injury prevention strategies.',
                        'due_day' => 29,
                        'duration_minutes' => 45,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice posture correction, recovery stretching, and guided prevention-focused exercises.'
                    ],
                    [
                        'title' => 'Final Recovery Assessment & Functional Clearance',
                        'description' => 'Perform comprehensive recovery evaluation and prepare for long-term independent activity.',
                        'due_day' => 30,
                        'duration_minutes' => 60,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete full rehabilitation assessment including endurance, flexibility, strength, posture, and movement coordination testing.'
                    ],
                ],
            ],
            [
                'name'          => 'Comprehensive Recovery (60-Day)',
                'duration_days' => 60,
                'description'   => 'Thorough program for complex injuries, surgeries, or neurological conditions.',
                'milestones'    => [
                    [
                        'title' => 'Comprehensive Rehabilitation Assessment',
                        'description' => 'Evaluate posture, pain level, mobility restrictions, balance, strength, and recovery goals.',
                        'due_day' => 1,
                        'duration_minutes' => 20,
                        'difficulty' => 'Easy',
                        'exercise_instructions' => 'Practice breathing control, posture alignment, and gentle mobility exercises for neck, shoulders, hips, and ankles.'
                    ],
                    [
                        'title' => 'Pain & Swelling Reduction Therapy',
                        'description' => 'Reduce inflammation and improve comfort during movement.',
                        'due_day' => 2,
                        'duration_minutes' => 20,
                        'difficulty' => 'Easy',
                        'exercise_instructions' => 'Perform guided flexibility movements with cold/heat therapy and slow seated stretching exercises.'
                    ],
                    [
                        'title' => 'Assisted Joint Mobility Training',
                        'description' => 'Restore safe movement and reduce stiffness in affected joints.',
                        'due_day' => 3,
                        'duration_minutes' => 25,
                        'difficulty' => 'Easy',
                        'exercise_instructions' => 'Practice assisted knee bends, arm raises, hip circles, and controlled spinal mobility drills.'
                    ],
                    [
                        'title' => 'Flexibility & Tissue Release Session',
                        'description' => 'Improve muscle elasticity and reduce muscular tightness.',
                        'due_day' => 4,
                        'duration_minutes' => 25,
                        'difficulty' => 'Easy',
                        'exercise_instructions' => 'Perform hamstring, shoulder, calf, and lower-back therapeutic stretching with controlled breathing.'
                    ],
                    [
                        'title' => 'Core Activation & Stability Training',
                        'description' => 'Strengthen posture-support muscles and improve rehabilitation stability.',
                        'due_day' => 5,
                        'duration_minutes' => 30,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice pelvic tilts, seated abdominal holds, posture drills, and controlled core activation exercises.'
                    ],
                    [
                        'title' => 'Walking & Gait Rehabilitation',
                        'description' => 'Improve walking posture, coordination, and movement balance.',
                        'due_day' => 6,
                        'duration_minutes' => 30,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform heel-to-toe walking drills, directional stepping, and gait correction exercises.'
                    ],
                    [
                        'title' => 'Week 1 Recovery Evaluation',
                        'description' => 'Review pain reduction, flexibility improvement, and mobility progress.',
                        'due_day' => 7,
                        'duration_minutes' => 30,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete combined mobility and stretching exercises while tracking movement comfort.'
                    ],
                    [
                        'title' => 'Light Resistance Strengthening',
                        'description' => 'Begin safe resistance-based muscle activation training.',
                        'due_day' => 8,
                        'duration_minutes' => 35,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Use light resistance bands for shoulder pulls, leg extensions, and controlled arm strengthening exercises.'
                    ],
                    [
                        'title' => 'Balance & Coordination Recovery',
                        'description' => 'Improve body coordination and movement stability.',
                        'due_day' => 9,
                        'duration_minutes' => 35,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice side-stepping drills, supported balance exercises, and controlled body coordination training.'
                    ],
                    [
                        'title' => 'Lower Body Stability Development',
                        'description' => 'Improve leg strength and controlled movement support.',
                        'due_day' => 10,
                        'duration_minutes' => 35,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform assisted squats, calf raises, wall sits, and seated lower-body strengthening exercises.'
                    ],
                    [
                        'title' => 'Upper Body Rehabilitation Strengthening',
                        'description' => 'Increase upper body control and movement confidence.',
                        'due_day' => 11,
                        'duration_minutes' => 35,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform resistance band rows, shoulder stabilization, and controlled pushing/pulling exercises.'
                    ],
                    [
                        'title' => 'Joint Stabilization Therapy',
                        'description' => 'Enhance joint support and movement control.',
                        'due_day' => 12,
                        'duration_minutes' => 40,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice ankle stabilization drills, shoulder strengthening, and knee control exercises.'
                    ],
                    [
                        'title' => 'Functional Balance Integration',
                        'description' => 'Improve balance during real-life movement patterns.',
                        'due_day' => 13,
                        'duration_minutes' => 40,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform balance walking, controlled directional movement, and standing stability drills.'
                    ],
                    [
                        'title' => 'Phase 1 Progress Assessment',
                        'description' => 'Evaluate flexibility, mobility, posture, and strength improvements.',
                        'due_day' => 14,
                        'duration_minutes' => 40,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete full-body rehabilitation circuit and compare movement quality with initial assessment.'
                    ],
                    [
                        'title' => 'Functional Movement Re-education',
                        'description' => 'Retrain safe movement patterns for daily activities.',
                        'due_day' => 15,
                        'duration_minutes' => 40,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice sit-to-stand drills, stair stepping, reaching exercises, and controlled mobility routines.'
                    ],
                    [
                        'title' => 'Controlled Endurance Conditioning',
                        'description' => 'Improve cardiovascular endurance and recovery stamina.',
                        'due_day' => 16,
                        'duration_minutes' => 40,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform stationary cycling or treadmill walking while maintaining posture and breathing control.'
                    ],
                    [
                        'title' => 'Coordination & Reaction Training',
                        'description' => 'Enhance movement timing and neuromuscular coordination.',
                        'due_day' => 17,
                        'duration_minutes' => 45,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice directional stepping, coordination ladder drills, and reaction-based balance exercises.'
                    ],
                    [
                        'title' => 'Advanced Mobility Restoration',
                        'description' => 'Increase flexibility and movement freedom safely.',
                        'due_day' => 18,
                        'duration_minutes' => 45,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform hip mobility drills, dynamic stretching, spinal flexibility exercises, and shoulder mobility training.'
                    ],
                    [
                        'title' => 'Dynamic Strength Development',
                        'description' => 'Integrate controlled movement with strengthening exercises.',
                        'due_day' => 19,
                        'duration_minutes' => 45,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice lunges, resistance squats, arm strengthening, and stability-strength circuits.'
                    ],
                    [
                        'title' => 'Moderate Resistance Progression',
                        'description' => 'Increase muscle activation intensity safely.',
                        'due_day' => 20,
                        'duration_minutes' => 45,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform moderate resistance band exercises and bodyweight strengthening routines.'
                    ],
                    [
                        'title' => 'Week 3 Functional Assessment',
                        'description' => 'Assess endurance, movement quality, and strength progression.',
                        'due_day' => 21,
                        'duration_minutes' => 45,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete integrated rehabilitation circuit and review performance improvements.'
                    ],
                    [
                        'title' => 'Advanced Balance Rehabilitation',
                        'description' => 'Improve movement stability in challenging environments.',
                        'due_day' => 22,
                        'duration_minutes' => 45,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform dynamic balance drills, unstable surface exercises, and coordination-focused movement training.'
                    ],
                    [
                        'title' => 'Movement Confidence Restoration',
                        'description' => 'Rebuild confidence in independent movement and activity.',
                        'due_day' => 23,
                        'duration_minutes' => 45,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Practice full-body movement routines emphasizing posture and controlled transitions.'
                    ],
                    [
                        'title' => 'Integrated Rehabilitation Circuit',
                        'description' => 'Combine flexibility, endurance, and strength into one session.',
                        'due_day' => 24,
                        'duration_minutes' => 50,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform guided rehabilitation circuits combining mobility, resistance, and balance training.'
                    ],
                    [
                        'title' => 'Functional Activity Simulation',
                        'description' => 'Practice real-world activity movement patterns safely.',
                        'due_day' => 25,
                        'duration_minutes' => 50,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform stair mobility, lifting simulations, walking coordination, and task-based movement drills.'
                    ],
                    [
                        'title' => 'Recovery Endurance Training',
                        'description' => 'Improve movement consistency and physical stamina.',
                        'due_day' => 26,
                        'duration_minutes' => 50,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Complete low-impact endurance exercises while maintaining proper form and breathing.'
                    ],
                    [
                        'title' => 'Strength & Flexibility Integration',
                        'description' => 'Improve simultaneous mobility and muscle strength.',
                        'due_day' => 27,
                        'duration_minutes' => 50,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform dynamic stretching combined with resistance strengthening circuits.'
                    ],
                    [
                        'title' => 'Advanced Recovery Benchmarking',
                        'description' => 'Measure flexibility, endurance, and rehabilitation progress.',
                        'due_day' => 28,
                        'duration_minutes' => 50,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete advanced movement assessment and compare recovery metrics with previous evaluations.'
                    ],
                    [
                        'title' => 'Injury Prevention & Posture Correction',
                        'description' => 'Develop safer movement habits and prevent reinjury.',
                        'due_day' => 29,
                        'duration_minutes' => 45,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice posture correction drills, mobility exercises, and movement stabilization routines.'
                    ],
                    [
                        'title' => 'Phase 2 Comprehensive Assessment',
                        'description' => 'Evaluate recovery progress before advanced rehabilitation phase.',
                        'due_day' => 30,
                        'duration_minutes' => 60,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform full rehabilitation evaluation including flexibility, strength, endurance, and posture testing.'
                    ],
                    [
                        'title' => 'Advanced Strength Foundation',
                        'description' => 'Begin higher-level muscle strengthening and endurance training.',
                        'due_day' => 31,
                        'duration_minutes' => 50,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform controlled weighted strengthening exercises and functional movement drills.'
                    ],
                    [
                        'title' => 'Mobility Endurance Training',
                        'description' => 'Improve sustained flexibility and movement control.',
                        'due_day' => 32,
                        'duration_minutes' => 50,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Complete extended mobility circuits with dynamic stretching and endurance movement patterns.'
                    ],
                    [
                        'title' => 'Neuromuscular Coordination Enhancement',
                        'description' => 'Improve body awareness and movement precision.',
                        'due_day' => 33,
                        'duration_minutes' => 50,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Practice agility coordination, reaction drills, and controlled multidirectional movement exercises.'
                    ],
                    [
                        'title' => 'Functional Stability Progression',
                        'description' => 'Enhance movement control during daily functional activities.',
                        'due_day' => 34,
                        'duration_minutes' => 50,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform controlled stepping, lifting, and balance transition exercises.'
                    ],
                    [
                        'title' => 'Dynamic Resistance Conditioning',
                        'description' => 'Increase controlled resistance capacity and movement power.',
                        'due_day' => 35,
                        'duration_minutes' => 55,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Practice resistance circuits, weighted body movement drills, and stabilization exercises.'
                    ],
                    [
                        'title' => 'Advanced Postural Rehabilitation',
                        'description' => 'Improve alignment, posture, and spinal support.',
                        'due_day' => 36,
                        'duration_minutes' => 50,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform spinal alignment exercises, shoulder posture correction, and core stabilization drills.'
                    ],
                    [
                        'title' => 'Recovery Performance Conditioning',
                        'description' => 'Build movement endurance and physical confidence.',
                        'due_day' => 37,
                        'duration_minutes' => 55,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Complete moderate-intensity rehabilitation conditioning circuit with recovery pacing.'
                    ],
                    [
                        'title' => 'Functional Coordination Reinforcement',
                        'description' => 'Improve coordination during complex movement patterns.',
                        'due_day' => 38,
                        'duration_minutes' => 55,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Practice multidirectional stepping, coordination drills, and reaction-based movement exercises.'
                    ],
                    [
                        'title' => 'Balance & Strength Integration',
                        'description' => 'Combine stability and strengthening into integrated rehabilitation training.',
                        'due_day' => 39,
                        'duration_minutes' => 55,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform balance-resistance circuits with controlled functional movement.'
                    ],
                    [
                        'title' => 'Mobility Reassessment & Recovery Tracking',
                        'description' => 'Review flexibility and movement progression.',
                        'due_day' => 40,
                        'duration_minutes' => 50,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete full-body mobility evaluation and compare movement quality improvements.'
                    ],
                    [
                        'title' => 'Advanced Functional Training',
                        'description' => 'Prepare for more demanding real-life physical activities.',
                        'due_day' => 41,
                        'duration_minutes' => 55,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Practice lifting mechanics, walking endurance, and task-based rehabilitation drills.'
                    ],
                    [
                        'title' => 'Strength Endurance Development',
                        'description' => 'Improve sustained muscular control and recovery stamina.',
                        'due_day' => 42,
                        'duration_minutes' => 55,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform repeated resistance exercises with controlled pacing and breathing.'
                    ],
                    [
                        'title' => 'High-Level Balance Training',
                        'description' => 'Improve confidence in advanced balance and stability challenges.',
                        'due_day' => 43,
                        'duration_minutes' => 55,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Practice unstable-surface balance drills and controlled movement coordination exercises.'
                    ],
                    [
                        'title' => 'Movement Efficiency Optimization',
                        'description' => 'Reduce unnecessary movement strain and improve efficiency.',
                        'due_day' => 44,
                        'duration_minutes' => 50,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform guided posture correction and controlled energy-efficient movement exercises.'
                    ],
                    [
                        'title' => 'Advanced Functional Circuit',
                        'description' => 'Integrate all major rehabilitation skills into one structured recovery session.',
                        'due_day' => 45,
                        'duration_minutes' => 60,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Complete advanced rehabilitation circuit combining mobility, endurance, strength, and balance exercises.'
                    ],
                    [
                        'title' => 'Controlled Agility Rehabilitation',
                        'description' => 'Improve movement responsiveness and agility safely.',
                        'due_day' => 46,
                        'duration_minutes' => 55,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Practice directional movement changes, stepping drills, and controlled agility exercises.'
                    ],
                    [
                        'title' => 'Muscle Endurance Progression',
                        'description' => 'Increase ability to sustain physical activity without fatigue.',
                        'due_day' => 47,
                        'duration_minutes' => 55,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform repeated low-impact strengthening and endurance exercises with controlled recovery intervals.'
                    ],
                    [
                        'title' => 'Advanced Coordination & Stability',
                        'description' => 'Improve precision and confidence during movement.',
                        'due_day' => 48,
                        'duration_minutes' => 55,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Practice advanced coordination drills, movement sequencing, and balance integration exercises.'
                    ],
                    [
                        'title' => 'Functional Reintegration Training',
                        'description' => 'Simulate real-world activities and physical demands.',
                        'due_day' => 49,
                        'duration_minutes' => 60,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform work/sport simulation exercises and controlled task-based movement routines.'
                    ],
                    [
                        'title' => 'Comprehensive Recovery Conditioning',
                        'description' => 'Improve overall rehabilitation performance and endurance.',
                        'due_day' => 50,
                        'duration_minutes' => 60,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Complete integrated recovery conditioning circuit with full-body functional movement exercises.'
                    ],
                    [
                        'title' => 'Postural Strength Reinforcement',
                        'description' => 'Strengthen posture-support muscles and improve movement alignment.',
                        'due_day' => 51,
                        'duration_minutes' => 50,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice spinal stabilization, core strengthening, and posture correction exercises.'
                    ],
                    [
                        'title' => 'Advanced Flexibility Recovery',
                        'description' => 'Improve advanced range-of-motion and flexibility control.',
                        'due_day' => 52,
                        'duration_minutes' => 50,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform dynamic stretching, mobility sequencing, and flexibility progression exercises.'
                    ],
                    [
                        'title' => 'Recovery Consistency Training',
                        'description' => 'Improve routine adherence and independent rehabilitation confidence.',
                        'due_day' => 53,
                        'duration_minutes' => 55,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete guided recovery circuit emphasizing consistency and movement quality.'
                    ],
                    [
                        'title' => 'Advanced Strength Integration',
                        'description' => 'Combine functional movement with advanced strengthening safely.',
                        'due_day' => 54,
                        'duration_minutes' => 60,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform resistance-based rehabilitation circuits and controlled strengthening drills.'
                    ],
                    [
                        'title' => 'High-Endurance Functional Training',
                        'description' => 'Improve stamina for extended physical activity.',
                        'due_day' => 55,
                        'duration_minutes' => 60,
                        'difficulty' => 'Hard',
                        'exercise_instructions' => 'Perform sustained low-impact endurance activities with movement pacing control.'
                    ],
                    [
                        'title' => 'Movement Confidence Evaluation',
                        'description' => 'Assess confidence and independence during rehabilitation exercises.',
                        'due_day' => 56,
                        'duration_minutes' => 50,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete full-body rehabilitation movements independently with posture monitoring.'
                    ],
                    [
                        'title' => 'Long-Term Injury Prevention Training',
                        'description' => 'Learn sustainable movement habits for future injury prevention.',
                        'due_day' => 57,
                        'duration_minutes' => 45,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Practice posture correction, stabilization drills, and guided movement safety exercises.'
                    ],
                    [
                        'title' => 'Recovery Performance Benchmarking',
                        'description' => 'Measure overall rehabilitation outcomes and physical improvements.',
                        'due_day' => 58,
                        'duration_minutes' => 50,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete integrated flexibility, strength, endurance, and coordination evaluation circuit.'
                    ],
                    [
                        'title' => 'Independent Activity Readiness',
                        'description' => 'Prepare for safe independent physical activity and long-term maintenance.',
                        'due_day' => 59,
                        'duration_minutes' => 50,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Perform complete recovery routine emphasizing self-management and safe movement progression.'
                    ],
                    [
                        'title' => 'Final Rehabilitation Assessment & Long-Term Maintenance Plan',
                        'description' => 'Perform final recovery evaluation and establish long-term rehabilitation maintenance strategy.',
                        'due_day' => 60,
                        'duration_minutes' => 60,
                        'difficulty' => 'Medium',
                        'exercise_instructions' => 'Complete full recovery assessment including strength, endurance, flexibility, posture, mobility, and functional movement testing.'
                    ],
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
                ProgramMilestone::updateOrCreate(
                    ['program_id' => $program->id, 'due_day' => $ms['due_day']],
                    $ms
                );
            }
        }

        $this->command->info('✅ 3 rehab programs seeded (15/30/60 day) with milestones.');
    }
}
