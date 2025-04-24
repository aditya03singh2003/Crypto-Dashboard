"use client"

import { useSelector } from "react-redux"
import { selectCryptocurrencies, selectIsLiveUpdatesEnabled } from "@/lib/cryptoSlice"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

const MarketOverviewBanner = ({ liveUpdates }) => {
  const cryptocurrencies = useSelector(selectCryptocurrencies)
  const isLiveUpdatesEnabled = useSelector(selectIsLiveUpdatesEnabled)

  const [marketData, setMarketData] = useState({
    totalMarketCap: 0,
    volume24h: 0,
    btcDominance: 0,
  })

  useEffect(() => {
    // Calculate market data from cryptocurrencies
    const totalMarketCap = cryptocurrencies.reduce((sum, crypto) => sum + crypto.marketCap, 0)
    const volume24h = cryptocurrencies.reduce((sum, crypto) => sum + crypto.volume24h, 0)

    // Calculate BTC dominance
    const btcMarketCap = cryptocurrencies.find((c) => c.symbol === "BTC")?.marketCap || 0
    const btcDominance = (btcMarketCap / totalMarketCap) * 100

    setMarketData({
      totalMarketCap: totalMarketCap / 1e12, // Convert to trillions
      volume24h: volume24h / 1e9, // Convert to billions
      btcDominance,
    })
  }, [cryptocurrencies])

  return (
    <Card className="mb-4">
      <CardContent className="py-2">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="font-semibold">Total Market Cap:</span> ${marketData.totalMarketCap.toFixed(2)}T
          </div>
          <div className="text-sm">
            <span className="font-semibold">24h Volume:</span> ${marketData.volume24h.toFixed(1)}B
          </div>
          <div className="text-sm">
            <span className="font-semibold">BTC Dominance:</span> {marketData.btcDominance.toFixed(1)}%
          </div>
          <div className="text-sm">
            <span className={`font-semibold ${isLiveUpdatesEnabled ? "text-green-500" : "text-gray-500"}`}>
              {isLiveUpdatesEnabled ? "Live Updates: On" : "Live Updates: Off"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MarketOverviewBanner
