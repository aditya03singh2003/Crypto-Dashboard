import cryptoReducer, {
  updateCryptoData,
  setSortBy,
  setSortDirection,
  setFilter,
  toggleFavorite,
  setWebSocketActive,
} from "../cryptoSlice"
import { initialCryptoData } from "../../../data/initialCryptoData"

describe("crypto reducer", () => {
  const initialState = {
    cryptos: initialCryptoData,
    sortBy: "marketCap",
    sortDirection: "desc" as const,
    filter: "all" as const,
    favorites: [],
    webSocketActive: false,
  }

  it("should handle initial state", () => {
    expect(cryptoReducer(undefined, { type: "unknown" })).toEqual(
      expect.objectContaining({
        cryptos: initialCryptoData,
        sortBy: "marketCap",
        sortDirection: "desc",
        filter: "all",
        favorites: expect.any(Array),
        webSocketActive: false,
      }),
    )
  })

  it("should handle updateCryptoData", () => {
    const updatedCryptos = [...initialCryptoData]
    updatedCryptos[0] = { ...updatedCryptos[0], price: 99999.99 }

    const actual = cryptoReducer(initialState, updateCryptoData(updatedCryptos))
    expect(actual.cryptos[0].price).toEqual(99999.99)
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
    const stateWithFavorite = {
      ...initialState,
      favorites: ["bitcoin"],
    }
    const actual = cryptoReducer(stateWithFavorite, toggleFavorite("bitcoin"))
    expect(actual.favorites).not.toContain("bitcoin")
  })

  it("should handle setWebSocketActive", () => {
    const actual = cryptoReducer(initialState, setWebSocketActive(true))
    expect(actual.webSocketActive).toEqual(true)
  })
})
