<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/create-password');
    }

    public function store(Request $request): RedirectResponse
    {
        try {
            // dd($request);
            $validated = $request->validate([
                'password' => ['required', 'confirmed', Password::defaults()],
            ]);

            $request->user()->update([
                'password' => Hash::make($validated['password']),
                'must_set_password' => false,
            ]);

            event(new PasswordReset($request->user()));

            return redirect()->route('home')
                ->with('status', 'password-created');
        } catch (\Exception $th) {
            throw $th;
        }
    }
}
