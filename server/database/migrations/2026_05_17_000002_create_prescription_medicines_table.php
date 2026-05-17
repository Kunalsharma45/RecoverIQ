<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up()
  {
    Schema::create('prescription_medicines', function (Blueprint $table) {
      $table->id();
      $table->foreignId('prescription_id')->constrained()->onDelete('cascade');
      $table->string('name');
      $table->string('dosage')->nullable();
      $table->integer('duration_days')->nullable();
      $table->text('instructions')->nullable();
      $table->timestamps();
    });
  }

  public function down()
  {
    Schema::dropIfExists('prescription_medicines');
  }
};
