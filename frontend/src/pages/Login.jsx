import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';
import { loginSchema } from '../schemas';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/formatters';
import Button from '../components/Button';
import Input from '../components/Input';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const res = await authService.login(data);
      const { user, token } = res.data.data;
      login(user, token);
      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (error) {
      setApiError(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
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

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your money with confidence.</p>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              id="email"
              label="Email address"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="space-y-1">
              <label htmlFor="password" className="label">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
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
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 card p-4 bg-amber-50 border-amber-200">
          <p className="text-xs font-semibold text-amber-800 mb-1">🔑 Demo Credentials</p>
          <p className="text-xs text-amber-700">Email: demo@example.com</p>
          <p className="text-xs text-amber-700">Password: Demo@12345</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
