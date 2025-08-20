<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Socialite as SocialiteAccount; // Ganti nama agar tidak bentrok
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    /**
     * Mengarahkan pengguna ke halaman autentikasi Google.
     *
     * @param string $provider
     * @return RedirectResponse|\Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function redirectToProvider(string $provider): RedirectResponse
    {
        return Socialite::driver($provider)->redirect();
    }

    /**
     * Membuat dan mengarahkan user ke page create password
     *
     * @param string $provider
     * @return RedirectResponse
     */
    public function handleProviderCallback(string $provider): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver($provider)->user();


            // 1. Cari atau buat user baru
            $user = DB::transaction(function () use ($googleUser, $provider) {
                // dd($googleUser);

                // Cek apakah akun sosial ini sudah ada
                $socialiteAccount = SocialiteAccount::where('provider_name', $provider)
                    ->where('provider_id', $googleUser->getId())
                    ->first();

                if ($socialiteAccount) {
                    // Jika akun sosial sudah ada, kembalikan user yang terkait
                    return $socialiteAccount->user;
                }

                // Jika tidak, cek apakah user dengan email yang sama sudah ada
                $existingUser = User::where('email', $googleUser->getEmail())->first();

                if ($existingUser) {
                    // Jika user sudah ada, tautkan akun sosial ini ke user tersebut
                    $this->createSocialiteAccount($existingUser, $googleUser, $provider);
                    return $existingUser;
                }

                // Jika tidak ada user sama sekali, buat user baru dan akun sosialnya
                $newUser = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'password' => bcrypt(Str::random(32)), // Buat password acak
                    'role' => 'user',
                    'is_oauth' => true,
                    'email_verified_at' => now(),
                    'must_set_password' => true,
                ]);

                $this->createSocialiteAccount($newUser, $googleUser, $provider);

                event(new Registered($newUser));

                return $newUser;
            });

            Auth::login($user);

            if ($user->must_set_password) {
                return redirect()->route('password.create');
            }

            return redirect()->route('home');
        } catch (\Exception $e) {
            // Jika ada error (misal: user menolak), redirect kembali ke halaman login
            // Anda bisa menambahkan flash message di sini jika mau
            // Catat error detail ke dalam file log untuk developer.
            Log::error('Socialite Login Error: ' . $e->getMessage());

            // Tampilkan pesan umum ke user.
            return redirect()->route('login')
                ->with('status', 'Login with ' . ucfirst($provider) . ' failed. Please try again.');
        }
    }

    /**
     * Helper function untuk membuat record di tabel socialites.
     *
     * @param \App\Models\User $user
     * @param mixed $providerUser
     * @param string $provider
     * @return void
     */
    public function createSocialiteAccount(User $user, $providerUser, string $provider): void
    {
        $user->socialite()->create([
            'provider_id' => $providerUser->getId(),
            'provider_name' => $provider,
            'provider_token' => $providerUser->token,
            'provider_refresh_token' => $providerUser->refreshToken,
        ]);
    }
}
