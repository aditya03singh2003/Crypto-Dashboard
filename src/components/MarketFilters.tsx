"use client"

import type React from "react"

import { useDispatch, useSelector } from "react-redux"
import { setFilter } from "../features/crypto/cryptoSlice"
import { selectFilter } from "../features/crypto/cryptoSelectors"
import type { FilterType } from "../types"
import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, BarChart2, DollarSign, Star } from "lucide-react"

const MarketFilters = () => {
  const dispatch = useDispatch()
  const currentFilter = useSelector(selectFilter)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleFilterChange = (filter: FilterType) => {
    dispatch(setFilter(filter))
  }

  if (!mounted) return null

  const filterOptions: { label: string; value: FilterType; icon: React.ReactNode }[] = [
    { label: "All", value: "all", icon: <BarChart2 className="w-4 h-4 mr-2" /> },
    { label: "Top Gainers", value: "gainers", icon: <TrendingUp className="w-4 h-4 mr-2 text-green-500" /> },
    { label: "Top Losers", value: "losers", icon: <TrendingDown className="w-4 h-4 mr-2 text-red-500" /> },
    { label: "Highest Volume", value: "volume", icon: <BarChart2 className="w-4 h-4 mr-2 text-blue-500" /> },
    { label: "Largest Market Cap", value: "marketCap", icon: <DollarSign className="w-4 h-4 mr-2 text-yellow-500" /> },
    { label: "Favorites", value: "favorites", icon: <Star className="w-4 h-4 mr-2 text-yellow-400" /> },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-2 my-4">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleFilterChange(option.value)}
          className={`px-4 py-2 rounded-lg flex items-center ${
            currentFilter === option.value
              ? "bg-blue-600 text-white"
              : "bg-gray-700 dark:bg-gray-700 text-white dark:text-white hover:bg-gray-600 dark:hover:bg-gray-600"
          } transition-colors`}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default MarketFilters
