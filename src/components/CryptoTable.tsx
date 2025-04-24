"use client"
import { useSelector, useDispatch } from "react-redux"
import { selectSortedCryptos, selectFavorites } from "../features/crypto/cryptoSelectors"
import { toggleFavorite } from "../features/crypto/cryptoSlice"
import { Star } from "lucide-react"
import { formatCurrency, formatNumber, formatPercentage } from "../utils/formatters"
import type { Crypto } from "../types"

const CryptoTable = () => {
  const dispatch = useDispatch()
  const cryptos = useSelector(selectSortedCryptos)
  const favorites = useSelector(selectFavorites)

  const handleToggleFavorite = (id: string) => {
    dispatch(toggleFavorite(id))
  }

  // Show a loading state if no cryptos
  if (!cryptos || cryptos.length === 0) {
    return <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">Loading cryptocurrency data...</div>
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow mt-6">
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">
              <Star className="h-4 w-4 text-gray-400" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              1h %
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              24h %
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              7d %
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Market Cap <InfoIcon />
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Volume(24h) <InfoIcon />
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Circulating Supply <InfoIcon />
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Last 7 Days
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {cryptos.map((crypto, index) => (
            <CryptoRow
              key={crypto.id}
              crypto={crypto}
              index={index + 1}
              isFavorite={favorites.includes(crypto.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface CryptoRowProps {
  crypto: Crypto
  index: number
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

const CryptoRow = ({ crypto, index, isFavorite, onToggleFavorite }: CryptoRowProps) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-4 py-4 whitespace-nowrap">
        <button onClick={() => onToggleFavorite(crypto.id)} className="focus:outline-none">
          <Star className={`h-5 w-5 ${isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        </button>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{index}</td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="h-8 w-8 mr-3" />
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{crypto.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{crypto.symbol}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
        {formatCurrency(crypto.price)}
      </td>
      <td
        className={`px-4 py-4 whitespace-nowrap text-right text-sm font-medium ${crypto.change1h >= 0 ? "text-green-600" : "text-red-600"}`}
      >
        <div className="flex items-center justify-end">
          {crypto.change1h >= 0 ? (
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          {formatPercentage(crypto.change1h)}
        </div>
      </td>
      <td
        className={`px-4 py-4 whitespace-nowrap text-right text-sm font-medium ${crypto.change24h >= 0 ? "text-green-600" : "text-red-600"}`}
      >
        <div className="flex items-center justify-end">
          {crypto.change24h >= 0 ? (
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          {formatPercentage(crypto.change24h)}
        </div>
      </td>
      <td
        className={`px-4 py-4 whitespace-nowrap text-right text-sm font-medium ${crypto.change7d >= 0 ? "text-green-600" : "text-red-600"}`}
      >
        <div className="flex items-center justify-end">
          {crypto.change7d >= 0 ? (
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          {formatPercentage(crypto.change7d)}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
        {formatCurrency(crypto.marketCap)}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
        <div>{formatCurrency(crypto.volume24h)}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {formatNumber(crypto.volumeInCrypto)} {crypto.symbol}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
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
        <SparklineChart data={crypto.sparkline7d} change={crypto.change7d} />
      </td>
    </tr>
  )
}

const SparklineChart = ({ data, change }: { data: number[]; change: number }) => {
  // Simple sparkline implementation
  if (!data || data.length === 0) return <div className="h-10 w-32"></div>

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="h-10 w-32 inline-block">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke={change >= 0 ? "#10b981" : "#ef4444"} strokeWidth="2" />
      </svg>
    </div>
  )
}

const InfoIcon = () => (
  <svg
    className="inline-block w-4 h-4 ml-1 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

export default CryptoTable
