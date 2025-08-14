/**
 * Horizontal Bar Chart Component
 * For displaying unique users by operator
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface HorizontalBarChartProps {
  data: Array<{ x: string; y: number }>
  title: string
  height?: number
  formatTooltip?: (value: number) => string
}

const getResponsiveHeight = () => {
  if (typeof window === 'undefined') return 250
  if (window.innerWidth < 640) return 200 // mobile
  if (window.innerWidth < 1024) return 225 // tablet
  return 250 // desktop
}

export function HorizontalBarChart({
  data,
  title,
  height,
  formatTooltip,
}: HorizontalBarChartProps) {
  console.log(`HorizontalBarChart ${title} received data:`, data)

  const responsiveHeight = height || getResponsiveHeight()

  if (!data || data.length === 0) {
    return (
      <Card className='min-w-0'>
        <CardHeader>
          <CardTitle className='text-base font-semibold text-center'>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center' style={{ height: responsiveHeight }}>
            <p className='text-muted-foreground text-sm'>No data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const labels = data.map(item => item.x)
  const dataValues = data.map(item => item.y)

  // Use consistent blue colors like the old project
  const backgroundColor = '#2196f3'
  const borderColor = '#1976d2'

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Values',
        data: dataValues,
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.x
            return formatTooltip ? formatTooltip(value) : `${value} users`
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <Card className='w-full min-w-0'>
      <CardHeader className='pb-2 px-3 sm:px-6'>
        <CardTitle className='text-sm sm:text-base font-semibold text-center'>{title}</CardTitle>
      </CardHeader>
      <CardContent className='pt-0 px-3 sm:px-6'>
        <div style={{ height: `${responsiveHeight}px` }} className='w-full overflow-hidden'>
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
