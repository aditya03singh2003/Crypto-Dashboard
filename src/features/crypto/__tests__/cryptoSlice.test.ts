import cryptoReducer, {
  updateCryptoData,
  setSortBy,
  setSortDirection,
  setFilter,
  toggleFavorite,
  setWebSocketActive,
  setWebSocketOptions,
  setTheme,
  setCurrency,
  updatePortfolio,
  clearPortfolio,
  setSearchTerm,
  setLoading,
  setError,
} from "../cryptoSlice"
import { initialCryptoData } from "../../../data/initialCryptoData"
import { describe, it, expect } from "@jest/globals"

describe("crypto reducer", () => {
  const initialState = {
    cryptos: initialCryptoData,
    sortBy: "marketCap",
    sortDirection: "desc" as const,
    filter: "all" as const,
    favorites: [],
    webSocketActive: false,
    webSocketOptions: {
      updateFrequency: 2000,
      volatility: 0.01,
    },
    theme: "dark" as const,
    currency: "USD",
    userPortfolio: {},
    searchTerm: "",
    isLoading: false,
    error: null,
  }

  it("should handle initial state", () => {
    expect(cryptoReducer(undefined, { type: "unknown" })).toEqual(
      expect.objectContaining({
        cryptos: expect.any(Array),
        sortBy: "marketCap",
        sortDirection: "desc",
        filter: "all",
        favorites: expect.any(Array),
        webSocketActive: false,
        theme: expect.any(String),
        currency: expect.any(String),
        userPortfolio: expect.any(Object),
        searchTerm: "",
        isLoading: false,
        error: null,
      }),
    )
  })

  it("should handle updateCryptoData", () => {
    const mockData = [{ id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 50000 }] as any[]

    const actual = cryptoReducer(initialState, updateCryptoData(mockData))
    expect(actual.cryptos).toEqual(mockData)
    expect(actual.isLoading).toBe(false)
    expect(actual.error).toBeNull()
  })

  it("should handle setSortBy", () => {
    const actual = cryptoReducer(initialState, setSortBy("price"))
    expect(actual.sortBy).toEqual("price")
  })

  it("should handle setSortDirection", () => {
    const actual = cryptoReducer(initialState, setSortDirection("asc"))
    expect(actual.sortDirection).toEqual("asc")
  })

  it("should handle setFilter", () => {
    const actual = cryptoReducer(initialState, setFilter("gainers"))
    expect(actual.filter).toEqual("gainers")
  })

  it("should handle toggleFavorite - add to favorites", () => {
    const actual = cryptoReducer(initialState, toggleFavorite("bitcoin"))
    expect(actual.favorites).toContain("bitcoin")
  })

  it("should handle toggleFavorite - remove from favorites", () => {
    const state = {
      ...initialState,
      favorites: ["bitcoin", "ethereum"],
    }
    const actual = cryptoReducer(state, toggleFavorite("bitcoin"))
    expect(actual.favorites).not.toContain("bitcoin")
    expect(actual.favorites).toContain("ethereum")
  })

  it("should handle setWebSocketActive", () => {
    const actual = cryptoReducer(initialState, setWebSocketActive(true))
    expect(actual.webSocketActive).toEqual(true)
  })

  it("should handle setWebSocketOptions", () => {
    const options = { updateFrequency: 5000, volatility: 0.02 }
    const actual = cryptoReducer(initialState, setWebSocketOptions(options))
    expect(actual.webSocketOptions).toEqual(options)
  })

  it("should handle setTheme", () => {
    const actual = cryptoReducer(initialState, setTheme("light"))
    expect(actual.theme).toEqual("light")
  })

  it("should handle setCurrency", () => {
    const actual = cryptoReducer(initialState, setCurrency("EUR"))
    expect(actual.currency).toEqual("EUR")
  })

  it("should handle updatePortfolio - add asset", () => {
    const actual = cryptoReducer(initialState, updatePortfolio({ symbol: "BTC", amount: 1.5 }))
    expect(actual.userPortfolio).toEqual({ BTC: 1.5 })
  })

  it("should handle updatePortfolio - update asset", () => {
    const state = {
      ...initialState,
      userPortfolio: { BTC: 1.0, ETH: 5.0 },
    }
    const actual = cryptoReducer(state, updatePortfolio({ symbol: "BTC", amount: 2.5 }))
    expect(actual.userPortfolio).toEqual({ BTC: 2.5, ETH: 5.0 })
  })

  it("should handle updatePortfolio - remove asset", () => {
    const state = {
      ...initialState,
      userPortfolio: { BTC: 1.0, ETH: 5.0 },
    }
    const actual = cryptoReducer(state, updatePortfolio({ symbol: "BTC", amount: 0 }))
    expect(actual.userPortfolio).toEqual({ ETH: 5.0 })
  })

  it("should handle clearPortfolio", () => {
    const state = {
      ...initialState,
      userPortfolio: { BTC: 1.0, ETH: 5.0 },
    }
    const actual = cryptoReducer(state, clearPortfolio())
    expect(actual.userPortfolio).toEqual({})
  })

  it("should handle setSearchTerm", () => {
    const actual = cryptoReducer(initialState, setSearchTerm("bitcoin"))
    expect(actual.searchTerm).toEqual("bitcoin")
  })

  it("should handle setLoading", () => {
    const actual = cryptoReducer(initialState, setLoading(true))
    expect(actual.isLoading).toEqual(true)
  })

  it("should handle setError", () => {
    const errorMessage = "Connection failed"
    const actual = cryptoReducer(initialState, setError(errorMessage))
    expect(actual.error).toEqual(errorMessage)
    expect(actual.isLoading).toEqual(false)
  })
})
