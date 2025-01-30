<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckIfAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Mengecek apakah pengguna yang login memiliki role 'admin'
        $user = Auth::user();

        if (!$user || !$user->roles->contains('name', 'admin')) {
            // Jika bukan admin, arahkan ke halaman dashboard
            return redirect('/dashboard')->with('error', 'You are not authorized to access this page.');
        }

        // Lanjutkan request jika user adalah admin
        return $next($request);
    }
}
