<?php

use App\Http\Controllers\ChirpController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StatisticController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource('chirps', ChirpController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->middleware(['auth']);

Route::resource('users', UserController::class)
    ->only(['index', 'store', 'edit', 'update', 'destroy'])
    ->middleware(['auth', 'is-admin']);


Route::group([
    'middleware' => ['auth', 'is-admin'],
    'prefix' => 'admin',
    'as' => 'admin.'
],function() {
    Route::put('/reports/update-user-status/{userId}', [\App\Http\Controllers\Admin\ReportController::class, 'updateUserStatus'])->name('reports.update-user-status');

    Route::resource('chirps', \App\Http\Controllers\Admin\ChirpController::class);
    Route::resource('reports', \App\Http\Controllers\Admin\ReportController::class);
    Route::get('/statistics', [StatisticController::class, 'index'])->name('statistics');
});


/**
 * ROUTE STATISTICS
 * Route::group() berfungsi untuk grouping beberapa routes menjadi 1.
 * group() menerima parameter attributes dan routes
 * kita bisa set berbagai option pada attributes, seperti middleware, prefix,dll
 * prefix -> fungsinya menambahkan path didepan routes yang ada di groupnya
 * misal prefix => 'statistics'
 * maka di routes /users -> outpoutnya jadi '/statistics/users';
 *
 * as -> fungsinya untuk menambahan prefix pada nama routes.
 * misal as => 'statistics.'
 * maka route name('users') namanya menjadi 'statistics.users'
 */

Route::group([
    'prefix' => 'statistics',
    'as' => 'statistics.',
], function() {
    Route::get('/users',[StatisticController::class, 'getUserStatistics'])->name('users');
    Route::get('/chirps',[StatisticController::class, 'getChirpStatistics'])->name('users');
    Route::get('/reports',[StatisticController::class, 'getReportStatistics'])->name('users');
});

require __DIR__.'/auth.php';
