<?php

namespace App\Http\Controllers\Api\Patient;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
  /**
   * GET /api/patient/prescriptions
   */
  public function index(Request $request)
  {
    $patient = $request->user()->patient;
    $prescriptions = Prescription::where('patient_id', $patient->id)
      ->with('doctor.user', 'medicines', 'appointment')
      ->orderBy('created_at', 'desc')
      ->get();

    return response()->json($prescriptions);
  }

  /**
   * GET /api/patient/prescriptions/{id}
   */
  public function show(Request $request, int $id)
  {
    $patient = $request->user()->patient;
    $prescription = Prescription::where('patient_id', $patient->id)->with('doctor.user', 'medicines', 'appointment')->findOrFail($id);

    return response()->json($prescription);
  }
}
