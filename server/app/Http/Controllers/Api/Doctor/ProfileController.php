<?php

namespace App\Http\Controllers\Api\Doctor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        $doctor = $user->doctor;

        return response()->json([
            'user' => $user,
            'doctor' => $doctor,
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        $doctor = $user->doctor;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'specialization' => 'required|string|max:255',
            'experience_years' => 'required|integer|min:0',
            'qualification' => 'required|string|max:255',
            'hospital_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string',
            'old_password' => 'nullable|string|required_with:password',
            'password' => ['nullable', 'confirmed', Password::min(8)],
        ]);

        if ($request->filled('password')) {
            if (!Hash::check($request->old_password, $user->password)) {
                return response()->json(['message' => 'The provided old password does not match our records.'], 422);
            }
            $user->update(['password' => Hash::make($validated['password'])]);
        }

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        $doctor->update([
            'specialization' => $validated['specialization'],
            'experience_years' => $validated['experience_years'],
            'qualification' => $validated['qualification'],
            'hospital_name' => $validated['hospital_name'],
            'phone' => $validated['phone'],
            'bio' => $validated['bio'],
        ]);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->fresh(),
            'doctor' => $doctor->fresh(),
        ]);
    }
}
