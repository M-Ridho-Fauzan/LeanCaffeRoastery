<?php

namespace App\Http\Controllers\Contens\Menus\Publics;

use App\Models\Origin;
use App\Models\Process;
use App\Models\Product;
use App\Models\BrewMethod;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;

class FilterOptionsController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @tujuan : adalah sebuah dedicated API endpoint yang bertanggung jawab hanya untuk menyediakan daftar opsi-opsi yang dapat digunakan pengguna untuk melakukan filter pada daftar produk.
     */
    public function __invoke(Request $request)
    {
        // Cache akan disimpan selamanya sampai Anda membersihkannya secara manual (misal: saat ada origin baru).
        $data = Cache::rememberForever('api.filter_options', function () {
            return [
                'origins'     => Origin::select('id', 'origin_name')->orderBy('origin_name')->get(),
                'processes'   => Process::select('id', 'process_name')->orderBy('process_name')->get(),
                'brewMethods' => BrewMethod::select('id', 'brew_name')->orderBy('brew_name')->get(),
                'types'       => Product::TYPES,
            ];
        });

        return response()->json($data);
    }
}
