import { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: Option[];
  error?: string;
  helpText?: string;
}

const Select = ({
  label,
  id,
  options,
  error,
  helpText,
  className = '',
  ...props
}: SelectProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        id={id}
        className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-bright focus:outline-none focus:ring-1 focus:ring-primary-bright dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
          error ? 'border-error-red focus:border-error-red focus:ring-error-red' : ''
        } ${className}`}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-error-red">{error}</p>}
      {helpText && !error && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
    </div>
  );
};

export default Select;