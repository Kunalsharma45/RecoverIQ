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
        Schema::table('program_milestones', function (Blueprint $table) {
            $table->string('difficulty')->default('Medium')->after('description');
            $table->unsignedInteger('duration_minutes')->nullable()->after('difficulty');
            $table->string('category')->nullable()->after('duration_minutes');
            $table->text('exercise_instructions')->nullable()->after('category');
            $table->string('media_url')->nullable()->after('exercise_instructions');
        });

        Schema::table('patient_progress', function (Blueprint $table) {
            $table->string('status')->default('Pending')->after('milestone_id');
            $table->text('doctor_notes')->nullable()->after('notes');
            $table->timestamp('reviewed_at')->nullable()->after('completed_at');
        });
    }

    public function down(): void
    {
        Schema::table('program_milestones', function (Blueprint $table) {
            $table->dropColumn(['difficulty', 'duration_minutes', 'category', 'exercise_instructions', 'media_url']);
        });

        Schema::table('patient_progress', function (Blueprint $table) {
            $table->dropColumn(['status', 'doctor_notes', 'reviewed_at']);
        });
    }
};
