"use client"

import { useDispatch, useSelector } from "react-redux"
import { setFilter } from "../features/crypto/cryptoSlice"
import { selectFilter } from "../features/crypto/cryptoSelectors"
import type { FilterType } from "../types"

const FilterTabs = () => {
  const dispatch = useDispatch()
  const filter = useSelector(selectFilter)

  const handleFilterChange = (filter: FilterType) => {
    dispatch(setFilter(filter))
  }

  return (
    <div className="mt-4 mb-6 flex overflow-x-auto pb-2">
      <button
        onClick={() => handleFilterChange("all")}
        className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap ${
          filter === "all"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
        } transition-colors`}
      >
        All Cryptocurrencies
      </button>
      <button
        onClick={() => handleFilterChange("favorites")}
        className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap ${
          filter === "favorites"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
        } transition-colors`}
      >
        Favorites
      </button>
      <button
        onClick={() => handleFilterChange("gainers")}
        className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap ${
          filter === "gainers"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
        } transition-colors`}
      >
        Top Gainers
      </button>
      <button
        onClick={() => handleFilterChange("losers")}
        className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap ${
          filter === "losers"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
        } transition-colors`}
      >
        Top Losers
      </button>
      <button
        onClick={() => handleFilterChange("trending")}
        className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap ${
          filter === "trending"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
        } transition-colors`}
      >
        Trending
      </button>
    </div>
  )
}

export default FilterTabs
