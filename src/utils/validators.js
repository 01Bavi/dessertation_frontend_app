/**
 * Email validation
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Password validation
   * @param {string} password - The password to validate
   * @returns {object} Validation result with isValid and message
   */
  export const validatePassword = (password) => {
    if (!password) {
      return {
        isValid: false,
        message: 'Password is required',
      };
    }
  
    if (password.length < 8) {
      return {
        isValid: false,
        message: 'Password must be at least 8 characters long',
      };
    }
  
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one uppercase letter',
      };
    }
  
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one lowercase letter',
      };
    }
  
    // Check for at least one number
    if (!/\d/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one number',
      };
    }
  
    return {
      isValid: true,
      message: 'Password is valid',
    };
  };
  
  /**
   * Phone number validation
   * @param {string} phone - The phone number to validate
   * @returns {boolean} Whether the phone number is valid
   */
  export const isValidPhone = (phone) => {
    if (!phone) return false;
    // Regular expression for basic phone validation (handles various formats)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/[\s()-]/g, ''));
  };
  
  /**
   * Required field validation
   * @param {string} value - The value to check
   * @param {string} fieldName - The name of the field being validated
   * @returns {string|null} Error message or null if valid
   */
  export const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return null;
  };
  
  /**
   * Form validation helper
   * @param {object} data - The form data object
   * @param {object} rules - Validation rules object
   * @returns {object} Validation result with errors and isValid
   */
  export const validateForm = (data, rules) => {
    const errors = {};
    let isValid = true;
  
    Object.keys(rules).forEach((field) => {
      const fieldRules = rules[field];
      
      // Required validation
      if (fieldRules.required && validateRequired(data[field], field)) {
        errors[field] = validateRequired(data[field], fieldRules.label || field);
        isValid = false;
      }
      
      // Email validation
      if (fieldRules.email && data[field] && !isValidEmail(data[field])) {
        errors[field] = 'Please enter a valid email address';
        isValid = false;
      }
      
      // Phone validation
      if (fieldRules.phone && data[field] && !isValidPhone(data[field])) {
        errors[field] = 'Please enter a valid phone number';
        isValid = false;
      }
      
      // Password validation
      if (fieldRules.password && data[field]) {
        const passwordResult = validatePassword(data[field]);
        if (!passwordResult.isValid) {
          errors[field] = passwordResult.message;
          isValid = false;
        }
      }
      
      // Custom validation
      if (fieldRules.custom && typeof fieldRules.custom === 'function') {
        const customError = fieldRules.custom(data[field], data);
        if (customError) {
          errors[field] = customError;
          isValid = false;
        }
      }
      
      // Min length validation
      if (fieldRules.minLength && data[field] && data[field].length < fieldRules.minLength) {
        errors[field] = `${fieldRules.label || field} must be at least ${fieldRules.minLength} characters`;
        isValid = false;
      }
      
      // Max length validation
      if (fieldRules.maxLength && data[field] && data[field].length > fieldRules.maxLength) {
        errors[field] = `${fieldRules.label || field} must not exceed ${fieldRules.maxLength} characters`;
        isValid = false;
      }
    });
  
    return {
      errors,
      isValid,
    };
  };
  
  /**
   * Match confirmation fields (like password confirmation)
   * @param {string} value - The value to check
   * @param {string} confirmValue - The confirmation value
   * @param {string} fieldName - The name of the field
   * @returns {string|null} Error message or null if valid
   */
  export const validateMatch = (value, confirmValue, fieldName = 'Passwords') => {
    if (value !== confirmValue) {
      return `${fieldName} do not match`;
    }
    return null;
  };
  
  export default {
    isValidEmail,
    validatePassword,
    isValidPhone,
    validateRequired,
    validateForm,
    validateMatch,
  };