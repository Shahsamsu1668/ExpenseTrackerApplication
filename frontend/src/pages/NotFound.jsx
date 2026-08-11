import { Link } from 'react-router-dom';
import { TrendingUp, Home } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-6">
        <TrendingUp size={28} className="text-primary-600" />
      </div>
      <h1 className="text-6xl font-bold text-slate-200 mb-4">404</h1>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Page not found</h2>
      <p className="text-sm text-slate-500 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="btn-primary inline-flex"
      >
        <Home size={16} /> Back to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFound;
