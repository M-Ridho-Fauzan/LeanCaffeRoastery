<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        // 1. Ambil data yang sudah divalidasi
        $validatedData = $request->validated();
        $user = $request->user();

        // 2. Cek jika ada file avatar yang di-upload
        if ($request->hasFile('avatar')) {
            // Hapus avatar lama jika ada
            if ($user->avatar_path) {
                Storage::disk('public')->delete($user->avatar_path);
            }
            // Simpan file baru dan dapatkan path-nya
            $path = $request->file('avatar')->store('avatars', 'public');
            // Tambahkan path baru ke data yang akan disimpan
            $validatedData['avatar_path'] = $path;
        }

        // 3. Hapus 'avatar' dari array karena kita tidak punya kolom 'avatar' di DB
        unset($validatedData['avatar']);

        // 4. Isi data user dengan data yang sudah divalidasi (termasuk avatar_path jika ada)
        $user->fill($validatedData);

        // Cek jika email berubah untuk verifikasi ulang
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        $user->refresh();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
