<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up()
  {
    Schema::create('prescriptions', function (Blueprint $table) {
      $table->id();
      $table->foreignId('appointment_id')->constrained()->onDelete('cascade')->unique();
      $table->foreignId('doctor_id')->constrained()->onDelete('cascade');
      $table->foreignId('patient_id')->constrained()->onDelete('cascade');
      $table->text('diagnosis')->nullable();
      $table->text('notes')->nullable();
      $table->date('next_visit_date')->nullable();
      $table->string('status')->default('finalized');
      $table->timestamps();
    });
  }

  public function down()
  {
    Schema::dropIfExists('prescriptions');
  }
};
