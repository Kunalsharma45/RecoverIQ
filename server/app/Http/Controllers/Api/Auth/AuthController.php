<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Doctor;
use App\Services\MailService;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /**
     * POST /api/auth/login
     * Works for admin, doctor, and patient.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
            'role'     => 'required|in:patient,doctor,admin',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->role !== $request->role) {
            return response()->json([
                'message' => 'This account is registered as ' . $user->role . '. Please select the ' . $user->role . ' login option.',
            ], 403);
        }

        if (! $user->is_active) {
            return response()->json(['message' => 'Your account has been deactivated.'], 403);
        }

        if ($user->isDoctor() && ! $user->email_verified_at) {
            return response()->json(['message' => 'Please verify your email before logging in.'], 403);
        }

        // Revoke old tokens and issue a fresh one
        $user->tokens()->delete();
        $token = $user->createToken('api-token')->plainTextToken;

        $profile = null;
        if ($user->isDoctor()) {
            $profile = $user->doctor;
        } elseif ($user->isPatient()) {
            $profile = $user->patient()->with(['doctor.user', 'program'])->first();
        }

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'role'    => $user->role,
                'profile' => $profile,
            ],
        ]);
    }

    /**
     * POST /api/auth/logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    /**
     * POST /api/auth/reset-password
     * Used by patients on first login to set their own password.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (! Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }

        $user->update(['password' => $request->password]);

        return response()->json(['message' => 'Password updated successfully.']);
    }

    /**
     * POST /api/auth/register-doctor
     * Public endpoint for doctors to register themselves.
     */
    public function registerDoctor(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|unique:users,email',
            'password'       => 'required|string|min:8',
            'specialization' => 'required|string|max:255',
            'bio'            => 'nullable|string',
        ]);

        $user = DB::transaction(function () use ($request) {
            $user = User::create([
                'name'      => $request->name,
                'email'     => $request->email,
                'password'  => $request->password, // hashed by cast in User model
                'role'      => 'doctor',
                'is_active' => true,
            ]);

            Doctor::create([
                'user_id'        => $user->id,
                'specialization' => $request->specialization,
                'bio'            => $request->bio,
            ]);

            return $user;
        });

        MailService::sendDoctorVerification($user);

        return response()->json([
            'message' => 'Registration successful. Please check your email to verify your account.',
        ], 201);
    }
}
