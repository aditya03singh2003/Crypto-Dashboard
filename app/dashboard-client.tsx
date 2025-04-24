"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

// Import the component with SSR disabled
const DashboardPage = dynamic(() => import("../src/pages/DashboardPage"), {
  ssr: false,
})

export default function DashboardClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading Dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardPage />
    </Suspense>
  )
}
