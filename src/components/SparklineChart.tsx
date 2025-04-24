"use client"

interface SparklineChartProps {
  data: number[]
  change: number
}

const SparklineChart = ({ data, change }: SparklineChartProps) => {
  // Simple sparkline implementation
  if (!data || data.length === 0) return <div className="h-10 w-32"></div>

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1 // Avoid division by zero

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  // Use the appropriate color based on the change
  const strokeColor = change >= 0 ? "#10b981" : "#ef4444"

  return (
    <div className="h-10 w-32 inline-block">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points={points} fill="none" stroke={strokeColor} strokeWidth="2" />
      </svg>
    </div>
  )
}

export default SparklineChart
