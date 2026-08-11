import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, TrendingUp, Check } from 'lucide-react';
import { registerSchema } from '../schemas';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/formatters';
import Button from '../components/Button';
import Input from '../components/Input';
import toast from 'react-hot-toast';

const PasswordStrengthHint = ({ password }) => {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'One uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'One number', pass: /[0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <ul className="mt-2 space-y-1">
      {checks.map(({ label, pass }) => (
        <li key={label} className={`flex items-center gap-1.5 text-xs ${pass ? 'text-emerald-600' : 'text-slate-400'}`}>
          <Check size={12} className={pass ? 'text-emerald-500' : 'opacity-30'} />
          {label}
        </li>
      ))}
    </ul>
  );
};

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const watchedPassword = watch('password', '');

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const res = await authService.register(data);
      const { user, token } = res.data.data;
      login(user, token);
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/dashboard');
    } catch (error) {
      setApiError(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-sm">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Expense</p>
              <p className="text-sm font-bold text-slate-900 leading-tight">Tracker</p>
            </div>
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="text-sm text-slate-500 mt-1">Start tracking your finances today.</p>
          </div>

          {apiError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              id="fullName"
              label="Full Name"
              required
              placeholder="John Doe"
              autoComplete="name"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              id="reg-email"
              label="Email address"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="reg-password" className="label">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`input-field pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
              <PasswordStrengthHint password={watchedPassword} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="label">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`input-field pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
