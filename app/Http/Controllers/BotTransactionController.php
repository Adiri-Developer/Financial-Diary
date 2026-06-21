<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Wallet;
use App\Models\User;

class BotTransactionController extends Controller
{
    /**
     * Store a newly created transaction via AI Bot.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'wallet_id' => 'required|exists:wallets,id',
            'category_id' => 'nullable|exists:categories,id',
            'type' => 'required|in:income,outcome,transfer',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'title' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $user = User::findOrFail($validated['user_id']);
        $wallet = Wallet::where('user_id', $user->id)->findOrFail($validated['wallet_id']);

        if ($validated['category_id']) {
            // Verify category belongs to user
            \App\Models\Category::where('user_id', $user->id)->findOrFail($validated['category_id']);
        }

        // Handle Wallet Balance Update
        if ($validated['type'] === 'income') {
            $wallet->balance += $validated['amount'];
        } elseif ($validated['type'] === 'outcome') {
            $wallet->balance -= $validated['amount'];
        }

        $wallet->save();

        // Create transaction
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'wallet_id' => $wallet->id,
            'category_id' => $validated['category_id'] ?? null,
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'date' => $validated['date'],
            'title' => $validated['title'],
            'notes' => $validated['notes'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Transaction successfully recorded.',
            'data' => $transaction
        ]);
    }
}
