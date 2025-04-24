"use client"
import { selectSortedCryptos } from "../features/crypto/cryptoSelectors"
import CryptoRow from "./CryptoRow"
import InfoIcon from "./InfoIcon"
import { Star } from "lucide-react"
import { useState, useEffect } from "react"

const CryptoTable = () => {
  // Add client-side only rendering
  const [isClient, setIsClient] = useState(false)
  const [cryptos, setCryptos] = useState([])

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only access Redux store on the client
  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      try {
        // Safely access Redux store
        const state = require("../app/store").store.getState()
        const sortedCryptos = selectSortedCryptos({ crypto: state.crypto })
        setCryptos(sortedCryptos)
      } catch (error) {
        console.error("Failed to access Redux store:", error)
        setCryptos([])
      }
    }
  }, [isClient])

  // Show a loading state during SSR
  if (!isClient || typeof window === "undefined") {
    return <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">Loading cryptocurrency data...</div>
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow">
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
            <CryptoRow key={crypto.id} crypto={crypto} index={index + 1} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CryptoTable
