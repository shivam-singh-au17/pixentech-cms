/**
 * Export utilities for data export functionality
 */

export const downloadAsExcel = (data: any[], filename: string) => {
  // Convert data to CSV format
  if (!data || data.length === 0) {
    throw new Error('No data to export')
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(header => {
          const value = row[header]
          // Handle strings with commas by wrapping in quotes
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        })
        .join(',')
    ),
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
