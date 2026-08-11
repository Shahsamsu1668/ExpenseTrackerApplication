import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseTargetService } from '../services/expenseTargetService';
import { useExpenseTarget } from '../context/ExpenseTargetContext';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import toast from 'react-hot-toast';

const targetSchema = z.object({
  amount: z.coerce.number().positive('Target must be greater than zero'),
});

const ExpenseTargetModal = ({ isOpen, onClose }) => {
  const { targetStatus, fetchTargetStatus } = useExpenseTarget();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(targetSchema),
    defaultValues: {
      amount: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (targetStatus) {
        reset({ amount: targetStatus.target });
      } else {
        reset({ amount: '' });
      }
    }
  }, [isOpen, targetStatus, reset]);

  const onSubmit = async (data) => {
    try {
      await expenseTargetService.setTarget({ amount: data.amount, period: 'MONTHLY' });
      toast.success('Expense target saved successfully!');
      await fetchTargetStatus();
      onClose();
    } catch (error) {
      toast.error('Failed to save expense target.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Monthly Expense Target">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <p className="text-sm text-slate-500 mb-2">
          Set a monthly spending limit. We'll track your expenses and notify you when you get close to or exceed this amount.
        </p>

        <Input
          id="target-amount"
          label="Target Amount (Monthly)"
          type="number"
          required
          placeholder="e.g., 20000"
          step="0.01"
          min="0.01"
          error={errors.amount?.message}
          {...register('amount')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save Target
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseTargetModal;
