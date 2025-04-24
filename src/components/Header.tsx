"use client"

import type React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Search, Menu, Newspaper } from "lucide-react"
import { setSortBy, setSortDirection, setCurrency } from "../features/crypto/cryptoSlice"
import { selectTheme, selectCurrency } from "../features/crypto/cryptoSelectors"
import type { SortDirection } from "../types"
import { Link } from "react-router-dom"
import { ThemeToggle } from "./ThemeToggle"
import { useState } from "react"

const Header = () => {
  const dispatch = useDispatch()
  const theme = useSelector(selectTheme)
  const currency = useSelector(selectCurrency)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortBy(e.target.value))
  }

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortDirection(e.target.value as SortDirection))
  }

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCurrency(e.target.value))
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-2">
              <span className="font-bold">C</span>
            </div>
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
                to="/news"
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                News
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
              <label htmlFor="currency" className="text-sm text-gray-700 dark:text-gray-300">
                Currency:
              </label>
              <select
                id="currency"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={handleCurrencyChange}
                value={currency}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
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

            <Link to="/news">
              <button
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="News"
              >
                <Newspaper size={20} />
              </button>
            </Link>

            <button
              className="md:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Menu"
              onClick={toggleMenu}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Cryptocurrencies
              </Link>
              <Link
                to="/exchanges"
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Exchanges
              </Link>
              <Link
                to="/nft"
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                NFT
              </Link>
              <Link
                to="/news"
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
              <Link
                to="/portfolio"
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Portfolio
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
