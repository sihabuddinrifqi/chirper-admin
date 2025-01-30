<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles')->get();

        $allUser = $users->map(function (User $user) {
            $user->total_chirps = $user->chirps()->count();
            return $user;
        });

        return Inertia::render('Users/Index', [
            'user' => Auth::user(),
            'title' => 'User Management',
            'all_user' => $allUser,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $user->load('roles');

        // Ambil semua role yang tersedia
        $roles = Role::all();

        return Inertia::render('Users/Edit', [
            'user' => Auth::user(),
            'title' => 'User Management',
            'edit_user' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'nullable|string|min:8', // Password bersifat opsional
            'is_active' => 'required|boolean',
            'role_ids' => 'required|array',
            'role_ids.*' => 'exists:roles,id',
        ]);

        // Update name
        $user->name = $validated['name'];

        // Update password hanya jika diisi
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        // Update is_active
        $user->is_active = $validated['is_active'];

        // Sync roles user
        $user->roles()->sync($validated['role_ids']);
    
        // Simpan perubahan ke database
        $user->save();

        // Redirect dengan pesan sukses
        return redirect()
            ->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Cek apakah pengguna yang akan dihapus adalah pengguna yang sedang aktif
        if ($user->id === Auth::id()) {
            return redirect()->route('users.index')->with('error', 'You cannot delete your own account.');
        }

        // Hapus pengguna
        $user->delete();

        // Redirect ke halaman index dengan pesan sukses
        return redirect()
            ->route('users.index')
            ->with('success', 'User deleted successfully.');
    }
}
