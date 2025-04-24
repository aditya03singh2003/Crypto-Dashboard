// Format currency with appropriate abbreviations for large numbers
export const formatCurrency = (value: number): string => {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`
  } else if (value < 0.01) {
    return `$${value.toFixed(6)}`
  } else {
    return `$${value.toFixed(2)}`
  }
}

// Format percentage with 2 decimal places
export const formatPercentage = (value: number): string => {
  return `${Math.abs(value).toFixed(2)}%`
}

// Format large numbers with appropriate abbreviations
export const formatNumber = (value: number): string => {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`
  } else {
    return value.toFixed(2)
  }
}
