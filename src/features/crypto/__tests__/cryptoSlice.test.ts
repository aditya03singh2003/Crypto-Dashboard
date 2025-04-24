import cryptoReducer, {
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
    theme: "system" as const,
    currency: "USD",
    userPortfolio: {},
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
      }),
    )
  })

  it("should handle updateCryptoData", () => {
    const mockData = [{ id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 50000 }] as any[]

    const actual = cryptoReducer(initialState, updateCryptoData(mockData))
    expect(actual.cryptos).toEqual(mockData)
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
    const actual = cryptoReducer(initialState, setFilter("favorites"))
    expect(actual.filter).toEqual("favorites")
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

  it("should handle setTheme", () => {
    const actual = cryptoReducer(initialState, setTheme("dark"))
    expect(actual.theme).toEqual("dark")
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
})
