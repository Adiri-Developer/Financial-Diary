<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BotTransactionController;

Route::middleware(['api', 'n8n.auth'])->prefix('bot')->group(function () {
    Route::post('/transactions', [BotTransactionController::class, 'store']);
});
