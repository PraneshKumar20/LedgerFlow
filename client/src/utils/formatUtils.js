/**
 * formatUtils.js
 * Centralized formatting utilities to ensure consistent number displays.
 */

/**
 * Formats a monetary amount into a localized string (without currency symbol).
 * Uses 'en-IN' for Indian Rupee (₹) to get Indian grouping (e.g. 1,00,000.00),
 * and 'en-US' for other currencies.
 *
 * @param {number|string} amount - The numeric value to format.
 * @param {string} currencyIndicator - e.g., 'INR', '₹', 'USD', '$'
 * @param {number} minimumFractionDigits - Minimum decimal places (default 2)
 * @param {number} maximumFractionDigits - Maximum decimal places (default 2)
 * @returns {string} The localized formatted string
 */
export const formatNumber = (
  amount,
  currencyIndicator = "USD",
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
) => {
  const isINR = currencyIndicator === "INR" || currencyIndicator === "₹";
  const locale = isINR ? "en-IN" : "en-US";
  return Number(amount).toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  });
};

/**
 * Formats a number using compact notation (e.g., 2K, 2L, 2Cr).
 * Uses 'en-IN' for Indian Rupee to natively support Lakhs and Crores.
 *
 * @param {number|string} amount - The numeric value to format.
 * @param {string} currencyIndicator - e.g., 'INR', '₹', 'USD', '$'
 * @param {number} maximumFractionDigits - Maximum decimal places (default 1)
 * @returns {string} The compact formatted string
 */
export const formatCompactNumber = (
  amount,
  currencyIndicator = "USD",
  maximumFractionDigits = 1
) => {
  const isINR = currencyIndicator === "INR" || currencyIndicator === "₹";
  const locale = isINR ? "en-IN" : "en-US";
  return Number(amount).toLocaleString(locale, {
    notation: "compact",
    maximumFractionDigits,
  });
};
