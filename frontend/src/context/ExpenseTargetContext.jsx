import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { expenseTargetService } from '../services/expenseTargetService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';

const ExpenseTargetContext = createContext(null);

export const ExpenseTargetProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [targetStatus, setTargetStatus] = useState(null);
  const [isLoadingTarget, setIsLoadingTarget] = useState(true);

  const fetchTargetStatus = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await expenseTargetService.getStatus();
      const newStatus = res.data.data;
      setTargetStatus(newStatus);

      if (newStatus && newStatus.isExceeded) {
        // Check if we already notified for this month
        const now = new Date();
        const monthKey = `target_exceeded_${now.getFullYear()}_${now.getMonth()}`;
        const hasNotified = localStorage.getItem(monthKey);

        if (!hasNotified) {
          toast.error(
            `Expense Target Exceeded! Your expenses have exceeded your target by ${formatCurrency(newStatus.exceededBy)}.`,
            { duration: 6000 }
          );
          localStorage.setItem(monthKey, 'true');
        }
      } else if (newStatus && !newStatus.isExceeded) {
        // Clear flag if they fall back below target (e.g. deleted an expense)
        const now = new Date();
        const monthKey = `target_exceeded_${now.getFullYear()}_${now.getMonth()}`;
        localStorage.removeItem(monthKey);
      }
    } catch (error) {
      console.error('Failed to fetch expense target status', error);
    } finally {
      setIsLoadingTarget(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTargetStatus();
    } else {
      setTargetStatus(null);
    }
  }, [isAuthenticated, fetchTargetStatus]);

  const value = {
    targetStatus,
    isLoadingTarget,
    fetchTargetStatus,
  };

  return <ExpenseTargetContext.Provider value={value}>{children}</ExpenseTargetContext.Provider>;
};

export const useExpenseTarget = () => {
  const context = useContext(ExpenseTargetContext);
  if (!context) {
    throw new Error('useExpenseTarget must be used within an ExpenseTargetProvider');
  }
  return context;
};
