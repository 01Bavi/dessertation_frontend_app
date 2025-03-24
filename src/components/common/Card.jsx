import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  icon,
  footer,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
  onClick,
  hoverable = false,
}) => {
  const cardClasses = `
    bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden
    ${hoverable ? 'transition duration-200 hover:shadow-md' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
    >
      {/* Card Header */}
      {(title || subtitle || icon) && (
        <div className={`px-4 py-3 border-b border-gray-200 ${headerClassName}`}>
          <div className="flex items-center">
            {icon && (
              <div className="flex-shrink-0 mr-3">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-lg font-medium text-gray-900">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Card Body */}
      <div className={`px-4 py-4 ${bodyClassName}`}>
        {children}
      </div>

      {/* Card Footer */}
      {footer && (
        <div className={`px-4 py-3 bg-gray-50 border-t border-gray-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

// Card.Grid - For creating a grid of cards
Card.Grid = ({ children, columns = 1, gap = 4, className = '' }) => {
  const gridTemplateColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  const gapSize = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
  };

  return (
    <div className={`grid ${gridTemplateColumns[columns]} ${gapSize[gap]} ${className}`}>
      {children}
    </div>
  );
};

// Card.Stat - For displaying statistics
Card.Stat = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'neutral', 
  timeframe = '',
  onClick,
  className = '', 
}) => {
  const changeColor = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-500',
  };

  const changeIcon = {
    increase: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ),
    decrease: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    neutral: null,
  };

  return (
    <Card 
      className={className} 
      onClick={onClick}
      hoverable={!!onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className="p-2 bg-blue-50 rounded-full">
            {icon}
          </div>
        )}
      </div>
      
      {(change !== undefined || timeframe) && (
        <div className="mt-4 flex items-center">
          {change !== undefined && (
            <div className={`flex items-center ${changeColor[changeType]}`}>
              {changeIcon[changeType]}
              <span className="ml-1 text-sm font-medium">{change}</span>
            </div>
          )}
          {timeframe && (
            <span className="ml-2 text-sm text-gray-500">{timeframe}</span>
          )}
        </div>
      )}
    </Card>
  );
};

export default Card;