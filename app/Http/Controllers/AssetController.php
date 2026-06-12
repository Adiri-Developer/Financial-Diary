<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssetController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'value' => 'required|numeric|min:0',
            'purchase_date' => 'nullable|date',
        ]);

        Auth::user()->assets()->create([
            'name' => $request->name,
            'value' => $request->value,
            'purchase_date' => $request->purchase_date,
        ]);

        return back()->with('success', 'Asset added successfully!');
    }
}
