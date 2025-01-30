<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reports = Report::with(['user', 'chirp'])->get();
        return Inertia::render('Admin/Reports/Index', [
            'user' => Auth::user(),
            'title' => 'Chrip Reports Management',
            'reports' => $reports,
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
        $rules = [
            'user_id' => ['required', 'exists:users,id'],
            'chirp_id' => ['required', 'exists:chirps,id'],
            'notes' => ['sometimes', 'nullable', 'string'],
            'is_resolved' => ['sometimes', 'nullable', 'boolean']
        ];

        $validator = Validator::make($request->all(), $rules);

        $validated = $validator->valid();

        $report = Report::create($validated);

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Report $report)
    {
        $report->load('user');
        $report->load('chirp');
        $report->load('chirp.user');

        return Inertia::render('Admin/Reports/Edit', [
            'user' => Auth::user(),
            'title' => 'Detail Report',
            'report' => $report,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $rules = [
            'notes' => ['sometimes', 'nullable', 'string'],
            'is_resolved' => ['sometimes', 'nullable', 'boolean']
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $validated = $validator->validated();

        $report = Report::findOrFail($id);
        $report->update($validated);

        return redirect('/admin/reports');
    }

    public function updateUserStatus(Request $request, $userId)
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);
        $user = User::findOrFail($userId);
        $user->is_active = $validated['is_active'];
        $user->save();

        $returnData = [
            'status' => 'success',
            'code' => 200,
            'data' => [
                'user' => $user
            ],
        ];
        return response()->json($returnData, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Report $report)
    {
        $report->delete();

        return redirect(route('admin.reports.index'));
    }
}
