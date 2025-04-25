"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { startWebSocketConnection, stopWebSocketConnection, setTheme } from "./features/crypto/cryptoSlice"
import { selectWebSocketActive, selectTheme } from "./features/crypto/cryptoSelectors"
import { fallbackService } from "./services/fallbackService"
import CryptoTable from "./components/CryptoTable"
import Header from "./components/Header"
import MarketFilters from "./components/MarketFilters"
import MarketOverview from "./components/MarketOverview"
import Footer from "./components/Footer"
import NavigationIcons from "./components/NavigationIcons"
import ExchangesPage from "./pages/ExchangesPage"
import NftPage from "./pages/NftPage"
import PortfolioPage from "./pages/PortfolioPage"
import NewsPage from "./pages/NewsPage"
import "./App.css"

function App() {
  const dispatch = useDispatch()
  const webSocketActive = useSelector(selectWebSocketActive)
  const theme = useSelector(selectTheme)
  const [isLiveUpdates, setIsLiveUpdates] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null
    if (savedTheme && savedTheme !== theme) {
      dispatch(setTheme(savedTheme))
    }
  }, [dispatch, theme])

  // Apply theme effect
  useEffect(() => {
    if (!mounted) return

    if (theme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else {
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove("dark")
    }
  }, [theme, mounted])

  // Start WebSocket connection when the component mounts
  useEffect(() => {
    if (!mounted) return

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
  }, [dispatch, webSocketActive, isLiveUpdates, mounted])

  const toggleLiveUpdates = () => {
    setIsLiveUpdates(!isLiveUpdates)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"} flex flex-col`}>
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-4 flex-grow w-full">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleLiveUpdates}
              className={`px-4 py-2 rounded-lg ${isLiveUpdates ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
            >
              {isLiveUpdates ? "Live Updates: ON" : "Live Updates: OFF"}
            </button>
          </div>

          <NavigationIcons />

          <Routes>
            <Route
              path="/"
              element={
                <>
                  <MarketOverview />
                  <MarketFilters />
                  <CryptoTable />
                </>
              }
            />
            <Route path="/exchanges" element={<ExchangesPage />} />
            <Route path="/nft" element={<NftPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/news" element={<NewsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
