import React, { useEffect, useState, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Plus, Download, TrendingUp, DollarSign, BarChart2 } from 'lucide-react';
import api from '../api/axios';
import Add from '../components/Add';
import TransactionItem from '../components/TransactionItem';

const RANGES = ['weekly', 'monthly', 'yearly'];

const StatCard = ({ title, value, icon: Icon, iconBg, iconColor, border }) => (
  <div className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 ${border}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">₹{Number(value || 0).toLocaleString('en-IN')}</p>
      </div>
      <div className={`${iconBg} p-2.5 rounded-xl`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
    </div>
  </div>
);

const Income = () => {
  const [overview, setOverview] = useState(null);
  const [allIncome, setAllIncome] = useState([]);
  const [range, setRange] = useState('monthly');
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const INCOME_CATEGORIES = ['All', 'Salary', 'Freelance', 'Investment', 'Gift', 'Other'];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ovRes, allRes] = await Promise.all([
        api.get(`/income/overview?range=${range}`),
        api.get('/income/get')
      ]);
      if (ovRes.data.success) setOverview(ovRes.data.data);
      if (allRes.data.success) setAllIncome(allRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDownload = async () => {
    try {
      const res = await api.get('/income/download', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url; a.download = 'income.xlsx'; a.click();
    } catch (err) { console.error(err); }
  };

  // Build chart data from all income grouped by date
  const chartData = (() => {
    const map = {};
    allIncome.forEach(i => {
      const d = new Date(i.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      map[d] = (map[d] || 0) + Number(i.amount);
    });
    return Object.entries(map).slice(-10).map(([date, amount]) => ({ date, amount }));
  })();

  const filtered = filter === 'All' ? allIncome : allIncome.filter(i => i.category === filter);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-teal-500" /> Income
            </h1>
            <p className="text-gray-500 text-sm mt-1">Track and manage your income sources</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDownload}
              className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow transition-all">
              <Plus className="w-4 h-4" /> Add Income
            </button>
          </div>
        </div>

        {/* Range selector */}
        <div className="flex justify-end mt-4">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {RANGES.map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-all ${range === r ? 'bg-teal-500 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Income" value={overview?.totalIncome} icon={DollarSign}
          iconBg="bg-green-100" iconColor="text-green-600" border="border-l-4 border-l-green-500" />
        <StatCard title="Average Income" value={overview?.averageIncome?.toFixed(0)} icon={BarChart2}
          iconBg="bg-blue-100" iconColor="text-blue-600" border="border-l-4 border-l-blue-500" />
        <StatCard title="Transactions" value={overview?.numberOfTransactions} icon={TrendingUp}
          iconBg="bg-purple-100" iconColor="text-purple-600" border="border-l-4 border-l-purple-500" />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Income Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
              <Area type="monotone" dataKey="amount" stroke="#0d9488" fill="url(#incomeGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Transaction List */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h3 className="text-lg font-bold text-gray-800">All Income Transactions</h3>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-300">
            {INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-50 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-teal-300" />
            </div>
            <p className="text-gray-500 font-medium">No income transactions yet</p>
            <p className="text-gray-400 text-sm mt-1">Add your first income to get started</p>
            <button onClick={() => setShowAdd(true)}
              className="mt-4 flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow mx-auto">
              <Plus className="w-4 h-4" /> Add Income
            </button>
          </div>
        ) : (
          <div>
            {filtered.map(item => (
              <TransactionItem key={item._id} item={item} type="income" onRefresh={fetchData} />
            ))}
          </div>
        )}
      </div>

      {showAdd && <Add type="income" onClose={() => setShowAdd(false)} onSuccess={fetchData} />}
    </div>
  );
};

export default Income;
