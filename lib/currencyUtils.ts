import currency from "currency.js"

const currencySymbols: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  CAD: "C$",
  ZAR: "R",
  DKK: "DKK",
}

export const formatRate = (rate: number, currencyCode: string, exchangeRates: Record<string, number>): string => {
  const exchangeRate = exchangeRates[currencyCode] || 1
  const convertedRate = currency(rate).multiply(exchangeRate)

  return currency(convertedRate, {
    symbol: currencySymbols[currencyCode] || currencyCode,
    precision: currencyCode === "ZAR" || currencyCode === "DKK" ? 0 : 2,
  }).format()
}

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: Record<string, number>,
): number => {
  const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency]
  return currency(amount).multiply(rate).value
}

