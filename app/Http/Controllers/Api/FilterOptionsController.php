<?php

namespace App\Http\Controllers\Api;

use App\Models\Origin;
use App\Models\Process;
use App\Models\BrewMethod;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FilterOptionsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return response()->json([
            'origins' => Origin::select('id', 'origin_name')->get(),
            'processes' => Process::select('id', 'process_name')->get(),
            'brewMethods' => BrewMethod::select('id', 'brew_name')->get(),
            'types' => ['Single Origin', 'House Blend', 'Microlot', 'Commercial'], // Ambil dari ENUM
        ]);
    }
}
