"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { selectCryptocurrencies } from "@/lib/cryptoSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Wallet } from "lucide-react"

// Define portfolio item type
interface PortfolioItem {
  cryptoId: number
  amount: number
}

const PortfolioModal = () => {
  const cryptocurrencies = useSelector(selectCryptocurrencies)

  // Load portfolio from localStorage
  const loadPortfolio = (): PortfolioItem[] => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cryptoPortfolio")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Failed to parse portfolio from localStorage", e)
        }
      }
    }
    return [
      { cryptoId: 1, amount: 0.5 },
      { cryptoId: 2, amount: 5 },
      { cryptoId: 6, amount: 1000 },
    ]
  }

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(loadPortfolio())
  const [newAsset, setNewAsset] = useState({ cryptoId: 1, amount: "" })

  // Save portfolio to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cryptoPortfolio", JSON.stringify(portfolio))
    }
  }, [portfolio])

  const addAsset = () => {
    if (newAsset.amount && Number.parseFloat(newAsset.amount) > 0) {
      setPortfolio([...portfolio, { ...newAsset, amount: Number.parseFloat(newAsset.amount) }])
      setNewAsset({ cryptoId: 1, amount: "" })
    }
  }

  const removeAsset = (cryptoId: number) => {
    setPortfolio(portfolio.filter((asset) => asset.cryptoId !== cryptoId))
  }

  // Calculate portfolio value and assets
  const portfolioWithValues = portfolio.map((item) => {
    const crypto = cryptocurrencies.find((c) => c.id === item.cryptoId)
    return {
      cryptoId: item.cryptoId,
      name: crypto?.name || "",
      symbol: crypto?.symbol || "",
      amount: item.amount,
      price: crypto?.price || 0,
      value: (crypto?.price || 0) * item.amount,
      change24h: crypto?.change24h || 0,
    }
  })

  const totalValue = portfolioWithValues.reduce((sum, asset) => sum + asset.value, 0)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-2">
          <Wallet className="mr-2 h-4 w-4" />
          View Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Your Portfolio</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="text-2xl font-bold mb-4">
            Total Value: ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>24h Change</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolioWithValues.map((item) => (
                <TableRow key={item.cryptoId}>
                  <TableCell>{item.symbol}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>${item.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                  <TableCell className={item.change24h >= 0 ? "text-green-500" : "text-red-500"}>
                    {item.change24h > 0 ? "+" : ""}
                    {item.change24h.toFixed(2)}%
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => removeAsset(item.cryptoId)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex space-x-2">
            <Select
              value={newAsset.cryptoId.toString()}
              onValueChange={(value) => setNewAsset({ ...newAsset, cryptoId: Number.parseInt(value) })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {cryptocurrencies.map((crypto) => (
                  <SelectItem key={crypto.id} value={crypto.id.toString()}>
                    {crypto.name} ({crypto.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Amount"
              value={newAsset.amount}
              onChange={(e) => setNewAsset({ ...newAsset, amount: e.target.value })}
              className="flex-1"
            />
            <Button onClick={addAsset}>
              <Plus className="h-4 w-4 mr-2" /> Add Asset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PortfolioModal
