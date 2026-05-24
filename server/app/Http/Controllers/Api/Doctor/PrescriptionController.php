<?php

namespace App\Http\Controllers\Api\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Prescription;
use App\Models\PrescriptionMedicine;
use App\Models\Notification as AppNotification;
use App\Events\AppointmentCompleted;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PrescriptionController extends Controller
{
  /**
   * POST /api/doctor/appointments/{id}/prescription
   */
  public function store(Request $request, int $id)
  {
    $doctor = $request->user()->doctor;
    $appointment = $doctor->appointments()->findOrFail($id);

    $request->validate([
      'diagnosis' => 'nullable|string',
      'notes' => 'nullable|string',
      'next_visit_date' => 'nullable|date',
      'medicines' => 'nullable|array',
      'medicines.*.name' => 'required_with:medicines|string',
      'medicines.*.dosage' => 'nullable|string',
      'medicines.*.duration_days' => 'nullable|integer',
      'medicines.*.instructions' => 'nullable|string',
    ]);

    if ($appointment->prescription) {
      return response()->json(['message' => 'Prescription already exists for this appointment.'], 422);
    }

    $payload = $request->only(['diagnosis', 'notes', 'next_visit_date']);

    $prescription = DB::transaction(function () use ($appointment, $payload, $request) {
      $prescription = Prescription::create(array_merge($payload, [
        'appointment_id' => $appointment->id,
        'doctor_id' => $appointment->doctor_id,
        'patient_id' => $appointment->patient_id,
        'status' => 'finalized',
      ]));

      $medicines = $request->input('medicines', []);
      foreach ($medicines as $m) {
        PrescriptionMedicine::create(array_merge($m, ['prescription_id' => $prescription->id]));
      }

      // Create or refresh the next follow-up appointment so the patient dashboard
      // can show it as the upcoming visit.
      if ($prescription->next_visit_date && $appointment->patient_id) {
        $nextSlot = Carbon::parse($prescription->next_visit_date)
          ->setTimeFrom($appointment->slot_at)
          ->seconds(0);

        $followUp = Appointment::firstOrNew([
          'doctor_id' => $appointment->doctor_id,
          'patient_id' => $appointment->patient_id,
          'slot_at' => $nextSlot,
        ]);

        $followUp->fill([
          'booked_by_name' => $appointment->booked_by_name,
          'booked_by_email' => $appointment->booked_by_email,
          'status' => 'confirmed',
          'notes' => $prescription->notes ? 'Follow-up from prescription: ' . $prescription->notes : 'Follow-up appointment assigned by doctor.',
          'problem_description' => $appointment->problem_description,
        ]);

        $followUp->save();
      }

      // Optionally mark appointment completed if requested
      if ($request->boolean('complete')) {
        $appointment->update(['status' => 'completed']);

        // Log and notify
        try {
          \Illuminate\Support\Facades\Log::info("Appointment #{$appointment->id} completed via prescription submission", ['appointment' => $appointment->toArray()]);

          if ($appointment->patient && $appointment->patient->user) {
            AppNotification::create([
              'user_id' => $appointment->patient->user->id,
              'type' => 'appointment_completed',
              'data' => [
                'appointment_id' => $appointment->id,
                'message' => 'Your appointment has been marked completed by the doctor.',
              ],
            ]);
            event(new AppointmentCompleted($appointment, $appointment->patient->user->id));
          }

          if ($appointment->doctor && $appointment->doctor->user) {
            AppNotification::create([
              'user_id' => $appointment->doctor->user->id,
              'type' => 'appointment_completed',
              'data' => [
                'appointment_id' => $appointment->id,
                'message' => 'You have completed the appointment.',
              ],
            ]);
            event(new AppointmentCompleted($appointment, $appointment->doctor->user->id));
          }
        } catch (\Throwable $e) {
          \Illuminate\Support\Facades\Log::error('Failed to create completion notifications (prescription): ' . $e->getMessage());
        }
      }

      return $prescription->load('medicines');
    });

    return response()->json(['message' => 'Prescription saved.', 'prescription' => $prescription], 201);
  }
}
