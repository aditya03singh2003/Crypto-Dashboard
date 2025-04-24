interface MiniChartProps {
  data: number[]
  change7d: number
}

const MiniChart = ({ data, change7d }: MiniChartProps) => {
  // Find min and max values for scaling
  const minValue = Math.min(...data)
  const maxValue = Math.max(...data)
  const range = maxValue - minValue

  // Scale to fit in a 120x40 viewBox
  const scaledPoints = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 120
      const y = 40 - ((value - minValue) / range) * 30
      return `${x},${y}`
    })
    .join(" ")

  const chartColor = change7d >= 0 ? "#22c55e" : "#ef4444" // green or red

  return (
    <svg width="120" height="40" viewBox="0 0 120 40" className="inline-block">
      <polyline
        points={scaledPoints}
        fill="none"
        stroke={chartColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MiniChart
