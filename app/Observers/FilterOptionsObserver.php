<?php

namespace App\Observers;

use Illuminate\Support\Facades\Cache;

class FilterOptionsObserver
{
    // Metode ini akan dipanggil setiap kali model dibuat, diperbarui, atau dihapus.
    public function saved($model): void
    {
        Cache::forget('api.filter_options');
    }

    public function deleted($model): void
    {
        Cache::forget('api.filter_options');
    }
}
