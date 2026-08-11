import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Plus, ArrowRight, Tag } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { formatCurrency, formatDate, getErrorMessage, CHART_COLORS } from '../utils/formatters';
import SummaryCard from '../components/SummaryCard';
import { SkeletonCard } from '../components/Skeleton';
import TransactionModal from '../components/TransactionModal';
import Button from '../components/Button';
import ExpenseTargetCard from '../components/ExpenseTargetCard';
import ExpenseTargetModal from '../components/ExpenseTargetModal';
import { useExpenseTarget } from '../context/ExpenseTargetContext';

// Custom tooltip for area chart
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

// Custom label for pie chart
const renderCustomLabel = ({ name, percent }) =>
  percent > 0.04 ? `${(percent * 100).toFixed(0)}%` : '';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTxModal, setShowTxModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [txModalType, setTxModalType] = useState('EXPENSE');
  const { fetchTargetStatus } = useExpenseTarget();

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await dashboardService.getSummary();
      setDashboardData(res.data.data);
      await fetchTargetStatus();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [fetchTargetStatus]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const openAddModal = (type) => {
    setTxModalType(type);
    setShowTxModal(true);
  };

  const { summary, monthlyData, categoryBreakdown, recentTransactions } = dashboardData || {};

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your financial overview at a glance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => openAddModal('EXPENSE')}
          >
            <Plus size={15} /> Add Expense
          </Button>
          <Button size="sm" onClick={() => openAddModal('INCOME')}>
            <Plus size={15} /> Add Income
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <SummaryCard
              type="income"
              title="Total Income"
              amount={summary?.totalIncome || 0}
              subtitle="All time"
            />
            <SummaryCard
              type="expense"
              title="Total Expenses"
              amount={summary?.totalExpenses || 0}
              subtitle="All time"
            />
            <SummaryCard
              type="balance"
              title="Current Balance"
              amount={summary?.balance || 0}
              subtitle="Income − Expenses"
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart — income vs expenses over time */}
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Income vs Expenses</h2>
            <p className="text-xs text-slate-400 mt-0.5">Last 6 months</p>
          </div>
          {isLoading ? (
            <div className="h-52 skeleton rounded-lg" />
          ) : !monthlyData?.length ? (
            <div className="h-52 flex items-center justify-center text-sm text-slate-400">
              No data yet — add transactions to see your trends
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#colorIncome)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fill="url(#colorExpenses)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart — expense breakdown */}
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Expense Breakdown</h2>
            <p className="text-xs text-slate-400 mt-0.5">By category</p>
          </div>
          {isLoading ? (
            <div className="h-52 skeleton rounded-lg" />
          ) : !categoryBreakdown?.length ? (
            <div className="h-52 flex items-center justify-center text-sm text-slate-400 text-center px-4">
              No expense data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {categoryBreakdown.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Expense Target */}
        <div className="lg:col-span-1">
          <ExpenseTargetCard onEdit={() => setShowTargetModal(true)} />
        </div>

        {/* Recent Transactions */}
        <div className="card overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Recent Transactions</h2>
              <p className="text-xs text-slate-400 mt-0.5">Your latest activity</p>
            </div>
            <button
              onClick={() => navigate('/transactions')}
              className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View all <ArrowRight size={13} />
            </button>
          </div>

          {isLoading ? (
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 animate-pulse">
                  <div className="skeleton w-8 h-8 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="skeleton h-3.5 w-32" />
                    <div className="skeleton h-3 w-20" />
                  </div>
                  <div className="skeleton h-4 w-16" />
                </div>
              ))}
            </div>
          ) : !recentTransactions?.length ? (
            <div className="py-12 text-center">
              <Tag size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-500">No transactions yet</p>
              <p className="text-xs text-slate-400 mt-1">Add your first transaction to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      tx.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    <span className="text-sm font-bold">{tx.type === 'INCOME' ? '↑' : '↓'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{tx.title}</p>
                    <p className="text-xs text-slate-400">
                      {tx.category?.name} · {formatDate(tx.transactionDate)}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => openAddModal('INCOME')}
          className="card p-4 flex items-center gap-3 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-150 text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
            <Plus size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Add Income</p>
            <p className="text-xs text-slate-400">Record earnings</p>
          </div>
        </button>
        <button
          onClick={() => openAddModal('EXPENSE')}
          className="card p-4 flex items-center gap-3 hover:border-red-200 hover:bg-red-50/30 transition-all duration-150 text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
            <Plus size={18} className="text-red-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Add Expense</p>
            <p className="text-xs text-slate-400">Log spending</p>
          </div>
        </button>
        <button
          onClick={() => navigate('/categories')}
          className="card p-4 flex items-center gap-3 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-150 text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
            <Tag size={18} className="text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Manage Categories</p>
            <p className="text-xs text-slate-400">Organize your finances</p>
          </div>
        </button>
      </div>

      <TransactionModal
        isOpen={showTxModal}
        onClose={() => setShowTxModal(false)}
        onSuccess={loadDashboard}
        defaultType={txModalType}
      />

      <ExpenseTargetModal
        isOpen={showTargetModal}
        onClose={() => setShowTargetModal(false)}
      />
    </div>
  );
};

export default Dashboard;
