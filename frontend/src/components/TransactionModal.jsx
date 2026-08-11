import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from '../schemas';
import { transactionService } from '../services/transactionService';
import { categoryService } from '../services/categoryService';
import { getErrorMessage, toInputDateFormat } from '../utils/formatters';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import toast from 'react-hot-toast';

const TransactionModal = ({ isOpen, onClose, onSuccess, editData = null, defaultType = 'EXPENSE' }) => {
  const isEdit = !!editData;
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: '',
      amount: '',
      type: defaultType,
      categoryId: '',
      transactionDate: toInputDateFormat(new Date()),
    },
  });

  const watchedType = watch('type');

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const res = await categoryService.getAll();
        setCategories(res.data.data.categories);
      } catch {
        // ignore
      } finally {
        setCategoriesLoading(false);
      }
    };
    if (isOpen) loadCategories();
  }, [isOpen]);

  // Populate form for edit
  useEffect(() => {
    if (editData && isOpen) {
      reset({
        title: editData.title,
        amount: String(editData.amount),
        type: editData.type,
        categoryId: editData.categoryId,
        transactionDate: toInputDateFormat(editData.transactionDate),
      });
    } else if (!isEdit && isOpen) {
      reset({
        title: '',
        amount: '',
        type: defaultType,
        categoryId: '',
        transactionDate: toInputDateFormat(new Date()),
      });
    }
  }, [editData, isOpen, isEdit, reset]);

  const filteredCategories = categories.filter((c) => c.type === watchedType);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        amount: parseFloat(data.amount),
      };
      if (isEdit) {
        await transactionService.update(editData.id, payload);
        toast.success('Transaction updated successfully!');
      } else {
        await transactionService.create(payload);
        toast.success('Transaction created successfully!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Transaction' : 'Add Transaction'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          id="tx-title"
          label="Title"
          required
          placeholder="e.g., Monthly Salary"
          error={errors.title?.message}
          {...register('title')}
        />

        <Input
          id="tx-amount"
          label="Amount"
          type="number"
          required
          placeholder="0.00"
          step="0.01"
          min="0.01"
          error={errors.amount?.message}
          {...register('amount')}
        />

        {/* Type selector */}
        <div className="space-y-1">
          <label className="label">
            Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['INCOME', 'EXPENSE'].map((t) => (
              <label
                key={t}
                className={`flex items-center justify-center gap-2 cursor-pointer rounded-lg border-2 py-2.5 text-sm font-medium transition-all ${
                  watchedType === t
                    ? t === 'INCOME'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  value={t}
                  className="sr-only"
                  {...register('type')}
                />
                {t === 'INCOME' ? '↑ Income' : '↓ Expense'}
              </label>
            ))}
          </div>
          {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
        </div>

        {/* Category */}
        <Select
          id="tx-category"
          label="Category"
          required
          error={errors.categoryId?.message}
          {...register('categoryId')}
          disabled={categoriesLoading || filteredCategories.length === 0}
        >
          <option value="">
            {categoriesLoading
              ? 'Loading categories...'
              : filteredCategories.length === 0
              ? `No ${watchedType.toLowerCase()} categories`
              : 'Select a category'}
          </option>
          {filteredCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>

        <Input
          id="tx-date"
          label="Transaction Date"
          type="date"
          required
          error={errors.transactionDate?.message}
          {...register('transactionDate')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? 'Update Transaction' : 'Save Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;
