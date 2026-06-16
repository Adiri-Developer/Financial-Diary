import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function WalletsIndex({ wallets, assets, debts }) {
    const { flash, errors } = usePage().props;
    
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [showAssetModal, setShowAssetModal] = useState(false);
    const [showDebtModal, setShowDebtModal] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const walletForm = useForm({ name: '', balance: '' });
    const submitWallet = (e) => {
        e.preventDefault();
        walletForm.post(route('wallets.store'), {
            onSuccess: () => { setShowWalletModal(false); walletForm.reset(); }
        });
    };

    const assetForm = useForm({ name: '', value: '', purchase_date: '' });
    const submitAsset = (e) => {
        e.preventDefault();
        assetForm.post(route('assets.store'), {
            onSuccess: () => { setShowAssetModal(false); assetForm.reset(); }
        });
    };

    const debtForm = useForm({ name: '', type: 'debt', amount: '', due_date: '' });
    const submitDebt = (e) => {
        e.preventDefault();
        debtForm.post(route('debts.store'), {
            onSuccess: () => { setShowDebtModal(false); debtForm.reset(); }
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Accounts & Assets</h2>}
        >
            <Head title="Accounts & Assets" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {flash?.success && (
                        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                            {flash.success}
                        </div>
                    )}
                    {Object.keys(errors).length > 0 && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                            <ul className="list-disc pl-5">
                                {Object.values(errors).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Wallets Section */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">My Wallets</h3>
                            <button onClick={() => setShowWalletModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150 shadow-sm">
                                + Add Wallet
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {wallets.length > 0 ? wallets.map(wallet => (
                                <div key={wallet.id} className="bg-gradient-to-r from-blue-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg transform hover:-translate-y-1 transition duration-300">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">{wallet.name.toUpperCase()}</span>
                                        <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                    </div>
                                    <p className="text-blue-200 text-sm mb-1">Total Balance</p>
                                    <h4 className="text-2xl font-bold">{formatCurrency(wallet.balance)}</h4>
                                </div>
                            )) : (
                                <div className="col-span-3 text-center py-8 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                                    No wallets added yet. Click "+ Add Wallet" to create one.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Assets & Debts List */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                        {/* Assets */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Assets</h3>
                                <button onClick={() => setShowAssetModal(true)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">+ Add Asset</button>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {assets.length > 0 ? assets.map(asset => (
                                    <li key={asset.id} className="py-3 flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{asset.name}</p>
                                                <p className="text-xs text-gray-500">Purchased: {formatDate(asset.purchase_date)}</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-gray-800">{formatCurrency(asset.value)}</span>
                                    </li>
                                )) : (
                                    <li className="py-4 text-center text-sm text-gray-500">No assets found.</li>
                                )}
                            </ul>
                        </section>

                        {/* Debts */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Debts & Loans</h3>
                                <button onClick={() => setShowDebtModal(true)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">+ Add Debt</button>
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {debts.length > 0 ? debts.map(debt => (
                                    <li key={debt.id} className="py-3 flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-red-100 p-2 rounded-lg text-red-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{debt.name}</p>
                                                <p className="text-xs text-gray-500">Due: {formatDate(debt.due_date)}</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-red-600">- {formatCurrency(debt.amount)}</span>
                                    </li>
                                )) : (
                                    <li className="py-4 text-center text-sm text-gray-500">No debts found.</li>
                                )}
                            </ul>
                        </section>
                    </div>
                </div>

                {/* Wallet Modal */}
                {showWalletModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-transparent dark:border-slate-700 transition-colors duration-200 transform transition-all">
                            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Add New Wallet</h3>
                            <form onSubmit={submitWallet}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Wallet Name</label>
                                    <input type="text" value={walletForm.data.name} onChange={e => walletForm.setData('name', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400" placeholder="e.g. Bank BCA" required />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Balance (Rp)</label>
                                    <input type="number" value={walletForm.data.balance} onChange={e => walletForm.setData('balance', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400" placeholder="0" min="0" required />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button type="button" onClick={() => setShowWalletModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition duration-150">Cancel</button>
                                    <button type="submit" disabled={walletForm.processing} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition duration-150">Save Wallet</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Asset Modal */}
                {showAssetModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-transparent dark:border-slate-700 transition-colors duration-200 transform transition-all">
                            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Add New Asset</h3>
                            <form onSubmit={submitAsset}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asset Name</label>
                                    <input type="text" value={assetForm.data.name} onChange={e => assetForm.setData('name', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400" required />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Value (Rp)</label>
                                    <input type="number" value={assetForm.data.value} onChange={e => assetForm.setData('value', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400" min="0" required />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase Date</label>
                                    <input type="date" value={assetForm.data.purchase_date} onChange={e => assetForm.setData('purchase_date', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400" />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button type="button" onClick={() => setShowAssetModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition duration-150">Cancel</button>
                                    <button type="submit" disabled={assetForm.processing} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition duration-150">Save Asset</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Debt Modal */}
                {showDebtModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-transparent dark:border-slate-700 transition-colors duration-200 transform transition-all">
                            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Add New Debt / Loan</h3>
                            <form onSubmit={submitDebt}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                    <select value={debtForm.data.type} onChange={e => debtForm.setData('type', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400">
                                        <option value="debt">Debt (Hutang)</option>
                                        <option value="loan">Loan (Cicilan)</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                    <input type="text" value={debtForm.data.name} onChange={e => debtForm.setData('name', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400" required />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (Rp)</label>
                                    <input type="number" value={debtForm.data.amount} onChange={e => debtForm.setData('amount', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400" min="0" required />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                                    <input type="date" value={debtForm.data.due_date} onChange={e => debtForm.setData('due_date', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400" />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button type="button" onClick={() => setShowDebtModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition duration-150">Cancel</button>
                                    <button type="submit" disabled={debtForm.processing} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition duration-150">Save Debt</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
