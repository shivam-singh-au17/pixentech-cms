/**
 * Turnover By Operator Chart
 * Displays turnover data by operator/brand
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

interface TurnoverByOperatorProps {
  data: Record<string, number>
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

export function TurnoverByOperatorChart({
  data,
  title,
  height,
  formatTooltip,
}: TurnoverByOperatorProps) {
  console.log(`TurnoverByOperatorChart ${title} received data:`, data)

  const responsiveHeight = height || getResponsiveHeight()

  if (!data || Object.keys(data).length === 0) {
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

  const labels = Object.keys(data)
  const dataValues = Object.values(data)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Turnover',
        data: dataValues,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
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
      y: {
        beginAtZero: true,
        title: {
          display: false,
          text: 'Turnover',
        },
      },
    },
  }

  return (
    <Card className='min-w-0'>
      <CardHeader className='px-3 sm:px-6'>
        <CardTitle className='text-sm sm:text-base font-semibold text-center'>{title}</CardTitle>
      </CardHeader>
      <CardContent className='px-3 sm:px-6'>
        <div style={{ height: responsiveHeight }} className='w-full overflow-hidden'>
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
