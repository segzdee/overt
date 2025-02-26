/**
 * Currency Symbol mapping
 */
const currencySymbols: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  CAD: "C$",
  ZAR: "R",
  DKK: "kr",
  AED: "د.إ",
  AUD: "A$",
  JPY: "¥",
  CHF: "CHF",
  CNY: "¥",
  INR: "₹",
  NZD: "NZ$",
  MXN: "MX$",
  SGD: "S$",
};

/**
 * Formats a rate with appropriate currency symbol
 * @param rate The numeric rate to format
 * @param currency The currency code
 * @param exchangeRates Exchange rates for currency conversion
 * @returns Formatted currency string
 */
export const formatRate = (
  rate: number, 
  currency: string, 
  exchangeRates: Record<string, number>
): string => {
  if (!rate && rate !== 0) return "N/A";
  
  const exchangeRate = exchangeRates[currency] || 1;
  const convertedRate = rate * exchangeRate;
  
  // Get symbol or use currency code if no symbol is available
  const symbol = currencySymbols[currency] || currency;
  
  // Determine decimal places based on currency
  const decimalPlaces = getDecimalPlacesForCurrency(currency);
  
  // Format the number with appropriate decimal places
  const formattedValue = convertedRate.toFixed(decimalPlaces);
  
  // Return formatted string (symbol + value)
  return `${symbol}${formattedValue}`;
}

/**
 * Get appropriate decimal places for a given currency
 * @param currency The currency code
 * @returns Number of decimal places to use
 */
function getDecimalPlacesForCurrency(currency: string): number {
  // Currencies that typically don't use decimal places
  const noDecimalCurrencies = ["JPY", "HUF", "TWD", "KRW", "CLP", "ISK"];
  if (noDecimalCurrencies.includes(currency)) return 0;
  
  // Currencies that typically use whole units
  const wholeUnitCurrencies = ["ZAR", "DKK", "NOK", "SEK"];
  if (wholeUnitCurrencies.includes(currency)) return 0;
  
  // Default to 2 decimal places for most currencies
  return 2;
}

/**
 * Convert amount from one currency to another
 * @param amount Amount to convert
 * @param fromCurrency Source currency
 * @param toCurrency Target currency
 * @param exchangeRates Exchange rates
 * @returns Converted amount
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: Record<string, number>,
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Get exchange rates or use 1 if not available
  const fromRate = exchangeRates[fromCurrency] || 1;
  const toRate = exchangeRates[toCurrency] || 1;
  
  // Calculate conversion
  const rateRatio = toRate / fromRate;
  return amount * rateRatio;
}

/**
 * Get a list of available currencies with their symbols
 * @returns Array of currency options
 */
export const getAvailableCurrencies = (): Array<{code: string, symbol: string}> => {
  return Object.entries(currencySymbols).map(([code, symbol]) => ({
    code,
    symbol
  }));
}
