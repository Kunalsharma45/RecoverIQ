<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Prescription extends Model
{
  protected $fillable = [
    'appointment_id',
    'doctor_id',
    'patient_id',
    'diagnosis',
    'notes',
    'next_visit_date',
    'status',
  ];

  protected $casts = [
    'next_visit_date' => 'date',
  ];

  public function appointment(): BelongsTo
  {
    return $this->belongsTo(Appointment::class);
  }

  public function doctor(): BelongsTo
  {
    return $this->belongsTo(Doctor::class);
  }

  public function patient(): BelongsTo
  {
    return $this->belongsTo(Patient::class);
  }

  public function medicines(): HasMany
  {
    return $this->hasMany(PrescriptionMedicine::class);
  }
}
