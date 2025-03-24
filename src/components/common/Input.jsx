import React from 'react';

const Input = ({
  id,
  name,
  label,
  value,
  type = 'text',
  placeholder = '',
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = '',
  helperText = '',
  leadingIcon = null,
  trailingIcon = null,
  autoComplete = 'on',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative rounded-md">
        {leadingIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leadingIcon}
          </div>
        )}
        
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`
            block w-full rounded-md sm:text-sm border-gray-300 shadow-sm
            ${leadingIcon ? 'pl-10' : ''}
            ${trailingIcon ? 'pr-10' : ''}
            ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 
              'focus:ring-blue-500 focus:border-blue-500 border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
        />
        
        {trailingIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {trailingIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500" id={`${id}-description`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;