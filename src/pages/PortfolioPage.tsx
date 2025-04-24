"use client"

import { useState, useEffect } from "react"
import { formatCurrency, formatNumber, formatPercentage } from "../utils/formatters"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Plus, Trash2 } from "lucide-react"

const PortfolioPage = () => {
  // Add client-side only rendering
  const [isClient, setIsClient] = useState(false)
  const [cryptoData, setCryptoData] = useState([])

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only access Redux store on the client
  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      try {
        // Safely access Redux store
        const state = require("../app/store").store.getState()
        setCryptoData(state.crypto.cryptos)
      } catch (error) {
        console.error("Failed to access Redux store:", error)
        setCryptoData([])
      }
    }
  }, [isClient])

  // Mock portfolio data
  const [portfolio, setPortfolio] = useState([
    { id: "bitcoin", amount: 0.5 },
    { id: "ethereum", amount: 5 },
    { id: "ripple", amount: 1000 },
  ])

  const [newAsset, setNewAsset] = useState({ id: "bitcoin", amount: "" })

  // Calculate portfolio value and assets
  const portfolioAssets = portfolio.map((item) => {
    const crypto = cryptoData.find((c) => c.id === item.id)
    return {
      id: item.id,
      name: crypto?.name || "",
      symbol: crypto?.symbol || "",
      image: crypto?.image || "",
      amount: item.amount,
      price: crypto?.price || 0,
      value: (crypto?.price || 0) * item.amount,
      change24h: crypto?.change24h || 0,
    }
  })

  const totalValue = portfolioAssets.reduce((sum, asset) => sum + asset.value, 0)

  // Prepare data for pie chart
  const pieData = portfolioAssets.map((asset) => ({
    name: asset.symbol,
    value: asset.value,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  const handleAddAsset = () => {
    if (newAsset.amount && Number(newAsset.amount) > 0) {
      setPortfolio([...portfolio, { id: newAsset.id, amount: Number(newAsset.amount) }])
      setNewAsset({ ...newAsset, amount: "" })
    }
  }

  const handleRemoveAsset = (id: string) => {
    setPortfolio(portfolio.filter((asset) => asset.id !== id))
  }

  // Show a loading state during SSR or if client-side rendering hasn't completed
  if (!isClient || typeof window === "undefined") {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Portfolio</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Portfolio Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalValue)}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">24h Change</p>
                <p
                  className={`text-2xl font-bold ${
                    portfolioAssets.reduce((sum, asset) => sum + asset.change24h * asset.value, 0) / totalValue >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatPercentage(
                    portfolioAssets.reduce((sum, asset) => sum + asset.change24h * asset.value, 0) / totalValue,
                  )}
                </p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Asset</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="asset" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Asset
                </label>
                <select
                  id="asset"
                  value={newAsset.id}
                  onChange={(e) => setNewAsset({ ...newAsset, id: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {cryptoData.map((crypto) => (
                    <option key={crypto.id} value={crypto.id}>
                      {crypto.name} ({crypto.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  value={newAsset.amount}
                  onChange={(e) => setNewAsset({ ...newAsset, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleAddAsset}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Assets</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  24h %
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Holdings
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {portfolioAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={asset.image || "/placeholder.svg"} alt={asset.name} className="w-8 h-8 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{asset.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{asset.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {formatCurrency(asset.price)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      asset.change24h >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {asset.change24h >= 0 ? "+" : ""}
                    {formatPercentage(asset.change24h)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {formatNumber(asset.amount)} {asset.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    {formatCurrency(asset.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleRemoveAsset(asset.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PortfolioPage
