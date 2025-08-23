<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BrewMethod;
use App\Models\Origin;
use App\Models\Process;
use Illuminate\Http\JsonResponse;

class FilterOptionsControllerss extends Controller
{
    /**
     * Mengembalikan semua data yang diperlukan untuk filter produk.
     */
    public function index(): JsonResponse
    {
        // Ambil semua data master. Gunakan cache untuk performa jika data jarang berubah.
        $brewMethods = BrewMethod::orderBy('brew_name')->get(['id', 'brew_name']);
        $origins = Origin::orderBy('origin_name')->get(['id', 'origin_name']);
        $processes = Process::orderBy('process_name')->get(['id', 'process_name']);
        $types = ['Single Origin', 'House Blend', 'Microlot', 'Commercial'];

        return response()->json([
            'brewMethods' => $brewMethods,
            'origins' => $origins,
            'processes' => $processes,
            'types' => $types,
        ]);
    }
}
