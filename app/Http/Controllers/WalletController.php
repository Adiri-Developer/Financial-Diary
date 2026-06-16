<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Models\Asset;
use App\Models\Debt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WalletController extends Controller
{
    public function index()
    {
        $wallets = Auth::user()->wallets;
        $assets = Auth::user()->assets;
        $debts = Auth::user()->debts;

        return \Inertia\Inertia::render('Wallets/Index', compact('wallets', 'assets', 'debts'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'balance' => 'required|numeric|min:0',
        ]);

        Auth::user()->wallets()->create([
            'name' => $request->name,
            'balance' => $request->balance,
        ]);

        return back()->with('success', 'Wallet added successfully!');
    }
}
