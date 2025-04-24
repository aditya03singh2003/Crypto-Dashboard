import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import type { Crypto, FilterType } from "../../types"

// Basic selector to get all cryptos
export const selectCryptos = (state: RootState) => state.crypto.cryptos

// Selector to get favorites
export const selectFavorites = (state: RootState) => state.crypto.favorites

// Selector to get sort configuration
export const selectSortConfig = (state: RootState) => ({
  sortBy: state.crypto.sortBy,
  sortDirection: state.crypto.sortDirection,
})

// Selector to get filter
export const selectFilter = (state: RootState) => state.crypto.filter

// Selector to get filtered cryptos
export const selectFilteredCryptos = createSelector(
  [selectCryptos, selectFavorites, selectFilter],
  (cryptos, favorites, filter: FilterType) => {
    switch (filter) {
      case "favorites":
        return cryptos.filter((crypto) => favorites.includes(crypto.id))
      case "gainers":
        return [...cryptos].sort((a, b) => b.change24h - a.change24h).slice(0, 20)
      case "losers":
        return [...cryptos].sort((a, b) => a.change24h - b.change24h).slice(0, 20)
      case "trending":
        return [...cryptos].sort((a, b) => b.volume24h - a.volume24h).slice(0, 20)
      case "all":
      default:
        return cryptos
    }
  },
)

// Memoized selector to get sorted and filtered cryptos
export const selectSortedCryptos = createSelector(
  [selectFilteredCryptos, selectSortConfig],
  (cryptos, { sortBy, sortDirection }) => {
    // Create a new array to avoid mutating the state
    const sortedCryptos = [...cryptos]

    // Sort the cryptos based on the sort configuration
    return sortedCryptos.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Crypto]
      let bValue: any = b[sortBy as keyof Crypto]

      // Handle special cases for nested properties
      if (sortBy === "change1h") {
        aValue = a.change1h
        bValue = b.change1h
      } else if (sortBy === "change24h") {
        aValue = a.change24h
        bValue = b.change24h
      } else if (sortBy === "change7d") {
        aValue = a.change7d
        bValue = b.change7d
      } else if (sortBy === "volume24h") {
        aValue = a.volume24h
        bValue = b.volume24h
      }

      // Handle string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      // Handle number comparison
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    })
  },
)

// Selector to get top gainers (24h)
export const selectTopGainers = createSelector([selectCryptos], (cryptos) => {
  return [...cryptos].sort((a, b) => b.change24h - a.change24h).slice(0, 5)
})

// Selector to get top losers (24h)
export const selectTopLosers = createSelector([selectCryptos], (cryptos) => {
  return [...cryptos].sort((a, b) => a.change24h - b.change24h).slice(0, 5)
})
