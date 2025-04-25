"use client"

import { useSelector } from "react-redux"
import { selectTheme } from "../features/crypto/cryptoSelectors"
import { Link } from "react-router-dom"
import { BarChart2, DollarSign, ImageIcon, Briefcase, Search, Newspaper } from "lucide-react"
import { useState, useEffect } from "react"

const NavigationIcons = () => {
  const [mounted, setMounted] = useState(false)
  const theme = useSelector(selectTheme)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex flex-wrap justify-center gap-4 my-6">
      <Link
        to="/"
        className={`flex flex-col items-center p-3 ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} rounded-lg transition-colors w-20 sm:w-24`}
      >
        <BarChart2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mb-2" />
        <span className={`text-xs sm:text-sm text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Cryptocurrencies
        </span>
      </Link>
      <Link
        to="/exchanges"
        className={`flex flex-col items-center p-3 ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} rounded-lg transition-colors w-20 sm:w-24`}
      >
        <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mb-2" />
        <span className={`text-xs sm:text-sm text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Exchanges
        </span>
      </Link>
      <Link
        to="/nft"
        className={`flex flex-col items-center p-3 ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} rounded-lg transition-colors w-20 sm:w-24`}
      >
        <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 mb-2" />
        <span className={`text-xs sm:text-sm text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          NFT
        </span>
      </Link>
      <Link
        to="/portfolio"
        className={`flex flex-col items-center p-3 ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} rounded-lg transition-colors w-20 sm:w-24`}
      >
        <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 mb-2" />
        <span className={`text-xs sm:text-sm text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Portfolio
        </span>
      </Link>
      <Link
        to="/news"
        className={`flex flex-col items-center p-3 ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} rounded-lg transition-colors w-20 sm:w-24`}
      >
        <Newspaper className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mb-2" />
        <span className={`text-xs sm:text-sm text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          News
        </span>
      </Link>
      <Link
        to="/"
        className={`flex flex-col items-center p-3 ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} rounded-lg transition-colors w-20 sm:w-24`}
      >
        <Search className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mb-2" />
        <span className={`text-xs sm:text-sm text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Search
        </span>
      </Link>
    </div>
  )
}

export default NavigationIcons
