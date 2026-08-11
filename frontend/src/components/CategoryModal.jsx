import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema } from '../schemas';
import { categoryService } from '../services/categoryService';
import { getErrorMessage } from '../utils/formatters';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import toast from 'react-hot-toast';

const CategoryModal = ({ isOpen, onClose, onSuccess, editData = null }) => {
  const isEdit = !!editData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', type: 'EXPENSE' },
  });

  useEffect(() => {
    if (editData && isOpen) {
      reset({ name: editData.name, type: editData.type });
    } else if (!isEdit && isOpen) {
      reset({ name: '', type: 'EXPENSE' });
    }
  }, [editData, isOpen, isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await categoryService.update(editData.id, data);
        toast.success('Category updated successfully!');
      } else {
        await categoryService.create(data);
        toast.success('Category created successfully!');
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
      title={isEdit ? 'Edit Category' : 'Add Category'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          id="cat-name"
          label="Category Name"
          required
          placeholder="e.g., Food & Dining"
          error={errors.name?.message}
          {...register('name')}
        />

        <Select
          id="cat-type"
          label="Type"
          required
          error={errors.type?.message}
          {...register('type')}
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </Select>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? 'Update Category' : 'Save Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryModal;
