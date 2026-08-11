import { Loader2 } from 'lucide-react';

const sizeMap = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
};

const variantMap = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${variantMap[variant]} ${sizeMap[size]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
