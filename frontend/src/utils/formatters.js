/**
 * Formats a number as a currency string.
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a date string or Date object for display.
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

/**
 * Formats a date to YYYY-MM-DD for input[type="date"] fields.
 * @param {string|Date} date
 * @returns {string}
 */
export const toInputDateFormat = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Returns a short relative time string.
 * @param {string|Date} date
 * @returns {string}
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(date);
};

/**
 * Extracts a user-friendly error message from an Axios error.
 * @param {Error} error
 * @returns {string}
 */
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.data?.errors?.length > 0) {
    return error.response.data.errors[0].message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

/**
 * CHART COLORS for consistent palette across all charts.
 */
export const CHART_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#0ea5e9', '#3b82f6',
];
