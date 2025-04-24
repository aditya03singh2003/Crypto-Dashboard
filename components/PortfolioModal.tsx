"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  selectCryptos,
  selectUserPortfolio,
  selectPortfolioValue,
  selectPortfolioAssets,
} from "../src/features/crypto/cryptoSelectors"
import { updatePortfolio, clearPortfolio } from "../src/features/crypto/cryptoSlice"
import { formatCurrency } from "../src/utils/formatters"

const PortfolioModal = () => {
  const dispatch = useDispatch()
  const cryptos = useSelector(selectCryptos)
  const portfolio = useSelector(selectUserPortfolio)
  const portfolioValue = useSelector(selectPortfolioValue)
  const portfolioAssets = useSelector(selectPortfolioAssets)

  const [selectedCrypto, setSelectedCrypto] = useState("")
  const [amount, setAmount] = useState("")
  const [open, setOpen] = useState(false)

  const handleAddAsset = () => {
    if (selectedCrypto && amount && Number.parseFloat(amount) > 0) {
      dispatch(
        updatePortfolio({
          symbol: selectedCrypto,
          amount: Number.parseFloat(amount),
        }),
      )
      setSelectedCrypto("")
      setAmount("")
    }
  }

  const handleRemoveAsset = (symbol: string) => {
    dispatch(
      updatePortfolio({
        symbol,
        amount: 0,
      }),
    )
  }

  const handleClearPortfolio = () => {
    if (window.confirm("Are you sure you want to clear your portfolio?")) {
      dispatch(clearPortfolio())
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-2">
          Manage Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Your Portfolio</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Total Value</h3>
            <p className="text-2xl font-bold">{formatCurrency(portfolioValue)}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 sm:col-span-1">
              <Label htmlFor="crypto">Cryptocurrency</Label>
              <select
                id="crypto"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
              >
                <option value="">Select a cryptocurrency</option>
                {cryptos.map((crypto) => (
                  <option key={crypto.id} value={crypto.symbol}>
                    {crypto.name} ({crypto.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="col-span-1 flex items-end">
              <Button onClick={handleAddAsset} className="w-full">
                Add
              </Button>
            </div>
          </div>

          {portfolioAssets.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Your Assets</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Asset
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {portfolioAssets.map((asset) => (
                      <tr key={asset.symbol}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img src={asset.image || "/placeholder.svg"} alt={asset.name} className="h-6 w-6 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{asset.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{asset.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                          {asset.amount}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                          {formatCurrency(asset.price)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                          {formatCurrency(asset.value)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleRemoveAsset(asset.symbol)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="destructive" className="mt-4" onClick={handleClearPortfolio}>
                Clear Portfolio
              </Button>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              Your portfolio is empty. Add some assets to get started.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PortfolioModal
