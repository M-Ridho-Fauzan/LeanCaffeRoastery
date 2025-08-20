<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordIsSet
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Cek jika user sudah login DAN perlu membuat password
        if ($request->user() && $request->user()->must_set_password) {

            // Izinkan akses hanya ke halaman pembuatan password atau logout
            if (
                ! $request->routeIs('password.create') &&
                ! $request->routeIs('password.set') &&
                ! $request->routeIs('logout')
            ) {
                return redirect()->route('password.create');
            }
        }

        // Izinkan user yang sudah punya password untuk tidak mengakses halaman create
        if (
            $request->user() &&
            !$request->user()->must_set_password &&
            $request->routeIs('password.create')
        ) {
            return redirect()->intended(route('home', absolute: false));
        }

        return $next($request);
    }
}
