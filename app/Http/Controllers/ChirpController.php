<?php

namespace App\Http\Controllers;

use App\Models\Chirp;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ChirpController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('Chirps/Index', [
            'user' => Auth::user(),
            'title' => 'Belajar Laravel Bootcamp Inertia - Najma',
            'chirps' => Chirp::with('user:id,name')->latest()->get(),
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
    public function store(Request $request):RedirectResponse
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'image' => ['sometimes','nullable','image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'hashtags' => ['sometimes', 'nullable', 'string']
        ]);
        
        $createData = [];
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('chirps', 'public'); // Simpan gambar
            $createData['image'] = $path;
        }
        $createData['message'] = $validated['message'];
        $createData['hashtags'] = $validated['hashtags'] ?? '';
    
        $request->user()->chirps()->create($createData);
 
        return redirect(route('chirps.index'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Chirp $chirp)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Chirp $chirp)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Chirp $chirp): RedirectResponse
    {
        Gate::authorize('update', $chirp);
 
        $validated = $request->validate([
            'message' => 'required|string',
            'hashtags' => ['sometimes', 'nullable', 'string']
        ]);
 
        $chirp->update($validated);
 
        return redirect(route('chirps.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Chirp $chirp): RedirectResponse
    {
        Gate::authorize('delete', $chirp);
 
        $path = $chirp->image;
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
        $chirp->delete();
 
        return redirect(route('chirps.index'));
    }
}
