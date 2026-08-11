import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { getErrorMessage } from '../utils/formatters';
import CategoryModal from '../components/CategoryModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import toast from 'react-hot-toast';

const CategoryCard = ({ category, onEdit, onDelete }) => {
  const isIncome = category.type === 'INCOME';
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isIncome ? 'bg-emerald-50' : 'bg-red-50'
          }`}
        >
          {isIncome ? (
            <TrendingUp size={15} className="text-emerald-600" />
          ) : (
            <TrendingDown size={15} className="text-red-600" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">{category.name}</p>
          <p className="text-xs text-slate-400">
            {category._count?.transactions ?? 0} transaction{category._count?.transactions !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onEdit(category)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          title="Edit category"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(category)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Delete category"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await categoryService.getAll();
      setCategories(res.data.data.categories);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleEdit = (cat) => {
    setEditData(cat);
    setShowModal(true);
  };

  const handleDeleteClick = (cat) => {
    setDeleteTarget(cat);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await categoryService.delete(deleteTarget.id);
      toast.success('Category deleted');
      setDeleteTarget(null);
      loadCategories();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const incomeCategories = categories.filter((c) => c.type === 'INCOME');
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');

  const SkeletonCategories = () => (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3 px-4 rounded-lg border border-slate-100 animate-pulse">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-6 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Categories</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organize your transactions with custom categories.
          </p>
        </div>
        <Button onClick={() => { setEditData(null); setShowModal(true); }}>
          <Plus size={16} /> Add Category
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Categories */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center">
              <TrendingUp size={13} className="text-emerald-600" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Income Categories</h2>
            <span className="ml-auto text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
              {incomeCategories.length}
            </span>
          </div>

          {isLoading ? (
            <SkeletonCategories />
          ) : incomeCategories.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-400">No income categories yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {incomeCategories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Expense Categories */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center">
              <TrendingDown size={13} className="text-red-600" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Expense Categories</h2>
            <span className="ml-auto text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
              {expenseCategories.length}
            </span>
          </div>

          {isLoading ? (
            <SkeletonCategories />
          ) : expenseCategories.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-400">No expense categories yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {expenseCategories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditData(null); }}
        onSuccess={loadCategories}
        editData={editData}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={
          deleteTarget?._count?.transactions > 0
            ? `Cannot delete "${deleteTarget?.name}" — it has ${deleteTarget?._count?.transactions} transaction(s) linked to it. Please reassign or delete those transactions first.`
            : `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`
        }
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Categories;
