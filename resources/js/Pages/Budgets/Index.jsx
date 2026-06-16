import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function BudgetsIndex({ budgets, goals, categories }) {
    const { flash, errors } = usePage().props;

    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false); // To be implemented if we have Financial Goals

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDateMonth = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const budgetForm = useForm({
        month: new Date().toISOString().slice(0, 7), // YYYY-MM
        category_id: '',
        amount: ''
    });

    const submitBudget = (e) => {
        e.preventDefault();
        budgetForm.post(route('budgets.store'), {
            onSuccess: () => { setShowBudgetModal(false); budgetForm.reset(); }
        });
    };

    const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Planning & Goals</h2>}
        >
            <Head title="Planning & Goals" />

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

                    {/* Budgets Section */}
                    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 transition-colors duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Monthly Budgets ({currentMonthName})</h3>
                            <button onClick={() => setShowBudgetModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150">
                                + Create Budget
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            {budgets.length > 0 ? budgets.map(budget => {
                                const spent = 0; // Simulated for now since transactions logic isn't wired yet
                                const percentage = budget.amount > 0 ? Math.min(100, (spent / budget.amount) * 100) : 0;
                                return (
                                    <div key={budget.id}>
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{budget.category ? budget.category.name : 'Unknown'}</h4>
                                                <p className="text-xs text-gray-500">{formatCurrency(spent)} / {formatCurrency(budget.amount)}</p>
                                            </div>
                                            <span className={`text-sm font-bold ${percentage >= 90 ? 'text-rose-500' : 'text-indigo-600'}`}>{Math.round(percentage)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className={`${percentage >= 90 ? 'bg-rose-500' : 'bg-indigo-600'} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <p className="text-gray-500 text-sm text-center py-4">No budgets set for this month.</p>
                            )}
                        </div>
                    </section>

                    {/* Financial Goals Section */}
                    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 transition-colors duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Financial Goals</h3>
                            <button onClick={() => setShowGoalModal(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150">
                                + Set New Goal
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {goals && goals.length > 0 ? goals.map(goal => {
                                const percentage = goal.target_amount > 0 ? Math.min(100, (goal.current_amount / goal.target_amount) * 100) : 0;
                                return (
                                    <div key={goal.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition duration-200">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 dark:text-gray-100">{goal.name}</h4>
                                                <p className="text-xs text-gray-500">Target: {formatDateMonth(goal.deadline)}</p>
                                            </div>
                                        </div>
                                        <div className="mb-2 flex justify-between text-sm">
                                            <span className="font-medium text-gray-600">{formatCurrency(goal.current_amount)}</span>
                                            <span className="text-gray-400">of {formatCurrency(goal.target_amount)}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <p className="text-xs text-right text-emerald-600 font-semibold mt-2">{Math.round(percentage)}% Achieved</p>
                                    </div>
                                );
                            }) : (
                                <div className="col-span-2 text-center text-sm text-gray-500 py-4">No financial goals set.</div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Create Budget Modal */}
                {showBudgetModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-transparent dark:border-slate-700 transition-colors duration-200">
                            <h3 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-400">Set Monthly Budget</h3>
                            <form onSubmit={submitBudget}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
                                    <input type="month" value={budgetForm.data.month} onChange={e => budgetForm.setData('month', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400" required />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                    <select value={budgetForm.data.category_id} onChange={e => budgetForm.setData('category_id', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400" required>
                                        <option value="">Select Outcome Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget Limit (Rp)</label>
                                    <input type="number" value={budgetForm.data.amount} onChange={e => budgetForm.setData('amount', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400" min="1" required />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button type="button" onClick={() => setShowBudgetModal(false)} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition duration-150">Cancel</button>
                                    <button type="submit" disabled={budgetForm.processing} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition duration-150">Save Budget</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
