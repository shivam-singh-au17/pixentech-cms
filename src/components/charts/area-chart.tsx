/**
 * Area Chart Component
 * Reusable area chart using Chart.js
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

interface AreaChartProps {
  data: Array<{ x: number; y: number }>
  title: string
  height?: number
  color?: string
  formatTooltip?: (value: number) => string
}

export function AreaChart({
  data,
  title,
  height,
  color = 'rgba(59, 130, 246, 0.5)',
  formatTooltip,
}: AreaChartProps) {
  console.log(`AreaChart ${title} received data:`, data)

  // Responsive height based on screen size
  const getResponsiveHeight = () => {
    if (height) return height
    // Default responsive heights
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 200 // mobile
      if (window.innerWidth < 1024) return 225 // tablet
      return 250 // desktop
    }
    return 250 // fallback
  }

  const chartHeight = getResponsiveHeight()

  if (!data || data.length === 0) {
    return (
      <Card className='w-full min-w-0'>
        <CardHeader>
          <CardTitle className='text-sm sm:text-base font-semibold text-center truncate'>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className='flex items-center justify-center'
            style={{ height: chartHeight, minHeight: '200px' }}
          >
            <p className='text-muted-foreground text-xs sm:text-sm'>No data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const labels = data.map(item => item.x.toString())
  const dataValues = data.map(item => item.y)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Values',
        data: dataValues,
        fill: true,
        backgroundColor: color,
        borderColor: color.replace('0.5', '1'),
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: color.replace('0.5', '1'),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y
            return formatTooltip ? formatTooltip(value) : value.toLocaleString()
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Hour',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function (value: any) {
            if (formatTooltip) {
              return formatTooltip(value)
            }
            return value >= 1000000
              ? (value / 1000000).toFixed(1) + 'M'
              : value >= 1000
                ? (value / 1000).toFixed(1) + 'K'
                : value
          },
        },
      },
    },
  }

  return (
    <Card className='w-full min-w-0'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm sm:text-base font-semibold text-center truncate'>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-0 px-2 sm:px-6'>
        <div style={{ height: `${chartHeight}px`, minHeight: '200px' }} className='w-full'>
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
