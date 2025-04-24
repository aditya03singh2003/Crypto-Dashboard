import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AppThunk } from "../../app/store"
import type { Crypto, SortDirection, FilterType } from "../../types"
import { initialCryptoData } from "../../data/initialCryptoData"
import { websocketService } from "../../services/websocketService"

interface CryptoState {
  cryptos: Crypto[]
  sortBy: keyof Crypto | "change1h" | "change24h" | "change7d" | "volume24h"
  sortDirection: SortDirection
  filter: FilterType
  favorites: string[]
  webSocketActive: boolean
  theme: "light" | "dark" | "system"
  currency: string
  userPortfolio: { [key: string]: number } // Symbol -> Amount
}

// Load state from localStorage if available
const loadState = (): Partial<CryptoState> => {
  try {
    // Check if window is defined (client-side)
    if (typeof window === "undefined") {
      return {}
    }

    const serializedState = localStorage.getItem("cryptoState")
    if (serializedState === null) {
      return {}
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.error("Failed to load state from localStorage:", err)
    return {}
  }
}

const savedState = loadState()

const initialState: CryptoState = {
  cryptos: initialCryptoData,
  sortBy: "marketCap",
  sortDirection: "desc",
  filter: "all",
  favorites: [],
  webSocketActive: false,
  theme: "system",
  currency: "USD",
  userPortfolio: {},
  ...savedState,
}

// Helper function to save state to localStorage
const saveState = (state: CryptoState) => {
  try {
    // Check if window is defined (client-side)
    if (typeof window === "undefined") {
      return
    }

    // Only save user preferences, not the entire state
    const stateToSave = {
      sortBy: state.sortBy,
      sortDirection: state.sortDirection,
      filter: state.filter,
      favorites: state.favorites,
      theme: state.theme,
      currency: state.currency,
      userPortfolio: state.userPortfolio,
    }
    const serializedState = JSON.stringify(stateToSave)
    localStorage.setItem("cryptoState", serializedState)
  } catch (err) {
    console.error("Failed to save state to localStorage:", err)
  }
}

export const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    updateCryptoData: (state, action: PayloadAction<Crypto[]>) => {
      state.cryptos = action.payload
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload as any
      saveState(state)
    },
    setSortDirection: (state, action: PayloadAction<SortDirection>) => {
      state.sortDirection = action.payload
      saveState(state)
    },
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload
      saveState(state)
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter((favId) => favId !== id)
      } else {
        state.favorites.push(id)
      }
      saveState(state)
    },
    setWebSocketActive: (state, action: PayloadAction<boolean>) => {
      state.webSocketActive = action.payload
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload
      saveState(state)
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload
      saveState(state)
    },
    updatePortfolio: (state, action: PayloadAction<{ symbol: string; amount: number }>) => {
      const { symbol, amount } = action.payload
      if (amount <= 0) {
        // Remove from portfolio if amount is zero or negative
        const { [symbol]: _, ...rest } = state.userPortfolio
        state.userPortfolio = rest
      } else {
        state.userPortfolio = {
          ...state.userPortfolio,
          [symbol]: amount,
        }
      }
      saveState(state)
    },
    clearPortfolio: (state) => {
      state.userPortfolio = {}
      saveState(state)
    },
  },
})

export const {
  updateCryptoData,
  setSortBy,
  setSortDirection,
  setFilter,
  toggleFavorite,
  setWebSocketActive,
  setTheme,
  setCurrency,
  updatePortfolio,
  clearPortfolio,
} = cryptoSlice.actions

// Thunk to start WebSocket connection
export const startWebSocketConnection = (): AppThunk => (dispatch, getState) => {
  const { webSocketActive } = getState().crypto

  if (!webSocketActive) {
    dispatch(setWebSocketActive(true))
    websocketService.connect()
  }
}

// Thunk to stop WebSocket connection
export const stopWebSocketConnection = (): AppThunk => (dispatch, getState) => {
  const { webSocketActive } = getState().crypto

  if (webSocketActive) {
    websocketService.disconnect()
    dispatch(setWebSocketActive(false))
  }
}

export default cryptoSlice.reducer
