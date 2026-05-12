<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RehabProgram extends Model
{
    protected $fillable = ['name', 'duration_days', 'description', 'category', 'difficulty', 'target_patients', 'recovery_focus'];

    public function milestones(): HasMany
    {
        return $this->hasMany(ProgramMilestone::class, 'program_id');
    }

    public function patients(): HasMany
    {
        return $this->hasMany(Patient::class, 'program_id');
    }
}
