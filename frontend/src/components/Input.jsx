import { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      id,
      type = 'text',
      placeholder,
      required,
      className = '',
      helpText,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="label">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          className={`input-field ${error ? 'input-error' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="text-sm text-red-600 flex items-center gap-1 mt-1">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p className="text-xs text-slate-500 mt-1">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
