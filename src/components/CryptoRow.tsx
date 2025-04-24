"use client"

import { useDispatch, useSelector } from "react-redux"
import type { Crypto } from "../types"
import { formatCurrency, formatNumber, formatPercentage } from "../utils/formatters"
import MiniChart from "./MiniChart"
import { Star } from "lucide-react"
import { toggleFavorite } from "../features/crypto/cryptoSlice"
import { selectFavorites } from "../features/crypto/cryptoSelectors"
import { useState, useEffect } from "react"

interface CryptoRowProps {
  crypto: Crypto
  index: number
}

const CryptoRow = ({ crypto, index }: CryptoRowProps) => {
  // Add client-side only rendering
  const [isClient, setIsClient] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const dispatch = useDispatch()
  // Only access Redux store on the client
  const favorites = useSelector(selectFavorites)

  useEffect(() => {
    if (isClient) {
      setIsFavorite(favorites.includes(crypto.id))
    }
  }, [isClient, favorites, crypto.id])

  const getPercentageClass = (value: number) => {
    return value >= 0 ? "text-green-500" : "text-red-500"
  }

  const getPercentageIcon = (value: number) => {
    return value >= 0 ? "▲" : "▼"
  }

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(crypto.id))
  }

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        <button onClick={handleToggleFavorite} className="focus:outline-none">
          <Star className={`h-4 w-4 ${isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`} />
        </button>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{index}</td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img src={crypto.image || "/placeholder.svg"} alt={`${crypto.name} logo`} className="w-8 h-8 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{crypto.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{crypto.symbol}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
        {formatCurrency(crypto.price)}
      </td>
      <td className={`px-4 py-4 whitespace-nowrap text-sm text-right ${getPercentageClass(crypto.change1h)}`}>
        <span className="flex items-center justify-end">
          {getPercentageIcon(crypto.change1h)} {formatPercentage(crypto.change1h)}
        </span>
      </td>
      <td className={`px-4 py-4 whitespace-nowrap text-sm text-right ${getPercentageClass(crypto.change24h)}`}>
        <span className="flex items-center justify-end">
          {getPercentageIcon(crypto.change24h)} {formatPercentage(crypto.change24h)}
        </span>
      </td>
      <td className={`px-4 py-4 whitespace-nowrap text-sm text-right ${getPercentageClass(crypto.change7d)}`}>
        <span className="flex items-center justify-end">
          {getPercentageIcon(crypto.change7d)} {formatPercentage(crypto.change7d)}
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
        {formatCurrency(crypto.marketCap)}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
        <div>{formatCurrency(crypto.volume24h)}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {formatNumber(crypto.volumeInCrypto)} {crypto.symbol}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
        <div>
          {formatNumber(crypto.circulatingSupply)} {crypto.symbol}
        </div>
        {crypto.maxSupply && (
          <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${(crypto.circulatingSupply / crypto.maxSupply) * 100}%` }}
            ></div>
          </div>
        )}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right">
        <MiniChart data={crypto.sparkline7d} change7d={crypto.change7d} />
      </td>
    </tr>
  )
}

export default CryptoRow
