<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProgramMilestone extends Model
{
    protected $fillable = [
        'program_id',
        'title',
        'description',
        'difficulty',
        'duration_minutes',
        'category',
        'exercise_instructions',
        'media_url',
        'due_day'
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(RehabProgram::class, 'program_id');
    }

    public function progress(): HasMany
    {
        return $this->hasMany(PatientProgress::class, 'milestone_id');
    }
}
