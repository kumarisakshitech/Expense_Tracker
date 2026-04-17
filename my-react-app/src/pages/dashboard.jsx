import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Wallet, TrendingDown, PiggyBank, RefreshCw, Plus,
  TrendingUp, ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import GaugeCard from '../components/GaugeCard';
import Add from '../components/Add';
import { COLORS } from '../assets/color.jsx';

const StatCard = ({ title, value, icon: Icon, iconBg, iconColor, badge, badgeColor, sub }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">₹{Number(value || 0).toLocaleString('en-IN')}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className={`${iconBg} p-2.5 rounded-xl`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
    </div>
    {badge && (
      <div className="mt-3">
        <span className={`text-xs px-2 py-1 rounded-lg font-medium ${badgeColor}`}>{badge}</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState('expense');

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard');
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const openAdd = (type) => { setAddType(type); setShowAdd(true); };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const { monthlyIncome = 0, monthlyExpense = 0, savings = 0, savingsRate = 0,
    recentTransactions = [], expenseDistribution = [] } = data || {};

  const totalBalance = monthlyIncome - monthlyExpense;
  const recentIncome = recentTransactions.filter(t => t.type === 'income').slice(0, 5);
  const recentExpenses = recentTransactions.filter(t => t.type === 'expense').slice(0, 5);

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 backdrop-blur-lg rounded-2xl p-5 border border-white/30 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-700 bg-clip-text text-transparent">
              Finance Dashboard
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Welcome back, {user?.name} 👋</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openAdd('income')}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow transition-all">
              <Plus className="w-4 h-4" /> Add Income
            </button>
            <button onClick={() => openAdd('expense')}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow transition-all">
              <Plus className="w-4 h-4" /> Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Balance" value={totalBalance} icon={Wallet}
          iconBg="bg-teal-100" iconColor="text-teal-600"
          badge={`+₹${monthlyIncome.toLocaleString('en-IN')}  -₹${monthlyExpense.toLocaleString('en-IN')}`}
          badgeColor="bg-teal-50 text-teal-700" />
        <StatCard title="Monthly Income" value={monthlyIncome} icon={TrendingUp}
          iconBg="bg-green-100" iconColor="text-green-600"
          sub="This month" />
        <StatCard title="Monthly Expenses" value={monthlyExpense} icon={TrendingDown}
          iconBg="bg-orange-100" iconColor="text-orange-600"
          sub="This month" />
        <StatCard title="Savings Rate" value={savings} icon={PiggyBank}
          iconBg="bg-cyan-100" iconColor="text-cyan-600"
          badge={`${savingsRate}% of income`}
          badgeColor={savingsRate >= 20 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'} />
      </div>

      {/* Gauge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GaugeCard label="Income" value={monthlyIncome} total={monthlyIncome + monthlyExpense} color="teal" />
        <GaugeCard label="Spent" value={monthlyExpense} total={monthlyIncome + monthlyExpense} color="orange" />
        <GaugeCard label="Savings" value={savings > 0 ? savings : 0} total={monthlyIncome} color="cyan" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Transactions */}
        <div className="lg:col-span-2 space-y-5">
          {/* Recent Income */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-teal-500" />
                Recent Income
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-normal">This Month</span>
              </h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{recentIncome.length} records</span>
            </div>
            {recentIncome.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-teal-50 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-teal-300" />
                </div>
                <p className="text-gray-500 text-sm">No income transactions</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentIncome.map(t => (
                  <div key={t._id} className="flex items-center justify-between p-3 bg-teal-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{t.description}</p>
                      <p className="text-xs text-gray-500">{t.category} · {new Date(t.date).toLocaleDateString('en-IN')}</p>
                    </div>
                    <span className="font-bold text-teal-600 text-sm">+₹{Number(t.amount).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => navigate('/income')}
              className="mt-4 w-full py-2.5 text-teal-600 font-medium hover:bg-teal-50 rounded-xl transition-colors text-sm flex items-center justify-center gap-1">
              View all income →
            </button>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5 text-orange-500" />
                Recent Expenses
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-normal">This Month</span>
              </h3>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">{recentExpenses.length} records</span>
            </div>
            {recentExpenses.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-orange-50 flex items-center justify-center">
                  <TrendingDown className="w-7 h-7 text-orange-300" />
                </div>
                <p className="text-gray-500 text-sm">No expense transactions</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentExpenses.map(t => (
                  <div key={t._id} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{t.description}</p>
                      <p className="text-xs text-gray-500">{t.category} · {new Date(t.date).toLocaleDateString('en-IN')}</p>
                    </div>
                    <span className="font-bold text-orange-600 text-sm">-₹{Number(t.amount).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => navigate('/expenses')}
              className="mt-4 w-full py-2.5 text-orange-600 font-medium hover:bg-orange-50 rounded-xl transition-colors text-sm flex items-center justify-center gap-1">
              View all expenses →
            </button>
          </div>
        </div>

        {/* Right: Charts */}
        <div className="space-y-5">
          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-500" /> Recent Transactions
              </h3>
              <button onClick={fetchDashboard} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <RefreshCw className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-6">
                <Clock className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No recent transactions</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentTransactions.slice(0, 6).map(t => (
                  <div key={t._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{t.description}</p>
                      <p className="text-xs text-gray-400">{t.category}</p>
                    </div>
                    <span className={`text-sm font-bold flex-shrink-0 ml-2 ${t.type === 'income' ? 'text-teal-600' : 'text-orange-600'}`}>
                      {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Spending by Category */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-800 mb-1 flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-teal-500" /> Spending by Category
            </h3>
            <div className="flex gap-4 mb-4">
              <div className="flex-1 bg-teal-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Total Income</p>
                <p className="font-bold text-teal-600 text-sm">₹{monthlyIncome.toLocaleString('en-IN')}</p>
              </div>
              <div className="flex-1 bg-orange-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Total Expenses</p>
                <p className="font-bold text-orange-600 text-sm">₹{monthlyExpense.toLocaleString('en-IN')}</p>
              </div>
            </div>
            {expenseDistribution.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={expenseDistribution} dataKey="amount" nameKey="category"
                      cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                      {expenseDistribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {expenseDistribution.map((item, i) => (
                    <div key={item.category} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-gray-600">{item.category}</span>
                      </div>
                      <span className="font-medium text-gray-700">{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400 text-sm">No expense data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAdd && (
        <Add type={addType} onClose={() => setShowAdd(false)} onSuccess={fetchDashboard} />
      )}
    </div>
  );
};

export default Dashboard;
