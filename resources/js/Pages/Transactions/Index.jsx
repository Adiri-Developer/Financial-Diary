import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function TransactionsIndex({ transactions, wallets, categories, action }) {
    const { flash, errors } = usePage().props;

    const [showIncomeModal, setShowIncomeModal] = useState(action === 'income');
    const [showOutcomeModal, setShowOutcomeModal] = useState(action === 'outcome');

    useEffect(() => {
        if (action === 'income') setShowIncomeModal(true);
        if (action === 'outcome') setShowOutcomeModal(true);
    }, [action]);

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

    const incomeForm = useForm({
        type: 'income',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        description: '',
        category_id: '',
        to_wallet_id: ''
    });

    const submitIncome = (e) => {
        e.preventDefault();
        incomeForm.post(route('transactions.store'), {
            onSuccess: () => { setShowIncomeModal(false); incomeForm.reset(); }
        });
    };

    const outcomeForm = useForm({
        type: 'outcome',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        description: '',
        category_id: '',
        from_wallet_id: ''
    });

    const submitOutcome = (e) => {
        e.preventDefault();
        outcomeForm.post(route('transactions.store'), {
            onSuccess: () => { setShowOutcomeModal(false); outcomeForm.reset(); }
        });
    };

    const incomeCategories = categories.filter(c => c.type === 'income');
    const outcomeCategories = categories.filter(c => c.type === 'outcome');

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Transactions</h2>}
        >
            <Head title="Transactions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 dark:bg-slate-900/50 space-y-4 sm:space-y-0">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Recent Transactions</h3>
                            <div className="space-x-2">
                                <button onClick={() => setShowOutcomeModal(true)} className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150 shadow-sm">
                                    - Outcome
                                </button>
                                <button onClick={() => setShowIncomeModal(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150 shadow-sm">
                                    + Income
                                </button>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                        <th className="py-4 px-6">Date</th>
                                        <th className="py-4 px-6">Description</th>
                                        <th className="py-4 px-6">Category</th>
                                        <th className="py-4 px-6">Wallet</th>
                                        <th className="py-4 px-6 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {transactions.length > 0 ? transactions.map(trx => (
                                        <tr key={trx.id} className="hover:bg-indigo-50/50 transition duration-150">
                                            <td className="py-4 px-6 text-gray-500">{formatDate(trx.date)}</td>
                                            <td className="py-4 px-6 font-medium text-gray-800">{trx.description}</td>
                                            <td className="py-4 px-6">
                                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                                    {trx.category ? trx.category.name : 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-gray-500">
                                                {trx.type === 'income' ? (trx.to_wallet ? trx.to_wallet.name : '-') : (trx.from_wallet ? trx.from_wallet.name : '-')}
                                            </td>
                                            <td className={`py-4 px-6 text-right font-semibold ${trx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {trx.type === 'income' ? '+' : '-'} {formatCurrency(trx.amount)}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-gray-500">No transactions recorded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Income Modal */}
            {showIncomeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-transparent dark:border-slate-700 transition-colors duration-200">
                        <h3 className="text-lg font-bold mb-4 text-emerald-600 dark:text-emerald-400">Add Income</h3>
                        <form onSubmit={submitIncome}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                                <input type="date" value={incomeForm.data.date} onChange={e => incomeForm.setData('date', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-emerald-500 dark:focus:border-emerald-400" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (Rp)</label>
                                <input type="number" value={incomeForm.data.amount} onChange={e => incomeForm.setData('amount', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-emerald-500 dark:focus:border-emerald-400" min="1" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <input type="text" value={incomeForm.data.description} onChange={e => incomeForm.setData('description', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-emerald-500 dark:focus:border-emerald-400" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                <select value={incomeForm.data.category_id} onChange={e => incomeForm.setData('category_id', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-emerald-500 dark:focus:border-emerald-400">
                                    <option value="">Select Category</option>
                                    {incomeCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Wallet</label>
                                <select value={incomeForm.data.to_wallet_id} onChange={e => incomeForm.setData('to_wallet_id', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-emerald-500 dark:focus:border-emerald-400" required>
                                    <option value="">Select Wallet</option>
                                    {wallets.map(wallet => (
                                        <option key={wallet.id} value={wallet.id}>{wallet.name} ({formatCurrency(wallet.balance)})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowIncomeModal(false)} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition duration-150">Cancel</button>
                                <button type="submit" disabled={incomeForm.processing} className="px-4 py-2 text-sm text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition duration-150">Save Income</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Outcome Modal */}
            {showOutcomeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-transparent dark:border-slate-700 transition-colors duration-200">
                        <h3 className="text-lg font-bold mb-4 text-rose-600 dark:text-rose-400">Add Outcome</h3>
                        <form onSubmit={submitOutcome}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                                <input type="date" value={outcomeForm.data.date} onChange={e => outcomeForm.setData('date', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-rose-500 dark:focus:border-rose-400" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (Rp)</label>
                                <input type="number" value={outcomeForm.data.amount} onChange={e => outcomeForm.setData('amount', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-rose-500 dark:focus:border-rose-400" min="1" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <input type="text" value={outcomeForm.data.description} onChange={e => outcomeForm.setData('description', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-rose-500 dark:focus:border-rose-400" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                <select value={outcomeForm.data.category_id} onChange={e => outcomeForm.setData('category_id', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-rose-500 dark:focus:border-rose-400">
                                    <option value="">Select Category</option>
                                    {outcomeCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Wallet</label>
                                <select value={outcomeForm.data.from_wallet_id} onChange={e => outcomeForm.setData('from_wallet_id', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-rose-500 dark:focus:border-rose-400" required>
                                    <option value="">Select Wallet</option>
                                    {wallets.map(wallet => (
                                        <option key={wallet.id} value={wallet.id}>{wallet.name} ({formatCurrency(wallet.balance)})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowOutcomeModal(false)} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition duration-150">Cancel</button>
                                <button type="submit" disabled={outcomeForm.processing} className="px-4 py-2 text-sm text-white bg-rose-500 rounded-lg hover:bg-rose-600 disabled:opacity-50 transition duration-150">Save Outcome</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
