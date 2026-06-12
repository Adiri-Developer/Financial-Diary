<x-app-layout>
    <div x-data="{ showWalletModal: false, showAssetModal: false, showDebtModal: false }">
        <x-slot name="header">
            <div class="flex justify-between items-center">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    {{ __('Accounts & Assets') }}
                </h2>
                <button @click="showWalletModal = true" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150">
                    + Add Wallet
                </button>
            </div>
        </x-slot>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                
                <!-- Session Status / Errors -->
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

                <!-- Wallets Section -->
                <section>
                    <h3 class="text-lg font-bold text-gray-800 mb-4">My Wallets</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        @forelse($wallets as $wallet)
                            <div class="bg-gradient-to-r from-blue-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg transform hover:-translate-y-1 transition duration-300">
                                <div class="flex justify-between items-center mb-6">
                                    <span class="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">{{ strtoupper($wallet->name) }}</span>
                                    <svg class="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                </div>
                                <p class="text-blue-200 text-sm mb-1">Total Balance</p>
                                <h4 class="text-2xl font-bold">Rp {{ number_format($wallet->balance, 0, ',', '.') }}</h4>
                            </div>
                        @empty
                            <div class="col-span-3 text-center py-8 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                                No wallets added yet. Click "+ Add Wallet" to create one.
                            </div>
                        @endforelse
                    </div>
                </section>

                <!-- Assets & Debts List -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    <!-- Assets -->
                    <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-lg font-bold text-gray-800">Assets</h3>
                            <button @click="showAssetModal = true" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">+ Add Asset</button>
                        </div>
                        <ul class="divide-y divide-gray-100">
                            @forelse($assets as $asset)
                            <li class="py-3 flex justify-between items-center">
                                <div class="flex items-center space-x-3">
                                    <div class="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-gray-800">{{ $asset->name }}</p>
                                        <p class="text-xs text-gray-500">Purchased: {{ $asset->purchase_date ? $asset->purchase_date->format('M Y') : 'N/A' }}</p>
                                    </div>
                                </div>
                                <span class="font-semibold text-gray-800">Rp {{ number_format($asset->value, 0, ',', '.') }}</span>
                            </li>
                            @empty
                            <li class="py-4 text-center text-sm text-gray-500">No assets found.</li>
                            @endforelse
                        </ul>
                    </section>

                    <!-- Debts -->
                    <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-lg font-bold text-gray-800">Debts & Loans</h3>
                            <button @click="showDebtModal = true" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">+ Add Debt</button>
                        </div>
                        <ul class="divide-y divide-gray-100">
                            @forelse($debts as $debt)
                            <li class="py-3 flex justify-between items-center">
                                <div class="flex items-center space-x-3">
                                    <div class="bg-red-100 p-2 rounded-lg text-red-600">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-gray-800">{{ $debt->name }}</p>
                                        <p class="text-xs text-gray-500">Due: {{ $debt->due_date ? $debt->due_date->format('d M Y') : 'N/A' }}</p>
                                    </div>
                                </div>
                                <span class="font-semibold text-red-600">- Rp {{ number_format($debt->amount, 0, ',', '.') }}</span>
                            </li>
                            @empty
                            <li class="py-4 text-center text-sm text-gray-500">No debts found.</li>
                            @endforelse
                        </ul>
                    </section>
                </div>
            </div>
        </div>

        <!-- Wallet Modal -->
        <div x-show="showWalletModal" style="display: none" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all" @click.away="showWalletModal = false">
                <h3 class="text-lg font-bold mb-4 text-gray-800">Add New Wallet</h3>
                <form action="{{ route('wallets.store') }}" method="POST">
                    @csrf
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Wallet Name</label>
                        <input type="text" name="name" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="e.g. Bank BCA" required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Initial Balance (Rp)</label>
                        <input type="number" name="balance" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="0" min="0" required>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="showWalletModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                        <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Save Wallet</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Asset Modal -->
        <div x-show="showAssetModal" style="display: none" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" @click.away="showAssetModal = false">
                <h3 class="text-lg font-bold mb-4 text-gray-800">Add New Asset</h3>
                <form action="{{ route('assets.store') }}" method="POST">
                    @csrf
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                        <input type="text" name="name" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Value (Rp)</label>
                        <input type="number" name="value" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500" min="0" required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                        <input type="date" name="purchase_date" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="showAssetModal = false" class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg">Save Asset</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Debt Modal -->
        <div x-show="showDebtModal" style="display: none" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" @click.away="showDebtModal = false">
                <h3 class="text-lg font-bold mb-4 text-gray-800">Add New Debt / Loan</h3>
                <form action="{{ route('debts.store') }}" method="POST">
                    @csrf
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select name="type" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            <option value="debt">Debt (Hutang)</option>
                            <option value="loan">Loan (Cicilan)</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input type="text" name="name" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Amount (Rp)</label>
                        <input type="number" name="amount" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500" min="0" required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input type="date" name="due_date" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="showDebtModal = false" class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" class="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg">Save Debt</button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</x-app-layout>
