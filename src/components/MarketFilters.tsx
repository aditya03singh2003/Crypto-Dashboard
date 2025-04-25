"use client"
import { useDispatch, useSelector } from "react-redux"
import { setSortBy, setSortDirection } from "../features/crypto/cryptoSlice"
import { selectSortConfig, selectTheme } from "../features/crypto/cryptoSelectors"
import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, BarChart2, DollarSign } from "lucide-react"

const MarketFilters = () => {
  const dispatch = useDispatch()
  const { sortBy, sortDirection } = useSelector(selectSortConfig)
  const theme = useSelector(selectTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSortChange = (sortOption: string) => {
    dispatch(setSortBy(sortOption))
    // Set appropriate sort direction based on the sort option
    if (sortOption === "change24h") {
      // For gainers, we want descending (highest first)
      dispatch(setSortDirection("desc"))
    } else if (sortOption === "change24h_asc") {
      // For losers, we want ascending (lowest first)
      dispatch(setSortBy("change24h"))
      dispatch(setSortDirection("asc"))
    } else if (sortOption === "volume24h") {
      // For volume, we want descending (highest first)
      dispatch(setSortDirection("desc"))
    } else if (sortOption === "marketCap") {
      // For market cap, we want descending (highest first)
      dispatch(setSortDirection("desc"))
    }
  }

  if (!mounted) return null

  // Define the filter options
  const filterOptions = [
    {
      label: "Top Gainers",
      value: "change24h",
      icon: <TrendingUp className="w-4 h-4 mr-2 text-green-500" />,
      isActive: sortBy === "change24h" && sortDirection === "desc",
    },
    {
      label: "Top Losers",
      value: "change24h_asc",
      icon: <TrendingDown className="w-4 h-4 mr-2 text-red-500" />,
      isActive: sortBy === "change24h" && sortDirection === "asc",
    },
    {
      label: "Highest Volume",
      value: "volume24h",
      icon: <BarChart2 className="w-4 h-4 mr-2 text-blue-500" />,
      isActive: sortBy === "volume24h" && sortDirection === "desc",
    },
    {
      label: "Largest Market Cap",
      value: "marketCap",
      icon: <DollarSign className="w-4 h-4 mr-2 text-yellow-500" />,
      isActive: sortBy === "marketCap" && sortDirection === "desc",
    },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-2 my-4">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSortChange(option.value)}
          className={`px-4 py-2 rounded-lg flex items-center ${
            option.isActive
              ? "bg-blue-600 text-white"
              : theme === "dark"
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
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
