"use client"
import { formatCurrency } from "../utils/formatters"
import { TrendingUp, TrendingDown, BarChart2, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"

const MarketOverview = () => {
  // Add client-side only rendering
  const [isClient, setIsClient] = useState(false)
  const [cryptos, setCryptos] = useState([])

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only access Redux store on the client
  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      try {
        // Safely access Redux store
        const state = require("../app/store").store.getState()
        setCryptos(state.crypto.cryptos)
      } catch (error) {
        console.error("Failed to access Redux store:", error)
        setCryptos([])
      }
    }
  }, [isClient])

  // Calculate total market cap
  const totalMarketCap = cryptos.reduce((sum, crypto) => sum + crypto.marketCap, 0)

  // Calculate total 24h volume
  const total24hVolume = cryptos.reduce((sum, crypto) => sum + crypto.volume24h, 0)

  // Calculate BTC dominance
  const btcMarketCap = cryptos.find((crypto) => crypto.id === "bitcoin")?.marketCap || 0
  const btcDominance = (btcMarketCap / totalMarketCap) * 100

  // Calculate average 24h change
  const avg24hChange = cryptos.reduce((sum, crypto) => sum + crypto.change24h, 0) / cryptos.length

  // Show a loading state during SSR
  if (!isClient || typeof window === "undefined") {
    return <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">Loading market data...</div>
  }

  return (
    <div className="mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Market Cap</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalMarketCap)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <BarChart2 className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">24h Volume</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{formatCurrency(total24hVolume)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 flex items-center justify-center mr-3">
              <img
                src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png"
                alt="Bitcoin"
                className="h-8 w-8"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">BTC Dominance</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{btcDominance.toFixed(1)}%</p>
            </div>
          </div>
          <div className="flex items-center">
            {avg24hChange >= 0 ? (
              <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-500 mr-3" />
            )}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Market Trend (24h)</p>
              <p className={`text-xl font-semibold ${avg24hChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                {avg24hChange > 0 ? "+" : ""}
                {avg24hChange.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cryptocurrency Prices by Market Cap</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Top 100
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Gainers
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Losers
          </button>
        </div>
      </div>
    </div>
  )
}

export default MarketOverview
