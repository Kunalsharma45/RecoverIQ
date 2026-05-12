<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patient_daily_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->foreignId('milestone_id')->constrained('program_milestones')->onDelete('cascade');
            $table->foreignId('progress_id')->constrained('patient_progress')->onDelete('cascade');
            
            $table->integer('pain_level'); // 0-10
            $table->integer('energy_level'); // 1-5
            $table->string('mobility_score'); // Very Stiff, Limited, Moderate, Improved, Fully Comfortable
            $table->integer('exercise_completion'); // 0-100 percentage
            $table->string('mood')->nullable(); // Motivated, Neutral, Frustrated, Tired, Confident
            
            $table->text('difficulties')->nullable();
            $table->text('improvements')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_daily_logs');
    }
};
