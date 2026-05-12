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
        Schema::table('rehab_programs', function (Blueprint $table) {
            $table->string('category')->default('Orthopedic')->after('description');
            $table->string('difficulty')->default('Beginner')->after('category');
            $table->string('target_patients')->nullable()->after('difficulty');
            $table->string('recovery_focus')->nullable()->after('target_patients');
        });

        Schema::table('program_milestones', function (Blueprint $table) {
            $table->string('intensity')->default('Low')->after('difficulty');
            $table->text('precautions')->nullable()->after('exercise_instructions');
            $table->text('recovery_goals')->nullable()->after('precautions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rehab_programs', function (Blueprint $table) {
            $table->dropColumn(['category', 'difficulty', 'target_patients', 'recovery_focus']);
        });

        Schema::table('program_milestones', function (Blueprint $table) {
            $table->dropColumn(['intensity', 'precautions', 'recovery_goals']);
        });
    }
};
