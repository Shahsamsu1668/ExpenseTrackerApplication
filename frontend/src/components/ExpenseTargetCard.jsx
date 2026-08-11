import { useState } from 'react';
import { Target, Pencil, Trash2 } from 'lucide-react';
import { useExpenseTarget } from '../context/ExpenseTargetContext';
import { formatCurrency } from '../utils/formatters';
import Button from './Button';
import ConfirmDialog from './ConfirmDialog';
import { expenseTargetService } from '../services/expenseTargetService';
import toast from 'react-hot-toast';

const ExpenseTargetCard = ({ onEdit }) => {
  const { targetStatus, isLoadingTarget, fetchTargetStatus } = useExpenseTarget();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await expenseTargetService.deleteTarget();
      toast.success('Expense target removed');
      await fetchTargetStatus();
    } catch (error) {
      toast.error('Failed to delete target');
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  if (isLoadingTarget) {
    return <div className="card p-5 h-48 skeleton rounded-xl"></div>;
  }

  if (!targetStatus) {
    return (
      <div className="card p-5 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
        <Target size={32} className="text-slate-300 mb-3" />
        <h2 className="text-sm font-semibold text-slate-900">No Expense Target</h2>
        <p className="text-xs text-slate-400 mt-1 mb-4">Set a monthly goal to keep your spending in check.</p>
        <Button size="sm" onClick={onEdit}>Set Target</Button>
      </div>
    );
  }

  const { target, spent, remaining, percentage, isExceeded, exceededBy } = targetStatus;
  
  // Visual states
  const isApproaching = percentage >= 80 && percentage < 100;
  
  let progressColor = 'bg-primary-500';
  let bgColor = 'bg-primary-50';
  let textColor = 'text-primary-700';
  
  if (isExceeded) {
    progressColor = 'bg-red-500';
    bgColor = 'bg-red-50';
    textColor = 'text-red-700';
  } else if (isApproaching) {
    progressColor = 'bg-amber-500';
    bgColor = 'bg-amber-50';
    textColor = 'text-amber-700';
  }

  return (
    <div className="card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Target size={16} className={textColor} /> 
            Monthly Expense Target
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onEdit} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors" title="Edit Target">
            <Pencil size={15} />
          </button>
          <button onClick={() => setShowConfirmDelete(true)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Remove Target">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(spent)}</p>
            <p className="text-xs font-medium text-slate-500">spent of {formatCurrency(target)}</p>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${bgColor} ${textColor}`}>
            {percentage.toFixed(0)}% used
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3 overflow-hidden">
          <div 
            className={`h-2.5 rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>

        {/* Status text */}
        <div>
          {isExceeded ? (
            <p className="text-xs font-semibold text-red-600">
              Target exceeded by {formatCurrency(exceededBy)}!
            </p>
          ) : isApproaching ? (
            <p className="text-xs font-semibold text-amber-600">
              You're approaching your monthly expense target.
            </p>
          ) : (
            <p className="text-xs font-medium text-slate-500">
              {formatCurrency(remaining)} remaining this month
            </p>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Remove Target"
        message="Are you sure you want to remove your expense target?"
        confirmLabel="Remove"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ExpenseTargetCard;
