<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    /**
     * GET /api/doctors
     * Public doctor listing for booking page.
     */
    public function index()
    {
        $doctors = Doctor::with('user')
            ->whereHas('user', fn ($q) => $q
                ->where('is_active', true)
                ->whereNotNull('email_verified_at')
            )
            ->get()
            ->map(fn ($d) => [
                'id'             => $d->id,
                'name'           => $d->user->name,
                'specialization' => $d->specialization,
                'bio'            => $d->bio,
            ]);

        return response()->json($doctors);
    }

    /**
     * GET /api/doctors/{id}/slots
     * Available 1-hour slots for next 7 days (9am-5pm, Mon-Fri).
     */
    public function slots(int $id)
    {
        $doctor = Doctor::findOrFail($id);

        $bookedSlots = Appointment::where('doctor_id', $id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('slot_at', '>=', now())
            ->pluck('slot_at')
            ->map(fn ($s) => Carbon::parse($s)->format('Y-m-d H:i'))
            ->toArray();

        $slots = [];
        $start = now()->addDay()->startOfDay();

        for ($day = 0; $day < 7; $day++) {
            $date = $start->copy()->addDays($day);
            if ($date->isWeekend()) continue;

            for ($hour = 9; $hour < 17; $hour++) {
                $slot = $date->copy()->setHour($hour)->setMinute(0)->setSecond(0);
                $formatted = $slot->format('Y-m-d H:i');
                if (! in_array($formatted, $bookedSlots)) {
                    $slots[] = $slot->toIso8601String();
                }
            }
        }

        return response()->json(['doctor_id' => $id, 'available_slots' => $slots]);
    }
}
