<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\FinancialGoal;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BudgetController extends Controller
{
    public function index()
    {
        $budgets = Auth::user()->budgets()->with('category')->get();
        $goals = Auth::user()->financialGoals;
        $categories = Auth::user()->categories()->where('type', 'outcome')->get();

        return view('budgets.index', compact('budgets', 'goals', 'categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric|min:1',
            'month' => 'required|date_format:Y-m',
        ]);

        Auth::user()->budgets()->create($request->all());

        return back()->with('success', 'Budget set successfully!');
    }
}
