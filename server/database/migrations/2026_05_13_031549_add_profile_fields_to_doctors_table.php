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
        Schema::table('doctors', function (Blueprint $table) {
            $table->string('hospital_name')->nullable();
            $table->integer('experience_years')->default(0);
            $table->string('qualification')->nullable();
            $table->string('phone')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn(['hospital_name', 'experience_years', 'qualification', 'phone']);
        });
    }
};
