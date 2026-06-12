<x-app-layout>
    <div x-data="{ showBudgetModal: false, showGoalModal: false }">
        <x-slot name="header">
            <div class="flex justify-between items-center">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    {{ __('Planning & Goals') }}
                </h2>
            </div>
        </x-slot>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                
                @if (session('success'))
                    <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                        {{ session('success') }}
                    </div>
                @endif
                @if ($errors->any())
                    <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                        <ul class="list-disc pl-5">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <!-- Budgets Section -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-bold text-gray-800">Monthly Budgets ({{ date('F Y') }})</h3>
                        <button @click="showBudgetModal = true" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150">
                            + Create Budget
                        </button>
                    </div>
                    
                    <div class="space-y-6">
                        @forelse($budgets as $budget)
                        @php 
                            $spent = 0; 
                            $percentage = $budget->amount > 0 ? min(100, ($spent / $budget->amount) * 100) : 0;
                        @endphp
                        <div>
                            <div class="flex justify-between items-end mb-2">
                                <div>
                                    <h4 class="font-semibold text-gray-800">{{ $budget->category ? $budget->category->name : 'Unknown' }}</h4>
                                    <p class="text-xs text-gray-500">Rp {{ number_format($spent, 0, ',', '.') }} / Rp {{ number_format($budget->amount, 0, ',', '.') }}</p>
                                </div>
                                <span class="text-sm font-bold {{ $percentage >= 90 ? 'text-rose-500' : 'text-indigo-600' }}">{{ round($percentage) }}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2.5">
                                <div class="{{ $percentage >= 90 ? 'bg-rose-500' : 'bg-indigo-600' }} h-2.5 rounded-full" style="width: {{ $percentage }}%"></div>
                            </div>
                        </div>
                        @empty
                            <p class="text-gray-500 text-sm text-center py-4">No budgets set for this month.</p>
                        @endforelse
                    </div>
                </section>

                <!-- Financial Goals Section -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-bold text-gray-800">Financial Goals</h3>
                        <button @click="showGoalModal = true" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150">
                            + Set New Goal
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        @forelse($goals as $goal)
                        @php
                            $percentage = $goal->target_amount > 0 ? min(100, ($goal->current_amount / $goal->target_amount) * 100) : 0;
                        @endphp
                        <div class="border border-gray-200 rounded-xl p-5 hover:shadow-md transition duration-200">
                            <div class="flex items-center space-x-4 mb-4">
                                <div class="bg-blue-100 p-3 rounded-xl text-blue-600">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                </div>
                                <div>
                                    <h4 class="font-bold text-gray-800">{{ $goal->name }}</h4>
                                    <p class="text-xs text-gray-500">Target: {{ $goal->deadline ? $goal->deadline->format('M Y') : 'N/A' }}</p>
                                </div>
                            </div>
                            <div class="mb-2 flex justify-between text-sm">
                                <span class="font-medium text-gray-600">Rp {{ number_format($goal->current_amount, 0, ',', '.') }}</span>
                                <span class="text-gray-400">of Rp {{ number_format($goal->target_amount, 0, ',', '.') }}</span>
                            </div>
                            <div class="w-full bg-gray-100 rounded-full h-2">
                                <div class="bg-emerald-500 h-2 rounded-full" style="width: {{ $percentage }}%"></div>
                            </div>
                            <p class="text-xs text-right text-emerald-600 font-semibold mt-2">{{ round($percentage) }}% Achieved</p>
                        </div>
                        @empty
                            <div class="col-span-2 text-center text-sm text-gray-500 py-4">No financial goals set.</div>
                        @endforelse
                    </div>
                </section>
                
            </div>
        </div>

        <!-- Create Budget Modal -->
        <div x-show="showBudgetModal" style="display: none" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" @click.away="showBudgetModal = false">
                <h3 class="text-lg font-bold mb-4 text-indigo-600">Set Monthly Budget</h3>
                <form action="{{ route('budgets.store') }}" method="POST">
                    @csrf
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Month</label>
                        <input type="month" name="month" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500" value="{{ date('Y-m') }}" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select name="category_id" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500" required>
                            <option value="">Select Outcome Category</option>
                            @foreach($categories as $cat)
                                <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Budget Limit (Rp)</label>
                        <input type="number" name="amount" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500" min="1" required>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="showBudgetModal = false" class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Save Budget</button>
                    </div>
                </form>
            </div>
        </div>
        
    </div>
</x-app-layout>
