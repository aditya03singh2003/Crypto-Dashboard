"use client"

import type React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Search, Moon, Sun, BarChart2 } from "lucide-react"
import { setSortBy, setSortDirection, setCurrency, setTheme } from "../features/crypto/cryptoSlice"
import { selectSortConfig, selectCurrency, selectTheme } from "../features/crypto/cryptoSelectors"
import type { SortDirection } from "../types"
import { useEffect, useState } from "react"

const Header = () => {
  const dispatch = useDispatch()
  const { sortBy, sortDirection } = useSelector(selectSortConfig)
  const currency = useSelector(selectCurrency)
  const theme = useSelector(selectTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortBy(e.target.value))
  }

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortDirection(e.target.value as SortDirection))
  }

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCurrency(e.target.value))
  }

  const toggleTheme = () => {
    dispatch(setTheme(theme === "dark" ? "light" : "dark"))
  }

  if (!mounted) return null

  return (
    <header className="bg-gray-800 dark:bg-gray-800 py-3 px-4 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo and Name */}
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BarChart2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">CryptoTracker Pro</h1>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white w-full sm:w-auto min-w-[250px]"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-white">Currency:</span>
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className="bg-gray-700 border border-gray-600 text-white rounded-lg p-2"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white">Sort by:</span>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="bg-gray-700 border border-gray-600 text-white rounded-lg p-2"
            >
              <option value="marketCap">Market Cap</option>
              <option value="price">Price</option>
              <option value="name">Name</option>
              <option value="change1h">1h %</option>
              <option value="change24h">24h %</option>
              <option value="change7d">7d %</option>
              <option value="volume24h">Volume (24h)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white">Direction:</span>
            <select
              value={sortDirection}
              onChange={handleDirectionChange}
              className="bg-gray-700 border border-gray-600 text-white rounded-lg p-2"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
