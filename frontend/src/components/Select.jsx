import { forwardRef } from 'react';

const Select = forwardRef(
  ({ label, error, id, children, required, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="label">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`input-field ${error ? 'input-error' : ''} ${className}`}
          aria-invalid={!!error}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
