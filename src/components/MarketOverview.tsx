"use client"
import { TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { selectCryptos, selectTheme } from "../features/crypto/cryptoSelectors"

const MarketOverview = () => {
  const [mounted, setMounted] = useState(false)
  const cryptos = useSelector(selectCryptos)
  const theme = useSelector(selectTheme)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !cryptos || cryptos.length === 0) {
    return null
  }

  const totalMarketCap = cryptos.reduce((sum, crypto) => sum + crypto.marketCap, 0)
  const btcMarketCap = cryptos.find((crypto) => crypto.symbol === "BTC")?.marketCap || 0
  const btcDominance = (btcMarketCap / totalMarketCap) * 100
  const avg24hChange = cryptos.reduce((sum, crypto) => sum + crypto.change24h, 0) / cryptos.length

  return (
    <div
      className={`p-4 rounded-lg mb-6 shadow ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <div>
            <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>BTC Dominance</p>
            <p className="text-xl font-semibold">{btcDominance.toFixed(1)}%</p>
          </div>
        </div>
        <div className="flex items-center">
          <div>
            <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Market Trend (24h)</p>
            <div className="flex items-center">
              <TrendingUp
                className={`h-5 w-5 mr-1 ${avg24hChange >= 0 ? "text-green-500" : "text-red-500"}`}
              />
              <p className={`text-xl font-semibold ${avg24hChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                {avg24hChange > 0 ? "+" : ""}
                {avg24hChange.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketOverview
