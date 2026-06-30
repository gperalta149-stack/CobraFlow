const escapeCSV = (value: string | number): string => {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function useExportCSV() {
  const downloadCSV = (headers: string[], rows: (string | number)[][], filename: string) => {
    const csvHeaders = headers.map(escapeCSV)
    const csvRows = rows.map(row => row.map(escapeCSV))
    const csv = [csvHeaders, ...csvRows].map(r => r.join(',')).join('\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return { downloadCSV }
}