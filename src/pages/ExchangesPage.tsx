"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"

const exchangesData = [
  {
    id: 1,
    name: "Binance",
    logo: "https://assets.coingecko.com/markets/images/52/small/binance.jpg",
    trustScore: 10,
    volume24h: 12456789012,
    country: "Global",
    established: 2017,
    website: "https://binance.com",
  },
  {
    id: 2,
    name: "Coinbase Exchange",
    logo: "https://assets.coingecko.com/markets/images/23/small/Coinbase_Coin_Primary.png",
    trustScore: 10,
    volume24h: 8765432109,
    country: "United States",
    established: 2012,
    website: "https://coinbase.com",
  },
  {
    id: 3,
    name: "Kraken",
    logo: "https://assets.coingecko.com/markets/images/29/small/kraken.jpg",
    trustScore: 10,
    volume24h: 5678901234,
    country: "United States",
    established: 2011,
    website: "https://kraken.com",
  },
  {
    id: 4,
    name: "KuCoin",
    logo: "https://assets.coingecko.com/markets/images/61/small/kucoin.png",
    trustScore: 9,
    volume24h: 4567890123,
    country: "Seychelles",
    established: 2017,
    website: "https://kucoin.com",
  },
  {
    id: 5,
    name: "Bybit",
    logo: "https://assets.coingecko.com/markets/images/698/small/bybit_spot.png",
    trustScore: 9,
    volume24h: 3456789012,
    country: "British Virgin Islands",
    established: 2018,
    website: "https://bybit.com",
  },
]

const ExchangesPage = () => {
  // Add client-side only rendering
  const [isClient, setIsClient] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    setIsClient(true)
  }, [])

  const filteredExchanges = exchangesData.filter((exchange) =>
    exchange.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatVolume = (volume: number) => {
    if (volume >= 1e12) {
      return `$${(volume / 1e12).toFixed(2)}T`
    } else if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(2)}K`
    } else {
      return `$${volume.toFixed(2)}`
    }
  }

  // Show a loading state during SSR or if client-side rendering hasn't completed
  if (!isClient || typeof window === "undefined") {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Exchanges...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cryptocurrency Exchanges</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Find the best cryptocurrency exchanges for trading Bitcoin and other assets. Compare features, ratings, and
          reviews.
        </p>

        <div className="relative max-w-md mb-4">
          <input
            type="text"
            placeholder="Search exchanges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Exchange
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Trust Score
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                24h Volume
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Country
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Established
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Website
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredExchanges.map((exchange, index) => (
              <tr key={exchange.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={exchange.logo || "/placeholder.svg"}
                      alt={`${exchange.name} logo`}
                      className="w-8 h-8 mr-3"
                    />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{exchange.name}</div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    {exchange.trustScore}/10
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                  {formatVolume(exchange.volume24h)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                  {exchange.country}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                  {exchange.established}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                  <a
                    href={exchange.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Visit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ExchangesPage
