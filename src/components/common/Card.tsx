import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerAction?: ReactNode;
  noPadding?: boolean;
}

const Card = ({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  headerAction,
  noPadding = false
}: CardProps) => {
  return (
    <div className={`rounded-lg bg-white shadow dark:bg-gray-800 ${className}`}>
      {(title || headerAction) && (
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              {title && <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>}
              {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

export default Card;