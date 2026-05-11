<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientProgress extends Model
{
    protected $fillable = ['patient_id', 'milestone_id', 'completed_at', 'notes'];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function milestone(): BelongsTo
    {
        return $this->belongsTo(ProgramMilestone::class, 'milestone_id');
    }
}
