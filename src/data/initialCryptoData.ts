import type { Crypto } from "../types"

// Generate random sparkline data for the last 7 days
const generateSparklineData = (basePrice: number, volatility = 0.05, trend = 0): number[] => {
  const data: number[] = []
  let currentPrice = basePrice

  for (let i = 0; i < 50; i++) {
    // Add a slight trend bias
    const trendBias = trend * 0.002
    const change = (Math.random() * 2 - 1 + trendBias) * volatility
    currentPrice = currentPrice * (1 + change)
    data.push(currentPrice)
  }

  return data
}

export const initialCryptoData: Crypto[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    price: 93759.48,
    change1h: 0.43,
    change24h: 0.93,
    change7d: 11.11,
    marketCap: 1861618902186,
    volume24h: 43874950947,
    volumeInCrypto: 467810,
    circulatingSupply: 19850000,
    maxSupply: 21000000,
    sparkline7d: generateSparklineData(93759.48, 0.02, 1), // Positive trend
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    price: 1802.46,
    change1h: 0.6,
    change24h: 3.21,
    change7d: 13.68,
    marketCap: 217581279327,
    volume24h: 23547469307,
    volumeInCrypto: 13050000,
    circulatingSupply: 120710000,
    maxSupply: null,
    sparkline7d: generateSparklineData(1802.46, 0.03, 1), // Positive trend
  },
  {
    id: "tether",
    name: "Tether",
    symbol: "USDT",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    price: 1.0,
    change1h: 0.0,
    change24h: 0.0,
    change7d: 0.04,
    marketCap: 145320022085,
    volume24h: 92288882007,
    volumeInCrypto: 92250000000,
    circulatingSupply: 145270000000,
    maxSupply: null,
    sparkline7d: generateSparklineData(1.0, 0.001, 0), // Stable
  },
  {
    id: "ripple",
    name: "XRP",
    symbol: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    price: 2.22,
    change1h: 0.46,
    change24h: 0.54,
    change7d: 6.18,
    marketCap: 130073814966,
    volume24h: 5131481491,
    volumeInCrypto: 2300000000,
    circulatingSupply: 58390000000,
    maxSupply: 100000000000,
    sparkline7d: generateSparklineData(2.22, 0.025, 1), // Positive trend
  },
  {
    id: "bnb",
    name: "BNB",
    symbol: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    price: 606.65,
    change1h: 0.09,
    change24h: -1.2,
    change7d: 3.73,
    marketCap: 85471956947,
    volume24h: 1874281784,
    volumeInCrypto: 3080000,
    circulatingSupply: 140890000,
    maxSupply: 200000000,
    sparkline7d: generateSparklineData(606.65, 0.02, 0.5), // Slight positive trend
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    price: 151.51,
    change1h: 0.53,
    change24h: 1.26,
    change7d: 14.74,
    marketCap: 78381958631,
    volume24h: 4881674486,
    volumeInCrypto: 32250000,
    circulatingSupply: 517310000,
    maxSupply: null,
    sparkline7d: generateSparklineData(151.51, 0.03, 1), // Positive trend
  },
]
