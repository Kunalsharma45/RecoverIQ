<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('program_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained('rehab_programs')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedInteger('due_day'); // day number within the program (1-60)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_milestones');
    }
};
