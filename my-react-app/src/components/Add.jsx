import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/axios';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Housing', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Other'];

const Add = ({ type = 'expense', onClose, onSuccess }) => {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ description: '', amount: '', category: '', date: today });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isIncome = type === 'income';
  const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const accentColor = isIncome ? 'teal' : 'orange';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.description || !form.amount || !form.category || !form.date) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    try {
      const endpoint = isIncome ? '/income/add' : '/expense/add';
      const { data } = await api.post(endpoint, { ...form, amount: Number(form.amount) });
      if (data.success) {
        onSuccess?.();
        onClose?.();
      } else {
        setError(data.message || 'Failed to add');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-800">
            Add {isIncome ? 'Income' : 'Expense'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Monthly salary"
              className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-${accentColor}-400 text-sm`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-${accentColor}-400 text-sm`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-${accentColor}-400 text-sm bg-white`}
            >
              <option value="">Select category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-${accentColor}-400 text-sm`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-medium text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 ${
              isIncome
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
            }`}
          >
            {loading && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
            {loading ? 'Adding...' : `Add ${isIncome ? 'Income' : 'Expense'}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
