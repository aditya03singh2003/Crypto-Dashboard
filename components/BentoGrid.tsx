"use client"

import { useSelector } from "react-redux"
import { selectCryptocurrencies } from "@/lib/cryptoSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"

const BentoGrid = () => {
  const cryptocurrencies = useSelector(selectCryptocurrencies)

  // Get top gainer
  const topGainer = [...cryptocurrencies].sort((a, b) => b.change24h - a.change24h)[0]

  // Get top loser
  const topLoser = [...cryptocurrencies].sort((a, b) => a.change24h - b.change24h)[0]

  // Get trending (highest volume)
  const trending = [...cryptocurrencies].sort((a, b) => b.volume24h - a.volume24h)[0]

  // Calculate total market cap
  const totalMarketCap = cryptocurrencies.reduce((sum, crypto) => sum + crypto.marketCap, 0) / 1e12 // Convert to trillions

  // Calculate 24h market change
  const marketChange = cryptocurrencies.reduce((sum, crypto) => sum + crypto.change24h, 0) / cryptocurrencies.length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M2 12h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalMarketCap.toFixed(2)}T</div>
          <p className="text-xs text-muted-foreground">
            {marketChange >= 0 ? "+" : ""}
            {marketChange.toFixed(2)}% from last 24h
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Gainer</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topGainer.name}</div>
          <p className="text-xs text-muted-foreground">+{topGainer.change24h.toFixed(2)}% in last 24h</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Loser</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topLoser.name}</div>
          <p className="text-xs text-muted-foreground">{topLoser.change24h.toFixed(2)}% in last 24h</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trending</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{trending.name}</div>
          <p className="text-xs text-muted-foreground">
            ${trending.price.toLocaleString()} | Vol: ${(trending.volume24h / 1e9).toFixed(2)}B
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default BentoGrid
