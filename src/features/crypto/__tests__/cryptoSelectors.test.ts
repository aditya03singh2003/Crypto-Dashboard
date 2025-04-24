import {
  selectCryptos,
  selectFavorites,
  selectFilteredCryptos,
  selectSortedCryptos,
  selectTopGainers,
  selectTopLosers,
} from "../cryptoSelectors"
import type { RootState } from "../../../app/store"

describe("crypto selectors", () => {
  const mockState = {
    crypto: {
      cryptos: [
        { id: "bitcoin", name: "Bitcoin", symbol: "BTC", change24h: 5, volume24h: 1000, marketCap: 1000 },
        { id: "ethereum", name: "Ethereum", symbol: "ETH", change24h: -2, volume24h: 500, marketCap: 500 },
        { id: "ripple", name: "XRP", symbol: "XRP", change24h: 10, volume24h: 300, marketCap: 300 },
        { id: "cardano", name: "Cardano", symbol: "ADA", change24h: -5, volume24h: 200, marketCap: 200 },
        { id: "solana", name: "Solana", symbol: "SOL", change24h: 8, volume24h: 800, marketCap: 800 },
      ],
      favorites: ["bitcoin", "solana"],
      sortBy: "marketCap",
      sortDirection: "desc",
      filter: "all",
      webSocketActive: true,
    },
  } as unknown as RootState

  it("should select cryptos", () => {
    const result = selectCryptos(mockState)
    expect(result).toEqual(mockState.crypto.cryptos)
  })

  it("should select favorites", () => {
    const result = selectFavorites(mockState)
    expect(result).toEqual(["bitcoin", "solana"])
  })

  it("should filter cryptos by favorites", () => {
    const stateWithFavoritesFilter = {
      ...mockState,
      crypto: {
        ...mockState.crypto,
        filter: "favorites",
      },
    } as unknown as RootState

    const result = selectFilteredCryptos(stateWithFavoritesFilter)
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe("bitcoin")
    expect(result[1].id).toBe("solana")
  })

  it("should filter cryptos by gainers", () => {
    const stateWithGainersFilter = {
      ...mockState,
      crypto: {
        ...mockState.crypto,
        filter: "gainers",
      },
    } as unknown as RootState

    const result = selectFilteredCryptos(stateWithGainersFilter)
    expect(result[0].id).toBe("ripple") // Highest change24h
    expect(result[1].id).toBe("solana")
    expect(result[2].id).toBe("bitcoin")
  })

  it("should filter cryptos by losers", () => {
    const stateWithLosersFilter = {
      ...mockState,
      crypto: {
        ...mockState.crypto,
        filter: "losers",
      },
    } as unknown as RootState

    const result = selectFilteredCryptos(stateWithLosersFilter)
    expect(result[0].id).toBe("cardano") // Lowest change24h
    expect(result[1].id).toBe("ethereum")
  })

  it("should sort cryptos by market cap descending", () => {
    const result = selectSortedCryptos(mockState)
    expect(result[0].id).toBe("bitcoin")
    expect(result[1].id).toBe("solana")
    expect(result[2].id).toBe("ethereum")
  })

  it("should sort cryptos by market cap ascending", () => {
    const stateWithAscSort = {
      ...mockState,
      crypto: {
        ...mockState.crypto,
        sortDirection: "asc",
      },
    } as unknown as RootState

    const result = selectSortedCryptos(stateWithAscSort)
    expect(result[0].id).toBe("cardano")
    expect(result[1].id).toBe("ripple")
    expect(result[2].id).toBe("ethereum")
  })

  it("should select top gainers", () => {
    const result = selectTopGainers(mockState)
    expect(result[0].id).toBe("ripple")
    expect(result[1].id).toBe("solana")
    expect(result[2].id).toBe("bitcoin")
  })

  it("should select top losers", () => {
    const result = selectTopLosers(mockState)
    expect(result[0].id).toBe("cardano")
    expect(result[1].id).toBe("ethereum")
  })
})
