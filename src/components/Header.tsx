"use client"

import type React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Search, Bell, Menu } from "lucide-react"
import { setSortBy, setSortDirection, setFilter } from "../features/crypto/cryptoSlice"
import { selectFilter } from "../features/crypto/cryptoSelectors"
import type { SortDirection, FilterType } from "../types"
import { Link } from "react-router-dom"
import { ThemeToggle } from "./ThemeToggle"
import { useState, useEffect } from "react"

const Header = () => {
  // Add client-side only rendering
  const [isClient, setIsClient] = useState(false)
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all")

  useEffect(() => {
    setIsClient(true)
  }, [])

  const dispatch = useDispatch()
  // Only access Redux store on the client
  const filter = useSelector(selectFilter)

  useEffect(() => {
    if (isClient) {
      setCurrentFilter(filter)
    }
  }, [isClient, filter])

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortBy(e.target.value))
  }

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortDirection(e.target.value as SortDirection))
  }

  const handleFilterChange = (filter: FilterType) => {
    dispatch(setFilter(filter))
  }

  // Show a simplified header during SSR
  if (!isClient) {
    return (
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CryptoTracker</h1>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/logo.png" alt="CryptoTracker" className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CryptoTracker</h1>

            <nav className="hidden md:flex ml-8">
              <Link
                to="/"
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Cryptocurrencies
              </Link>
              <Link
                to="/exchanges"
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Exchanges
              </Link>
              <Link
                to="/nft"
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                NFT
              </Link>
              <Link
                to="/portfolio"
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Portfolio
              </Link>
            </nav>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-by" className="text-sm text-gray-700 dark:text-gray-300">
                Sort by:
              </label>
              <select
                id="sort-by"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={handleSortChange}
                defaultValue="marketCap"
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
              <label htmlFor="sort-direction" className="text-sm text-gray-700 dark:text-gray-300">
                Direction:
              </label>
              <select
                id="sort-direction"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={handleDirectionChange}
                defaultValue="desc"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <ThemeToggle />

            <button
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>

            <button
              className="md:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mt-4 flex overflow-x-auto pb-2">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap ${
              currentFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            } transition-colors`}
          >
            All Cryptocurrencies
          </button>
          <button
            onClick={() => handleFilterChange("favorites")}
            className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap ${
              currentFilter === "favorites"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            } transition-colors`}
          >
            Favorites
          </button>
          <button
            onClick={() => handleFilterChange("gainers")}
            className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap ${
              currentFilter === "gainers"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            } transition-colors`}
          >
            Top Gainers
          </button>
          <button
            onClick={() => handleFilterChange("losers")}
            className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap ${
              currentFilter === "losers"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            } transition-colors`}
          >
            Top Losers
          </button>
          <button
            onClick={() => handleFilterChange("trending")}
            className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap ${
              currentFilter === "trending"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            } transition-colors`}
          >
            Trending
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
