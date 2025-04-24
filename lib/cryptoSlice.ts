import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { cryptocurrencies, favorites as initialFavorites } from "./mockData"
import type { RootState } from "./store"

// Define types
export type SortField = "name" | "price" | "change24h" | "volume24h" | "marketCap"
export type SortDirection = "asc" | "desc"
export type FilterType = "all" | "favorites" | "gainers" | "losers"

// Load favorites from localStorage if available
const loadFavorites = (): number[] => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cryptoFavorites")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error("Failed to parse favorites from localStorage", e)
      }
    }
  }
  return initialFavorites
}

// Load user preferences from localStorage
const loadPreferences = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cryptoPreferences")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error("Failed to parse preferences from localStorage", e)
      }
    }
  }
  return {
    sortField: "marketCap" as SortField,
    sortDirection: "desc" as SortDirection,
    filter: "all" as FilterType,
  }
}

// Define the initial state
interface CryptoState {
  cryptocurrencies: typeof cryptocurrencies
  favorites: number[]
  sortField: SortField
  sortDirection: SortDirection
  filter: FilterType
  isLiveUpdatesEnabled: boolean
}

const initialState: CryptoState = {
  cryptocurrencies: cryptocurrencies,
  favorites: loadFavorites(),
  ...loadPreferences(),
  isLiveUpdatesEnabled: true,
}

// Create the slice
const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    updateCryptoData: (state, action: PayloadAction<typeof cryptocurrencies>) => {
      state.cryptocurrencies = action.payload
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter((favId) => favId !== id)
      } else {
        state.favorites.push(id)
      }
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cryptoFavorites", JSON.stringify(state.favorites))
      }
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      state.sortField = action.payload
      savePreferences(state)
    },
    setSortDirection: (state, action: PayloadAction<SortDirection>) => {
      state.sortDirection = action.payload
      savePreferences(state)
    },
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload
      savePreferences(state)
    },
    toggleLiveUpdates: (state) => {
      state.isLiveUpdatesEnabled = !state.isLiveUpdatesEnabled
    },
  },
})

// Helper function to save preferences to localStorage
const savePreferences = (state: CryptoState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "cryptoPreferences",
      JSON.stringify({
        sortField: state.sortField,
        sortDirection: state.sortDirection,
        filter: state.filter,
      }),
    )
  }
}

// Export actions and reducer
export const { updateCryptoData, toggleFavorite, setSortField, setSortDirection, setFilter, toggleLiveUpdates } =
  cryptoSlice.actions

// Export selectors
export const selectCryptocurrencies = (state: RootState) => state.crypto.cryptocurrencies
export const selectFavorites = (state: RootState) => state.crypto.favorites
export const selectSortField = (state: RootState) => state.crypto.sortField
export const selectSortDirection = (state: RootState) => state.crypto.sortDirection
export const selectFilter = (state: RootState) => state.crypto.filter
export const selectIsLiveUpdatesEnabled = (state: RootState) => state.crypto.isLiveUpdatesEnabled

// Selector for filtered and sorted cryptocurrencies
export const selectFilteredCryptocurrencies = (state: RootState) => {
  const { cryptocurrencies, favorites, filter, sortField, sortDirection } = state.crypto

  // First apply filter
  let filtered = [...cryptocurrencies]
  if (filter === "favorites") {
    filtered = filtered.filter((crypto) => favorites.includes(crypto.id))
  } else if (filter === "gainers") {
    filtered = [...filtered].sort((a, b) => b.change24h - a.change24h).slice(0, 10)
  } else if (filter === "losers") {
    filtered = [...filtered].sort((a, b) => a.change24h - b.change24h).slice(0, 10)
  }

  // Then apply sorting
  return filtered.sort((a, b) => {
    let comparison = 0

    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name)
    } else {
      comparison = (a[sortField] as number) - (b[sortField] as number)
    }

    return sortDirection === "asc" ? comparison : -comparison
  })
}

export default cryptoSlice.reducer
