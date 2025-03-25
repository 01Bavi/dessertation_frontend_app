import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  footer,
  className = '',
  headerAction,
  noPadding = false,
  isLoading = false
}) => {
  
  const cardClasses = `bg-white shadow-md rounded-lg overflow-hidden ${className}`;
  const bodyClasses = noPadding ? '' : 'p-5';
  
  if (isLoading) {
    return (
      <div className={cardClasses}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 mx-5 mt-5"></div>
          <div className="space-y-3 px-5 pb-5">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cardClasses}>
      {(title || subtitle || headerAction) && (
        <div className="border-b border-gray-200 px-5 py-4 flex justify-between items-center">
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {headerAction && (
            <div className="ml-4">
              {headerAction}
            </div>
          )}
        </div>
      )}
      
      <div className={bodyClasses}>
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-gray-200 px-5 py-4">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;