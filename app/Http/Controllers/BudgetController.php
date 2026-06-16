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
        $budgets = Auth::user()->budgets;
        $goals = Auth::user()->financialGoals;
        $categories = Auth::user()->categories()->where('type', 'outcome')->get();

        $budgets->load('category');

        return \Inertia\Inertia::render('Budgets/Index', compact('budgets', 'categories', 'goals'));
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
