// frontend/src/features/pagos/hooks/useExportPagos.ts
import { useExportCSV } from '../../../hooks/useExportCSV'
import { generarReportePagos } from '../../../utils/pdfGenerator'
import { metodosLabel } from '../constants/metodos'
import type { Pago } from '../types'

export function useExportPagos() {
  const { downloadCSV } = useExportCSV()

  const exportToCSV = (pagos: Pago[], filename = 'pagos') => {
    if (!pagos.length) {
      alert('No hay pagos para exportar')
      return
    }

    const headers = ['Fecha', 'Cliente', 'Deuda', 'Monto', 'Moneda', 'Monto ARS', 'Método', 'Observaciones']

    const rows = pagos.map(p => [
      new Date(p.fecha_pago).toLocaleDateString('es-AR'),
      p.clientes?.nombre ?? '',
      p.deudas?.descripcion ?? '',
      p.monto_original ?? p.monto,
      p.moneda,
      p.monto,
      p.metodo_pago ? (metodosLabel[p.metodo_pago] ?? p.metodo_pago) : '',
      p.observaciones ?? '',
    ])

    downloadCSV(headers, rows, `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  }

  // ← CORREGIDO: pasar undefined como segundo parámetro (sin filtros)
  const exportToPDF = async (pagos: Pago[]) => {
    if (!pagos.length) {
      alert('No hay pagos para exportar')
      return
    }
    try {
      // generarReportePagos espera (pagos, filtros?) donde filtros es { desde?: string; hasta?: string }
      await generarReportePagos(pagos, undefined)
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al generar el PDF')
    }
  }

  return { exportToCSV, exportToPDF }
}