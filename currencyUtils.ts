export const formatRate = (rate: number, currency: string, exchangeRates: Record<string, number>): string => {
  const exchangeRate = exchangeRates[currency] || 1
  const convertedRate = rate * exchangeRate

  const currencySymbols: Record<string, string> = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    AED: "AED",
  }

  return `${currencySymbols[currency] || currency}${convertedRate.toFixed(0)}`
}

