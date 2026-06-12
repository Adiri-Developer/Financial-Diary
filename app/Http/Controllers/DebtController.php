<?php

namespace App\Http\Controllers;

use App\Models\Debt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DebtController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:debt,loan',
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'due_date' => 'nullable|date',
        ]);

        Auth::user()->debts()->create([
            'type' => $request->type,
            'name' => $request->name,
            'amount' => $request->amount,
            'due_date' => $request->due_date,
            'is_paid' => false,
        ]);

        return back()->with('success', 'Debt added successfully!');
    }
}
