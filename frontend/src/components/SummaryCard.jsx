import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const iconMap = {
  income: { icon: TrendingUp, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  expense: { icon: TrendingDown, bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
  balance: { icon: DollarSign, bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-100' },
};

const SummaryCard = ({ type, title, amount, subtitle }) => {
  const config = iconMap[type] || iconMap.balance;
  const Icon = config.icon;

  const amountColor =
    type === 'income'
      ? 'text-emerald-700'
      : type === 'expense'
      ? 'text-red-700'
      : amount >= 0
      ? 'text-slate-900'
      : 'text-red-700';

  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <div className={`w-10 h-10 rounded-xl ${config.bg} ${config.border} border flex items-center justify-center`}>
          <Icon size={20} className={config.text} />
        </div>
      </div>
      <div>
        <p className={`text-2xl font-bold tracking-tight ${amountColor}`}>
          {formatCurrency(amount)}
        </p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default SummaryCard;
