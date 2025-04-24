"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  selectFilteredCryptocurrencies,
  selectFavorites,
  selectFilter,
  selectSortField,
  selectSortDirection,
  setFilter,
  setSortField,
  setSortDirection,
  toggleFavorite,
  toggleLiveUpdates,
  selectIsLiveUpdatesEnabled,
} from "@/lib/cryptoSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star, ArrowUpDown, Zap, ZapOff } from "lucide-react"
import PriceChart from "@/components/PriceChart"

export default function CryptocurrencyTable() {
  const dispatch = useDispatch()
  const cryptocurrencies = useSelector(selectFilteredCryptocurrencies)
  const favorites = useSelector(selectFavorites)
  const currentFilter = useSelector(selectFilter)
  const sortField = useSelector(selectSortField)
  const sortDirection = useSelector(selectSortDirection)
  const isLiveUpdatesEnabled = useSelector(selectIsLiveUpdatesEnabled)

  // State for the cryptocurrency to show in the chart
  const [selectedCrypto, setSelectedCrypto] = useState<number | null>(null)

  const handleToggleFavorite = (id: number) => {
    dispatch(toggleFavorite(id))
  }

  const handleSortChange = (field: string) => {
    if (field === sortField) {
      // If clicking the same field, toggle direction
      dispatch(setSortDirection(sortDirection === "asc" ? "desc" : "asc"))
    } else {
      // If clicking a new field, set it as the sort field with default desc direction
      dispatch(setSortField(field as any))
      dispatch(setSortDirection("desc"))
    }
  }

  const handleFilterChange = (filter: string) => {
    dispatch(setFilter(filter as any))
  }

  const handleToggleLiveUpdates = () => {
    dispatch(toggleLiveUpdates())
  }

  const getPercentageClass = (value: number) => {
    return value >= 0 ? "text-green-500" : "text-red-500"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cryptocurrency Prices</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant={currentFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("all")}
          >
            All
          </Button>
          <Button
            variant={currentFilter === "favorites" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("favorites")}
          >
            Favorites
          </Button>
          <Button
            variant={currentFilter === "gainers" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("gainers")}
          >
            Top Gainers
          </Button>
          <Button
            variant={currentFilter === "losers" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("losers")}
          >
            Top Losers
          </Button>
          <Button variant="outline" size="sm" onClick={handleToggleLiveUpdates}>
            {isLiveUpdatesEnabled ? (
              <>
                <Zap className="h-4 w-4 mr-1 text-yellow-500" /> Live
              </>
            ) : (
              <>
                <ZapOff className="h-4 w-4 mr-1" /> Paused
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {selectedCrypto !== null && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              {cryptocurrencies.find((c) => c.id === selectedCrypto)?.name} Price Chart
            </h3>
            <PriceChart priceHistory={cryptocurrencies.find((c) => c.id === selectedCrypto)?.priceHistory || []} />
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setSelectedCrypto(null)}>
              Close Chart
            </Button>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSortChange("name")}
                    className="flex items-center"
                  >
                    Name
                    {sortField === "name" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSortChange("price")}
                    className="flex items-center justify-end ml-auto"
                  >
                    Price
                    {sortField === "price" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSortChange("change24h")}
                    className="flex items-center justify-end ml-auto"
                  >
                    24h %{sortField === "change24h" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSortChange("marketCap")}
                    className="flex items-center justify-end ml-auto"
                  >
                    Market Cap
                    {sortField === "marketCap" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSortChange("volume24h")}
                    className="flex items-center justify-end ml-auto"
                  >
                    Volume (24h)
                    {sortField === "volume24h" && <ArrowUpDown className="ml-1 h-4 w-4" />}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cryptocurrencies.map((crypto) => (
                <TableRow key={crypto.id}>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(crypto.id)}>
                      <Star
                        className={`h-4 w-4 ${favorites.includes(crypto.id) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                      />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="font-medium">{crypto.name}</div>
                      <div className="ml-2 text-muted-foreground">{crypto.symbol}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className={`text-right ${getPercentageClass(crypto.change24h)}`}>
                    {crypto.change24h > 0 ? "+" : ""}
                    {crypto.change24h.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">${crypto.marketCap.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${crypto.volume24h.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedCrypto(crypto.id)}>
                      View Chart
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
