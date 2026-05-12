<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    protected $fillable = ['user_id', 'doctor_id', 'program_id', 'enrolled_at'];

    protected $casts = [
        'enrolled_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(RehabProgram::class, 'program_id');
    }

    public function progress(): HasMany
    {
        return $this->hasMany(PatientProgress::class);
    }

    public function calculateStreak()
    {
        $completionDates = $this->progress()
            ->where('status', 'Completed')
            ->whereNotNull('completed_at')
            ->orderBy('completed_at', 'desc')
            ->get()
            ->map(function($p) {
                return $p->completed_at->toDateString();
            })
            ->unique()
            ->values();

        if ($completionDates->isEmpty()) return 0;

        $streak = 0;
        $checkDate = \Carbon\Carbon::today();

        // If today isn't completed, check if yesterday was. 
        // If neither, streak is 0.
        if ($completionDates[0] !== $checkDate->toDateString()) {
            $checkDate->subDay();
            if ($completionDates[0] !== $checkDate->toDateString()) {
                return 0;
            }
        }

        foreach ($completionDates as $date) {
            if ($date === $checkDate->toDateString()) {
                $streak++;
                $checkDate->subDay();
            } else {
                break;
            }
        }

        return $streak;
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(DoctorReview::class);
    }
}
