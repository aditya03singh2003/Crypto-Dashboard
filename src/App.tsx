"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { startWebSocketConnection, stopWebSocketConnection } from "./features/crypto/cryptoSlice"
import { fallbackService } from "./services/fallbackService"
import CryptoTable from "./components/CryptoTable"
import Header from "./components/Header"
import MarketOverview from "./components/MarketOverview"
import Footer from "./components/Footer"
import ExchangesPage from "./pages/ExchangesPage"
import NftPage from "./pages/NftPage"
import PortfolioPage from "./pages/PortfolioPage"
import "./App.css"

function App() {
  // Add state to track if we're on the client
  const [isClient, setIsClient] = useState(false)
  const dispatch = useDispatch()

  // Set isClient to true once component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only run this effect on the client side
    if (!isClient) return

    // Try to use WebSocket first
    try {
      dispatch(startWebSocketConnection())

      // Set a timeout to check if WebSocket is working
      const timeoutId = setTimeout(() => {
        // If we haven't received any data after 10 seconds, fall back to simulation
        fallbackService.start()
        dispatch(stopWebSocketConnection())
      }, 10000)

      return () => {
        clearTimeout(timeoutId)
        dispatch(stopWebSocketConnection())
        fallbackService.stop()
      }
    } catch (error) {
      console.error("Failed to start WebSocket connection:", error)
      fallbackService.start()

      return () => {
        fallbackService.stop()
      }
    }
  }, [dispatch, isClient])

  // Render a loading state until we're on the client
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Only render the Router on the client side
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <MarketOverview />
                  <CryptoTable />
                </>
              }
            />
            <Route path="/exchanges" element={<ExchangesPage />} />
            <Route path="/nft" element={<NftPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
