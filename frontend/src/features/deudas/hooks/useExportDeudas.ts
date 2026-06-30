// frontend/src/features/deudas/hooks/useExportDeudas.ts
import { useExportCSV } from '../../../hooks/useExportCSV'
import { generarReporteDeudas } from '../../../utils/pdfGenerator'
import type { Deuda } from '../types'

const fmtMonto = (monto: number, monedaTexto: string) => `${monedaTexto}${Math.round(monto).toLocaleString('es-AR')}`

const estadoLabel: Record<string, string> = {
  pendiente: 'Pendiente', parcial: 'Parcial', vencida: 'Vencida', pagada: 'Pagada',
}

export function useExportDeudas() {
  const { downloadCSV } = useExportCSV()

  const exportToCSV = (deudas: Deuda[], filename = 'deudas') => {
    const headers = ['Cliente', 'Descripción', 'Factura', 'Total', 'Pagado', 'Pendiente', 'Mora', 'Moneda', 'Estado', 'Vencimiento']

    const rows = deudas.map(d => {
      const monedaTexto = d.moneda === 'USD' ? 'USD ' : '$'
      return [
        d.clientes?.nombre ?? '—',
        d.descripcion ?? '—',
        d.numero_factura ?? '—',
        fmtMonto(d.moneda === 'USD' ? Number(d.monto_original) : Number(d.monto_total), monedaTexto),
        fmtMonto(Number(d.monto_pagado || 0), monedaTexto),
        fmtMonto(Number(d.saldo_pendiente), monedaTexto),
        Number(d.monto_mora_acumulada ?? 0) > 0 ? fmtMonto(Number(d.monto_mora_acumulada), '$') : '—',
        d.moneda,
        estadoLabel[d.estado] ?? d.estado,
        new Date(d.fecha_vencimiento).toLocaleDateString('es-AR'),
      ]
    })

    downloadCSV(headers, rows, filename)
  }

  const exportToPDF = async (deudas: Deuda[], filename = 'deudas') => {
    await generarReporteDeudas(deudas, filename)
  }

  return { exportToCSV, exportToPDF }
}