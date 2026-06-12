<x-app-layout>
    <div x-data="{ showIncomeModal: false, showOutcomeModal: false }">
        <x-slot name="header">
            <div class="flex justify-between items-center">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    {{ __('Transactions') }}
                </h2>
                <div class="space-x-2">
                    <button @click="showOutcomeModal = true" class="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150 shadow-sm">
                        - Outcome
                    </button>
                    <button @click="showIncomeModal = true" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150 shadow-sm">
                        + Income
                    </button>
                </div>
            </div>
        </x-slot>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
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

                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 class="text-lg font-bold text-gray-800">Recent Transactions</h3>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                    <th class="py-4 px-6">Date</th>
                                    <th class="py-4 px-6">Description</th>
                                    <th class="py-4 px-6">Category</th>
                                    <th class="py-4 px-6">Wallet</th>
                                    <th class="py-4 px-6 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 text-sm">
                                @forelse($transactions as $trx)
                                <tr class="hover:bg-indigo-50/50 transition duration-150">
                                    <td class="py-4 px-6 text-gray-500">{{ \Carbon\Carbon::parse($trx->date)->format('d M Y') }}</td>
                                    <td class="py-4 px-6 font-medium text-gray-800">{{ $trx->description }}</td>
                                    <td class="py-4 px-6">
                                        <span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                            {{ $trx->category ? $trx->category->name : 'Uncategorized' }}
                                        </span>
                                    </td>
                                    <td class="py-4 px-6 text-gray-500">
                                        {{ $trx->type == 'income' ? ($trx->toWallet ? $trx->toWallet->name : '-') : ($trx->fromWallet ? $trx->fromWallet->name : '-') }}
                                    </td>
                                    <td class="py-4 px-6 text-right font-semibold {{ $trx->type == 'income' ? 'text-emerald-500' : 'text-rose-500' }}">
                                        {{ $trx->type == 'income' ? '+' : '-' }} Rp {{ number_format($trx->amount, 0, ',', '.') }}
                                    </td>
                                </tr>
                                @empty
                                <tr>
                                    <td colspan="5" class="py-8 text-center text-gray-500">No transactions recorded yet.</td>
                                </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Income Modal -->
        <div x-show="showIncomeModal" style="display: none" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" @click.away="showIncomeModal = false">
                <h3 class="text-lg font-bold mb-4 text-emerald-600">Add Income</h3>
                <form action="{{ route('transactions.store') }}" method="POST">
                    @csrf
                    <input type="hidden" name="type" value="income">
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" name="date" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-emerald-500" value="{{ date('Y-m-d') }}" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Amount (Rp)</label>
                        <input type="number" name="amount" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-emerald-500" min="1" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input type="text" name="description" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-emerald-500" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select name="category_id" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-emerald-500">
                            <option value="">Select Category</option>
                            @foreach($categories->where('type', 'income') as $cat)
                                <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">To Wallet</label>
                        <select name="to_wallet_id" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-emerald-500" required>
                            @foreach($wallets as $wallet)
                                <option value="{{ $wallet->id }}">{{ $wallet->name }} (Rp {{ number_format($wallet->balance, 0, ',', '.') }})</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="showIncomeModal = false" class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 text-sm text-white bg-emerald-500 rounded-lg hover:bg-emerald-600">Save Income</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Add Outcome Modal -->
        <div x-show="showOutcomeModal" style="display: none" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" @click.away="showOutcomeModal = false">
                <h3 class="text-lg font-bold mb-4 text-rose-600">Add Outcome</h3>
                <form action="{{ route('transactions.store') }}" method="POST">
                    @csrf
                    <input type="hidden" name="type" value="outcome">
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" name="date" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-rose-500" value="{{ date('Y-m-d') }}" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Amount (Rp)</label>
                        <input type="number" name="amount" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-rose-500" min="1" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input type="text" name="description" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-rose-500" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select name="category_id" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-rose-500">
                            <option value="">Select Category</option>
                            @foreach($categories->where('type', 'outcome') as $cat)
                                <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">From Wallet</label>
                        <select name="from_wallet_id" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-rose-500" required>
                            @foreach($wallets as $wallet)
                                <option value="{{ $wallet->id }}">{{ $wallet->name }} (Rp {{ number_format($wallet->balance, 0, ',', '.') }})</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="showOutcomeModal = false" class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 text-sm text-white bg-rose-500 rounded-lg hover:bg-rose-600">Save Outcome</button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</x-app-layout>
