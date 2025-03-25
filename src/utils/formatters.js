import moment from 'moment';

// Format date with specified format
export const formatDate = (date, format = 'MMM D, YYYY') => {
  if (!date) return 'N/A';
  return moment(date).format(format);
};

// Format full date with time
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return moment(date).format('MMMM D, YYYY [at] h:mm A');
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  return moment(date).fromNow();
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format number with commas
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

// Format percentage
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return 'N/A';
  
  return `${formatNumber(value * 100, decimals)}%`;
};

// Format phone number
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return 'N/A';
  
  // For international numbers, this is a simple formatter
  // You may need to adjust this based on your specific requirements
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    // Format as US number
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length > 10) {
    // International number
    return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
  }
  
  // If the format is unknown, return the original
  return phoneNumber;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format name (capitalize first letter of each word)
export const formatName = (name) => {
  if (!name) return 'N/A';
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Format status with appropriate styling classes
export const getStatusClass = (status) => {
  const statusMap = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'ASSIGNED': 'bg-blue-100 text-blue-800',
    'IN_PROGRESS': 'bg-purple-100 text-purple-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'DROPPED': 'bg-red-100 text-red-800',
    'ACTIVE': 'bg-green-100 text-green-800',
    'INACTIVE': 'bg-red-100 text-red-800',
    'APPROVED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'WAITING': 'bg-yellow-100 text-yellow-800',
    'SUCCESS': 'bg-green-100 text-green-800',
    'FAILED': 'bg-red-100 text-red-800',
  };
  
  return statusMap[status] || 'bg-gray-100 text-gray-800';
};