"use client"
import { TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { selectCryptos } from "../features/crypto/cryptoSelectors"

const MarketOverview = () => {
  const [mounted, setMounted] = useState(false)
  const cryptos = useSelector(selectCryptos)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !cryptos || cryptos.length === 0) {
    return null
  }

  // Calculate total market cap
  const totalMarketCap = cryptos.reduce((sum, crypto) => sum + crypto.marketCap, 0)

  // Calculate BTC dominance
  const btcMarketCap = cryptos.find((crypto) => crypto.id === "bitcoin")?.marketCap || 0
  const btcDominance = (btcMarketCap / totalMarketCap) * 100

  // Calculate average 24h change
  const avg24hChange = cryptos.reduce((sum, crypto) => sum + crypto.change24h, 0) / cryptos.length

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <div>
            <p className="text-gray-400">BTC Dominance</p>
            <p className="text-xl font-semibold text-white">{btcDominance.toFixed(1)}%</p>
          </div>
        </div>
        <div className="flex items-center">
          <div>
            <p className="text-gray-400">Market Trend (24h)</p>
            <div className="flex items-center">
              <TrendingUp className={`h-5 w-5 mr-1 ${avg24hChange >= 0 ? "text-green-500" : "text-red-500"}`} />
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
