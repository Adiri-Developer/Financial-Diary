<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = Auth::user()->transactions()->with(['category', 'fromWallet', 'toWallet'])->orderBy('date', 'desc')->get();
        $categories = Auth::user()->categories;
        $wallets = Auth::user()->wallets;
        $action = $request->query('action');
        
        $transactions->load('category', 'fromWallet', 'toWallet');

        return \Inertia\Inertia::render('Transactions/Index', compact('transactions', 'wallets', 'categories', 'action'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:income,outcome,transfer',
            'amount' => 'required|numeric|min:1',
            'date' => 'required|date',
            'description' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'from_wallet_id' => 'nullable|exists:wallets,id',
            'to_wallet_id' => 'nullable|exists:wallets,id',
        ]);

        DB::transaction(function () use ($request) {
            $transaction = Auth::user()->transactions()->create($request->all());

            if ($request->type === 'income' && $request->to_wallet_id) {
                $wallet = Wallet::find($request->to_wallet_id);
                $wallet->increment('balance', $request->amount);
            } elseif ($request->type === 'outcome' && $request->from_wallet_id) {
                $wallet = Wallet::find($request->from_wallet_id);
                $wallet->decrement('balance', $request->amount);
            } elseif ($request->type === 'transfer' && $request->from_wallet_id && $request->to_wallet_id) {
                $fromWallet = Wallet::find($request->from_wallet_id);
                $toWallet = Wallet::find($request->to_wallet_id);
                $fromWallet->decrement('balance', $request->amount);
                $toWallet->increment('balance', $request->amount);
            }
        });

        return back()->with('success', 'Transaction recorded successfully!');
    }
}
