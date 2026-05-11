<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Mail\PatientCredentialsMail;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * GET /api/admin/users
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->with(['doctor', 'patient.program'])->latest()->paginate(20);

        return response()->json($users);
    }

    /**
     * POST /api/admin/users
     * Create a doctor account.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|unique:users,email',
            'role'           => 'required|in:doctor,admin',
            'specialization' => 'required_if:role,doctor|string|max:255',
            'bio'            => 'nullable|string',
        ]);

        $password = Str::random(10);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $password,
            'role'     => $request->role,
        ]);

        if ($request->role === 'doctor') {
            Doctor::create([
                'user_id'        => $user->id,
                'specialization' => $request->specialization,
                'bio'            => $request->bio,
            ]);
        }

        return response()->json([
            'message'  => 'User created successfully.',
            'user'     => $user->load('doctor'),
            'password' => $password, // returned once for admin to share
        ], 201);
    }

    /**
     * PATCH /api/admin/users/{id}
     */
    public function update(Request $request, int $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'      => 'sometimes|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        $user->update($request->only(['name', 'is_active']));

        return response()->json(['message' => 'User updated.', 'user' => $user]);
    }

    /**
     * DELETE /api/admin/users/{id}
     */
    public function destroy(int $id)
    {
        $user = User::findOrFail($id);

        if ($user->id === request()->user()->id) {
            return response()->json(['message' => 'Cannot delete yourself.'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted.']);
    }
}
