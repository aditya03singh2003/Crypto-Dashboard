import {
  selectCryptos,
  selectFavorites,
  selectSortConfig,
  selectFilter,
  selectFilteredCryptos,
  selectSortedCryptos,
  selectTopGainers,
  selectTopLosers,
  selectTopByVolume,
  selectPortfolioValue,
  selectPortfolioAssets,
  selectMarketStats,
} from "../cryptoSelectors"
import { describe, it, expect } from "@jest/globals"

describe("crypto selectors", () => {
  const mockCryptos = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 50000,
      change24h: 5,
      change7d: 10,
      volume24h: 1000000,
      marketCap: 1000000000,
      image: "btc.png",
      circulatingSupply: 19000000,
      maxSupply: 21000000,
      volumeInCrypto: 20,
      sparkline7d: [48000, 49000, 50000],
      change1h: 0.5,
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 3000,
      change24h: -2,
      change7d: 5,
      volume24h: 500000,
      marketCap: 500000000,
      image: "eth.png",
      circulatingSupply: 120000000,
      maxSupply: null,
      volumeInCrypto: 166.67,
      sparkline7d: [2900, 2950, 3000],
      change1h: -0.2,
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      price: 1.5,
      change24h: 10,
      change7d: -3,
      volume24h: 200000,
      marketCap: 50000000,
      image: "ada.png",
      circulatingSupply: 33333333,
      maxSupply: 45000000,
      volumeInCrypto: 133333.33,
      sparkline7d: [1.4, 1.45, 1.5],
      change1h: 1.2,
    },
  ]

  const mockState = {
    crypto: {
      cryptos: mockCryptos,
      favorites: ["bitcoin", "cardano"],
      sortBy: "marketCap",
      sortDirection: "desc",
      filter: "all",
      userPortfolio: {
        BTC: 0.5,
        ETH: 2.0,
      },
      searchTerm: "",
      isLoading: false,
      error: null,
      webSocketActive: false,
      webSocketOptions: {
        updateFrequency: 2000,
        volatility: 0.01,
      },
      theme: "dark",
      currency: "USD",
    },
  }

  it("should select cryptos", () => {
    expect(selectCryptos(mockState)).toEqual(mockCryptos)
  })

  it("should select favorites", () => {
    expect(selectFavorites(mockState)).toEqual(["bitcoin", "cardano"])
  })

  it("should select sort config", () => {
    expect(selectSortConfig(mockState)).toEqual({
      sortBy: "marketCap",
      sortDirection: "desc",
    })
  })

  it("should select filter", () => {
    expect(selectFilter(mockState)).toEqual("all")
  })

  it("should select filtered cryptos - all", () => {
    expect(selectFilteredCryptos(mockState)).toEqual(mockCryptos)
  })

  it("should select filtered cryptos - favorites", () => {
    const state = {
      ...mockState,
      crypto: {
        ...mockState.crypto,
        filter: "favorites",
      },
    }
    const result = selectFilteredCryptos(state)
    expect(result).toHaveLength(2)
    expect(result.map((c) => c.id)).toEqual(["bitcoin", "cardano"])
  })

  it("should select filtered cryptos - gainers", () => {
    const state = {
      ...mockState,
      crypto: {
        ...mockState.crypto,
        filter: "gainers",
      },
    }
    const result = selectFilteredCryptos(state)
    expect(result).toHaveLength(3)
    expect(result[0].id).toEqual("cardano") // Highest 24h change
  })

  it("should select filtered cryptos - losers", () => {
    const state = {
      ...mockState,
      crypto: {
        ...mockState.crypto,
        filter: "losers",
      },
    }
    const result = selectFilteredCryptos(state)
    expect(result).toHaveLength(3)
    expect(result[0].id).toEqual("ethereum") // Lowest 24h change
  })

  it("should select filtered cryptos - volume", () => {
    const state = {
      ...mockState,
      crypto: {
        ...mockState.crypto,
        filter: "volume",
      },
    }
    const result = selectFilteredCryptos(state)
    expect(result).toHaveLength(3)
    expect(result[0].id).toEqual("bitcoin") // Highest volume
  })

  it("should select sorted cryptos", () => {
    const result = selectSortedCryptos(mockState)
    expect(result).toHaveLength(3)
    expect(result[0].id).toEqual("bitcoin") // Highest market cap
    expect(result[1].id).toEqual("ethereum")
    expect(result[2].id).toEqual("cardano")
  })

  it("should select sorted cryptos with different sort", () => {
    const state = {
      ...mockState,
      crypto: {
        ...mockState.crypto,
        sortBy: "change24h",
        sortDirection: "desc",
      },
    }
    const result = selectSortedCryptos(state)
    expect(result).toHaveLength(3)
    expect(result[0].id).toEqual("cardano") // Highest 24h change
    expect(result[1].id).toEqual("bitcoin")
    expect(result[2].id).toEqual("ethereum")
  })

  it("should select top gainers", () => {
    const result = selectTopGainers(mockState)
    expect(result).toHaveLength(3)
    expect(result[0].id).toEqual("cardano") // Highest 24h change
  })

  it("should select top losers", () => {
    const result = selectTopLosers(mockState)
    expect(result).toHaveLength(3)
    expect(result[0].id).toEqual("ethereum") // Lowest 24h change
  })

  it("should select top by volume", () => {
    const result = selectTopByVolume(mockState)
    expect(result).toHaveLength(3)
    expect(result[0].id).toEqual("bitcoin") // Highest volume
  })

  it("should calculate portfolio value", () => {
    const result = selectPortfolioValue(mockState)
    // 0.5 BTC * 50000 + 2.0 ETH * 3000 = 25000 + 6000 = 31000
    expect(result).toEqual(31000)
  })

  it("should select portfolio assets", () => {
    const result = selectPortfolioAssets(mockState)
    expect(result).toHaveLength(2)

    expect(result[0].symbol).toEqual("BTC")
    expect(result[0].amount).toEqual(0.5)
    expect(result[0].value).toEqual(25000)

    expect(result[1].symbol).toEqual("ETH")
    expect(result[1].amount).toEqual(2.0)
    expect(result[1].value).toEqual(6000)
  })

  it("should calculate market statistics", () => {
    const result = selectMarketStats(mockState)
    expect(result.totalMarketCap).toEqual(1550000000) // Sum of all market caps
    expect(result.totalVolume).toEqual(1700000) // Sum of all volumes
    expect(result.btcDominance).toBeCloseTo(64.52, 1) // BTC market cap / total market cap * 100
    expect(result.cryptoCount).toEqual(3)
  })
})
