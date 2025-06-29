export interface Crypto {
  id: string
  name: string
  symbol: string
  image: string
  price: number
  change1h: number
  change24h: number
  change7d: number
  marketCap: number
  volume24h: number
  volumeInCrypto: number
  circulatingSupply: number
  maxSupply: number | null
  sparkline7d: number[]
}

export type SortDirection = "asc" | "desc"
export type FilterType = "all" | "favorites" | "gainers" | "losers" | "trending" | "volume" | "marketCap"

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  currency: string
  sortBy: string
  sortDirection: SortDirection
  filter: FilterType
}

export interface WebSocketOptions {
  updateFrequency?: number
  volatility?: number
}

export interface PortfolioAsset {
  id: string
  name: string
  symbol: string
  image: string
  amount: number
  price: number
  value: number
  change24h: number
  change7d: number
}
