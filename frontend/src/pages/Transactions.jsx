import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Filter, X, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { transactionService } from '../services/transactionService';
import { categoryService } from '../services/categoryService';
import { formatCurrency, formatDate, getErrorMessage } from '../utils/formatters';
import { SkeletonTableRows } from '../components/Skeleton';
import TransactionModal from '../components/TransactionModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { useExpenseTarget } from '../context/ExpenseTargetContext';

const EMPTY_FILTERS = {
  search: '',
  type: '',
  categoryId: '',
  startDate: '',
  endDate: '',
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [activeFilters, setActiveFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { fetchTargetStatus } = useExpenseTarget();

  // Load categories for filter dropdown
  useEffect(() => {
    categoryService.getAll().then((res) => {
      setCategories(res.data.data.categories);
    }).catch(() => {});
  }, []);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = { page, limit: 10, ...activeFilters };
      // Remove empty filter values
      Object.keys(params).forEach((k) => {
        if (params[k] === '') delete params[k];
      });
      const res = await transactionService.getAll(params);
      setTransactions(res.data.data.transactions);
      setPagination(res.data.data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [page, activeFilters]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const applyFilters = () => {
    setPage(1);
    setActiveFilters({ ...filters });
  };

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    setActiveFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const handleEdit = (tx) => {
    setEditData(tx);
    setShowModal(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await transactionService.delete(deleteId);
      toast.success('Transaction deleted');
      setDeleteId(null);
      await loadTransactions();
      await fetchTargetStatus();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCategoriesForDropdown =
    filters.type
      ? categories.filter((c) => c.type === filters.type)
      : categories;

  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Transactions</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track and manage your income and expenses.</p>
        </div>
        <Button
          onClick={() => { setEditData(null); setShowModal(true); }}
        >
          <Plus size={16} /> Add Transaction
        </Button>
      </div>

      {/* Filter bar */}
      <div className="card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="input-field pl-9"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            />
          </div>

          {/* Type */}
          <select
            className="input-field"
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value, categoryId: '' }))}
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>

          {/* Category */}
          <select
            className="input-field"
            value={filters.categoryId}
            onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value }))}
          >
            <option value="">All Categories</option>
            {filteredCategoriesForDropdown.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Start date */}
          <input
            type="date"
            className="input-field"
            value={filters.startDate}
            onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
          />

          {/* End date */}
          <input
            type="date"
            className="input-field"
            value={filters.endDate}
            onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
          />
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Button size="sm" onClick={applyFilters}>
            <Filter size={14} /> Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button size="sm" variant="secondary" onClick={resetFilters}>
              <X size={14} /> Reset
            </Button>
          )}
          {hasActiveFilters && (
            <span className="text-xs text-slate-400">
              {pagination.total} result{pagination.total !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <SkeletonTableRows rows={8} cols={6} />
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="text-slate-300" />
                      <p className="text-sm font-medium text-slate-500">No transactions found</p>
                      <p className="text-xs text-slate-400">
                        {hasActiveFilters
                          ? 'Try adjusting your filters'
                          : 'Start tracking your finances by adding your first transaction.'}
                      </p>
                      {!hasActiveFilters && (
                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() => { setEditData(null); setShowModal(true); }}
                        >
                          <Plus size={14} /> Add Transaction
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">{tx.title}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-slate-500">{tx.category?.name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={tx.type === 'INCOME' ? 'badge-income' : 'badge-expense'}>
                        {tx.type === 'INCOME' ? '↑' : '↓'} {tx.type.charAt(0) + tx.type.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={`font-semibold ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 whitespace-nowrap">
                      {formatDate(tx.transactionDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(tx.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Showing {((page - 1) * 10) + 1}–{Math.min(page * 10, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!pagination.hasPrevPage}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 text-xs font-medium text-slate-700">
                {page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <TransactionModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditData(null); }}
        onSuccess={async () => { await loadTransactions(); await fetchTargetStatus(); }}
        editData={editData}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Transactions;
