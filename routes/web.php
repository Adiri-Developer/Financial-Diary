<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\FinancialGoalController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\DebtController;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $user = \Illuminate\Support\Facades\Auth::user();
        $totalBalance = $user->wallets->sum('balance');
        $incomeThisMonth = $user->transactions()->where('type', 'income')->whereMonth('date', date('m'))->sum('amount');
        $outcomeThisMonth = $user->transactions()->where('type', 'outcome')->whereMonth('date', date('m'))->sum('amount');
        return view('dashboard', compact('totalBalance', 'incomeThisMonth', 'outcomeThisMonth'));
    })->name('dashboard');

    Route::resource('transactions', TransactionController::class);
    Route::resource('wallets', WalletController::class);
    Route::resource('budgets', BudgetController::class);
    Route::resource('financial-goals', FinancialGoalController::class);
    Route::resource('assets', AssetController::class);
    Route::resource('debts', DebtController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy']);
    
    Route::get('/hermes', [\App\Http\Controllers\HermesChatController::class, 'index'])->name('hermes.index');
    Route::post('/hermes/message', [\App\Http\Controllers\HermesChatController::class, 'sendMessage'])->name('hermes.sendMessage');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
