import React, { useState } from 'react';

const Filter = ({
  filters,
  onApplyFilters,
  onResetFilters,
  className = '',
}) => {
  const [filterValues, setFilterValues] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (filterId, value) => {
    setFilterValues(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filterValues);
  };

  const handleResetFilters = () => {
    setFilterValues({});
    onResetFilters();
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Filter header */}
      <div 
        className="px-4 py-3 border-b border-gray-200 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="text-sm font-medium text-gray-700">Filters</h3>
        </div>
        <div>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Filter body */}
      {isExpanded && (
        <div className="p-4">
          <div className="space-y-4">
            {filters.map((filter) => (
              <div key={filter.id} className="flex flex-col">
                <label htmlFor={filter.id} className="text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                
                {filter.type === 'select' ? (
                  <select
                    id={filter.id}
                    value={filterValues[filter.id] || ''}
                    onChange={(e) => handleInputChange(filter.id, e.target.value)}
                    className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">All</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : filter.type === 'date' ? (
                  <input
                    id={filter.id}
                    type="date"
                    value={filterValues[filter.id] || ''}
                    onChange={(e) => handleInputChange(filter.id, e.target.value)}
                    className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                ) : (
                  <input
                    id={filter.id}
                    type="text"
                    value={filterValues[filter.id] || ''}
                    onChange={(e) => handleInputChange(filter.id, e.target.value)}
                    placeholder={filter.placeholder || ''}
                    className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button
              type="button"
              onClick={handleApplyFilters}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;