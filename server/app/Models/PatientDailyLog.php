<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientDailyLog extends Model
{
    protected $fillable = [
        'patient_id',
        'milestone_id',
        'progress_id',
        'pain_level',
        'energy_level',
        'mobility_score',
        'exercise_completion',
        'mood',
        'difficulties',
        'improvements'
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function milestone(): BelongsTo
    {
        return $this->belongsTo(ProgramMilestone::class, 'milestone_id');
    }

    public function progress(): BelongsTo
    {
        return $this->belongsTo(PatientProgress::class, 'progress_id');
    }
}
