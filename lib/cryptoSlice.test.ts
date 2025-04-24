import cryptoReducer, {
  updateCryptoData,
  toggleFavorite,
  setSortField,
  setSortDirection,
  setFilter,
  toggleLiveUpdates,
  selectFilteredCryptocurrencies,
} from "./cryptoSlice"
import { cryptocurrencies } from "./mockData"

describe("crypto reducer", () => {
  const initialState = {
    cryptocurrencies,
    favorites: [1, 2],
    sortField: "marketCap",
    sortDirection: "desc",
    filter: "all",
    isLiveUpdatesEnabled: true,
  }

  it("should handle initial state", () => {
    expect(cryptoReducer(undefined, { type: "unknown" })).toEqual(
      expect.objectContaining({
        cryptocurrencies: expect.any(Array),
        favorites: expect.any(Array),
        sortField: expect.any(String),
        sortDirection: expect.any(String),
        filter: expect.any(String),
        isLiveUpdatesEnabled: expect.any(Boolean),
      }),
    )
  })

  it("should handle updateCryptoData", () => {
    const updatedCryptos = [...cryptocurrencies]
    updatedCryptos[0] = { ...updatedCryptos[0], price: 99999.99 }

    const actual = cryptoReducer(initialState, updateCryptoData(updatedCryptos))
    expect(actual.cryptocurrencies[0].price).toEqual(99999.99)
  })

  it("should handle toggleFavorite - add to favorites", () => {
    const actual = cryptoReducer(initialState, toggleFavorite(3))
    expect(actual.favorites).toContain(3)
  })

  it("should handle toggleFavorite - remove from favorites", () => {
    const actual = cryptoReducer(initialState, toggleFavorite(1))
    expect(actual.favorites).not.toContain(1)
  })

  it("should handle setSortField", () => {
    const actual = cryptoReducer(initialState, setSortField("price"))
    expect(actual.sortField).toEqual("price")
  })

  it("should handle setSortDirection", () => {
    const actual = cryptoReducer(initialState, setSortDirection("asc"))
    expect(actual.sortDirection).toEqual("asc")
  })

  it("should handle setFilter", () => {
    const actual = cryptoReducer(initialState, setFilter("favorites"))
    expect(actual.filter).toEqual("favorites")
  })

  it("should handle toggleLiveUpdates", () => {
    const actual = cryptoReducer(initialState, toggleLiveUpdates())
    expect(actual.isLiveUpdatesEnabled).toEqual(false)
  })
})

describe("crypto selectors", () => {
  it("should select filtered cryptocurrencies - all", () => {
    const state = {
      crypto: {
        cryptocurrencies,
        favorites: [1, 2],
        sortField: "marketCap",
        sortDirection: "desc",
        filter: "all",
      },
    }

    const result = selectFilteredCryptocurrencies(state)
    expect(result.length).toEqual(cryptocurrencies.length)
    // Check sorting by marketCap desc
    expect(result[0].marketCap).toBeGreaterThanOrEqual(result[1].marketCap)
  })

  it("should select filtered cryptocurrencies - favorites", () => {
    const state = {
      crypto: {
        cryptocurrencies,
        favorites: [1, 2],
        sortField: "marketCap",
        sortDirection: "desc",
        filter: "favorites",
      },
    }

    const result = selectFilteredCryptocurrencies(state)
    expect(result.length).toEqual(2)
    expect(result.every((crypto) => [1, 2].includes(crypto.id))).toBeTruthy()
  })

  it("should select filtered cryptocurrencies - gainers", () => {
    const state = {
      crypto: {
        cryptocurrencies,
        favorites: [1, 2],
        sortField: "marketCap",
        sortDirection: "desc",
        filter: "gainers",
      },
    }

    const result = selectFilteredCryptocurrencies(state)
    expect(result.length).toBeLessThanOrEqual(10)
    // Check sorting by change24h desc
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].change24h).toBeGreaterThanOrEqual(result[i + 1].change24h)
    }
  })

  it("should select filtered cryptocurrencies - losers", () => {
    const state = {
      crypto: {
        cryptocurrencies,
        favorites: [1, 2],
        sortField: "marketCap",
        sortDirection: "desc",
        filter: "losers",
      },
    }

    const result = selectFilteredCryptocurrencies(state)
    expect(result.length).toBeLessThanOrEqual(10)
    // Check sorting by change24h asc
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].change24h).toBeLessThanOrEqual(result[i + 1].change24h)
    }
  })
})
