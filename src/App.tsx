"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { startWebSocketConnection, stopWebSocketConnection } from "./features/crypto/cryptoSlice"
import { fallbackService } from "./services/fallbackService"
import { selectWebSocketActive } from "./features/crypto/cryptoSelectors"
import CryptoTable from "./components/CryptoTable"
import Header from "./components/Header"
import MarketOverview from "./components/MarketOverview"
import Footer from "./components/Footer"
import ExchangesPage from "./pages/ExchangesPage"
import NftPage from "./pages/NftPage"
import PortfolioPage from "./pages/PortfolioPage"
import "./App.css"

function App() {
  const dispatch = useDispatch()
  const webSocketActive = useSelector(selectWebSocketActive)
  const [isLiveUpdates, setIsLiveUpdates] = useState(true)

  // Start WebSocket connection when the component mounts
  useEffect(() => {
    if (isLiveUpdates) {
      try {
        dispatch(startWebSocketConnection())

        // Set a timeout to check if WebSocket is working
        const timeoutId = setTimeout(() => {
          // If we haven't received any data after 10 seconds, fall back to simulation
          if (!webSocketActive) {
            console.log("WebSocket connection failed, falling back to simulation")
            fallbackService.start()
          }
        }, 10000)

        return () => {
          clearTimeout(timeoutId)
          if (webSocketActive) {
            dispatch(stopWebSocketConnection())
          } else {
            fallbackService.stop()
          }
        }
      } catch (error) {
        console.error("Failed to start WebSocket connection:", error)
        fallbackService.start()

        return () => {
          fallbackService.stop()
        }
      }
    } else {
      // Stop all data sources when live updates are disabled
      if (webSocketActive) {
        dispatch(stopWebSocketConnection())
      } else {
        fallbackService.stop()
      }
    }
  }, [dispatch, webSocketActive, isLiveUpdates])

  const toggleLiveUpdates = () => {
    setIsLiveUpdates(!isLiveUpdates)
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleLiveUpdates}
              className={`px-4 py-2 rounded-lg ${isLiveUpdates ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
            >
              {isLiveUpdates ? "Live Updates: ON" : "Live Updates: OFF"}
            </button>
          </div>

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
