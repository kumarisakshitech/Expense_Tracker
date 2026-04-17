import React, { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { INCOME_CATEGORY_ICONS, EXPENSE_CATEGORY_ICONS } from '../assets/color.jsx';
import api from '../api/axios';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Housing', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Other'];

const TransactionItem = ({ item, type, onRefresh }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    description: item.description,
    amount: item.amount,
    category: item.category,
    date: item.date?.split('T')[0] || '',
  });
  const [loading, setLoading] = useState(false);

  const isIncome = type === 'income';
  const icons = isIncome ? INCOME_CATEGORY_ICONS : EXPENSE_CATEGORY_ICONS;
  const icon = icons[item.category] || icons['Other'];
  const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleDelete = async () => {
    if (!confirm('Delete this transaction?')) return;
    try {
      const endpoint = isIncome ? `/income/delete/${item._id}` : `/expense/delete/${item._id}`;
      await api.delete(endpoint);
      onRefresh?.();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const endpoint = isIncome ? `/income/update/${item._id}` : `/expense/update/${item._id}`;
      await api.put(endpoint, { ...form, amount: Number(form.amount) });
      setEditing(false);
      onRefresh?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const dateStr = new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  if (editing) {
    return (
      <div className={`p-4 rounded-xl border-2 ${isIncome ? 'border-teal-200 bg-teal-50' : 'border-orange-200 bg-orange-50'} mb-2`}>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <input
            className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
          />
          <input
            type="number"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            placeholder="Amount"
          />
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal-400"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="date"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600 disabled:opacity-60">
            <Check className="w-3 h-3" /> Save
          </button>
          <button onClick={() => setEditing(false)}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">
            <X className="w-3 h-3" /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all mb-2 group`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={`p-2 rounded-lg flex-shrink-0 ${isIncome ? 'bg-teal-100' : 'bg-orange-100'}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-800 text-sm truncate">{item.description}</p>
          <p className="text-xs text-gray-500">{item.category} · {dateStr}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`font-bold text-sm ${isIncome ? 'text-teal-600' : 'text-orange-600'}`}>
          {isIncome ? '+' : '-'}₹{Number(item.amount).toLocaleString('en-IN')}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setEditing(true)}
            className={`p-1.5 rounded-lg ${isIncome ? 'text-teal-600 hover:bg-teal-100' : 'text-orange-600 hover:bg-orange-100'}`}>
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleDelete}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-100">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
