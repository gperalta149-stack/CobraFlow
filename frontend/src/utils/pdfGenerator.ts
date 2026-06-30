// frontend/src/utils/pdfGenerator.ts
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Deuda } from '../features/deudas/types'

// ── Colores de marca ────────────────────────────────────────────────────
const BRAND_GREEN: [number, number, number] = [29, 158, 117]   // #1D9E75
const DARK_HEADER: [number, number, number] = [30, 35, 52]      // #1e2334
const TEXT_MUTED: [number, number, number] = [107, 114, 128]    // #6b7280
const TEXT_DARK: [number, number, number] = [26, 31, 46]        // #1a1f2e
const RED: [number, number, number] = [226, 75, 74]             // #E24B4A
const ORANGE: [number, number, number] = [239, 159, 39]         // #EF9F27

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    })
  } catch { return dateString }
}

const formatTime = (): string =>
  new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })

const fmtARS = (n: number) => `$${Math.round(Number(n)).toLocaleString('es-AR')}`
const fmtUSD = (n: number) =>
  `USD ${Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const fmtMonto = (montoARS: number, montoUSD: number | null, moneda: 'ARS' | 'USD') =>
  moneda === 'USD' && montoUSD != null ? fmtUSD(montoUSD) : fmtARS(montoARS)

// ── Header de marca reutilizable ────────────────────────────────────────
const drawBrandHeader = (doc: jsPDF, subtitle: string, pageWidth: number) => {
  // Barra superior verde
  doc.setFillColor(...BRAND_GREEN)
  doc.rect(0, 0, pageWidth, 6, 'F')

  doc.setFontSize(20)
  doc.setTextColor(...BRAND_GREEN)
  doc.setFont('helvetica', 'bold')
  doc.text('CobraFlow', 40, 34)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...TEXT_MUTED)
  doc.text(subtitle, 40, 46)

  doc.setDrawColor(220, 220, 220)
  doc.line(40, 54, pageWidth - 40, 54)
}

const drawFooter = (doc: jsPDF, pageWidth: number, y: number) => {
  doc.setDrawColor(220, 220, 220)
  doc.line(40, y, pageWidth - 40, y)
  doc.setFontSize(8)
  doc.setTextColor(...TEXT_MUTED)
  doc.text(
    `Generado por CobraFlow · ${new Date().toLocaleDateString('es-AR')} ${formatTime()}`,
    40, y + 14
  )
}

// ============================================
// COMPROBANTE DE PAGO
// ============================================
export const generarComprobantePago = async (pago: any, deuda: any, cliente: any) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const fecha = formatDate(pago.fecha_pago)
  const esUSD = pago.moneda === 'USD'

  drawBrandHeader(doc, 'Comprobante de pago', pageWidth)

  doc.setFontSize(9)
  doc.setTextColor(...TEXT_MUTED)
  doc.text(`Fecha: ${fecha} · Comprobante N° ${String(pago.id).substring(0, 8)}`, 40, 68)

  // Datos del cliente
  doc.setFontSize(11)
  doc.setTextColor(...TEXT_DARK)
  doc.setFont('helvetica', 'bold')
  doc.text('CLIENTE', 40, 88)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(60, 60, 60)
  doc.text(`${cliente?.nombre || 'N/A'}`, 40, 100)
  if (cliente?.email) doc.text(cliente.email, 40, 112)

  // Detalle de la deuda
  autoTable(doc, {
    startY: 128,
    head: [['Descripción', 'N° Factura', 'Monto total de la deuda']],
    body: [[
      deuda?.descripcion || 'N/A',
      deuda?.numero_factura || '—',
      fmtMonto(Number(deuda?.monto_total || 0), deuda?.monto_original ?? null, deuda?.moneda ?? 'ARS'),
    ]],
    theme: 'plain',
    headStyles: { fillColor: DARK_HEADER, textColor: 255, fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9, textColor: [60, 60, 60] },
    margin: { left: 40, right: 40 },
  })

  const y1 = (doc as any).lastAutoTable?.finalY ?? 160

  // Detalle del pago
  doc.setFontSize(11)
  doc.setTextColor(...TEXT_DARK)
  doc.setFont('helvetica', 'bold')
  doc.text('PAGO RECIBIDO', 40, y1 + 22)

  autoTable(doc, {
    startY: y1 + 30,
    head: [['Monto pagado', 'Método de pago', 'Observaciones']],
    body: [[
      esUSD ? fmtUSD(pago.monto_original ?? pago.monto) : fmtARS(pago.monto),
      pago.metodo_pago ?? '—',
      pago.observaciones || '—',
    ]],
    theme: 'striped',
    headStyles: { fillColor: BRAND_GREEN, textColor: 255, fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9, textColor: [40, 80, 60] },
    margin: { left: 40, right: 40 },
  })

  const y2 = (doc as any).lastAutoTable?.finalY ?? 220
  drawFooter(doc, pageWidth, y2 + 24)
  doc.setFontSize(8)
  doc.setTextColor(...TEXT_MUTED)
  doc.text('Documento válido como comprobante de pago', 40, y2 + 38)

  doc.save(`comprobante_pago_${String(pago.id).substring(0, 8)}.pdf`)
}

// ============================================
// REPORTE DE PAGOS
// ============================================
export const generarReportePagos = async (pagos: any[], filtros?: { desde?: string; hasta?: string }) => {
  const doc = new jsPDF('landscape')
  const pageWidth = doc.internal.pageSize.getWidth()

  drawBrandHeader(doc, 'Reporte de pagos recibidos', pageWidth)

  doc.setFontSize(9)
  doc.setTextColor(...TEXT_MUTED)
  let infoY = 66
  if (filtros?.desde || filtros?.hasta) {
    let filtroText = 'Período: '
    if (filtros.desde) filtroText += `desde ${filtros.desde} `
    if (filtros.hasta) filtroText += `hasta ${filtros.hasta}`
    doc.text(filtroText, 40, infoY)
    infoY += 12
  }

  // Totales separados por moneda
  const totalARS = pagos.filter(p => p.moneda !== 'USD').reduce((s, p) => s + Number(p.monto), 0)
  const totalUSD = pagos.filter(p => p.moneda === 'USD').reduce((s, p) => s + Number(p.monto_original ?? p.monto), 0)

  autoTable(doc, {
    startY: infoY + 6,
    head: [['Total de pagos', 'Recaudado (ARS)', 'Recaudado (USD)']],
    body: [[
      String(pagos.length),
      totalARS > 0 ? fmtARS(totalARS) : '—',
      totalUSD > 0 ? fmtUSD(totalUSD) : '—',
    ]],
    theme: 'plain',
    headStyles: { fillColor: DARK_HEADER, textColor: 255, fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 11, fontStyle: 'bold', textColor: [40, 80, 60] },
    margin: { left: 40, right: 40 },
  })

  const finalY = (doc as any).lastAutoTable?.finalY ?? 90

  doc.setFontSize(11)
  doc.setTextColor(...TEXT_DARK)
  doc.setFont('helvetica', 'bold')
  doc.text('DETALLE', 40, finalY + 20)

  autoTable(doc, {
    startY: finalY + 28,
    head: [['Cliente', 'Concepto', 'Monto', 'Método', 'Fecha', 'Observaciones']],
    body: pagos.map(p => [
      p.clientes?.nombre || 'N/A',
      p.deudas?.descripcion || 'N/A',
      p.moneda === 'USD' ? fmtUSD(p.monto_original ?? p.monto) : fmtARS(p.monto),
      p.metodo_pago || '—',
      formatDate(p.fecha_pago),
      p.observaciones || '—',
    ]),
    theme: 'striped',
    headStyles: { fillColor: BRAND_GREEN, textColor: 255, fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: [60, 60, 60] },
    margin: { left: 40, right: 40 },
  })

  const lastY = (doc as any).lastAutoTable?.finalY ?? 200
  drawFooter(doc, pageWidth, lastY + 16)

  doc.save(`reporte_pagos_${new Date().toISOString().split('T')[0]}.pdf`)
}

// ============================================
// REPORTE DE DEUDAS (con mora persistida y bimoneda)
// ============================================
export const generarReporteDeudas = async (deudas: Deuda[], nombreArchivo?: string) => {
  if (!deudas.length) {
    throw new Error('No hay deudas para exportar')
  }

  const doc = new jsPDF('landscape', 'pt', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()

  drawBrandHeader(doc, 'Reporte de deudas', pageWidth)

  // Resumen general
  const totalDeudas = deudas.length
  const vencidas = deudas.filter(d => d.estado === 'vencida').length

  const pendienteARS = deudas.filter(d => d.moneda === 'ARS').reduce((s, d) => s + Number(d.saldo_pendiente), 0)
  const pendienteUSD = deudas.filter(d => d.moneda === 'USD').reduce((s, d) => s + Number(d.monto_original ? d.saldo_pendiente / (Number(d.cotizacion) || 1) : 0), 0)
  const moraTotal = deudas.reduce((s, d) => s + Number(d.monto_mora_acumulada ?? 0), 0)

  autoTable(doc, {
    startY: 68,
    head: [['Total deudas', 'Vencidas', 'Pendiente (ARS)', 'Pendiente (USD)', 'Mora acumulada']],
    body: [[
      String(totalDeudas),
      String(vencidas),
      pendienteARS > 0 ? fmtARS(pendienteARS) : '—',
      pendienteUSD > 0 ? fmtUSD(pendienteUSD) : '—',
      moraTotal > 0 ? fmtARS(moraTotal) : '—',
    ]],
    theme: 'plain',
    headStyles: { fillColor: DARK_HEADER, textColor: 255, fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 10, fontStyle: 'bold', textColor: [40, 40, 40] },
    margin: { left: 40, right: 40 },
  })

  const finalY = (doc as any).lastAutoTable?.finalY ?? 100

  const estadoLabel: Record<string, string> = {
    pendiente: 'Pendiente',
    parcial: 'Parcial',
    vencida: 'Vencida',
    pagada: 'Pagada',
  }

  const estadoColor: Record<string, [number, number, number]> = {
    pendiente: ORANGE,
    parcial: [55, 138, 221],
    vencida: RED,
    pagada: BRAND_GREEN,
  }

  const tableRows = deudas.map(d => {
    const moraStr = Number(d.monto_mora_acumulada ?? 0) > 0
      ? `+${fmtARS(Number(d.monto_mora_acumulada))}`
      : '—'
    return [
      d.clientes?.nombre || '—',
      d.descripcion || '—',
      d.numero_factura || '—',
      fmtMonto(Number(d.monto_total), d.moneda === 'USD' ? Number(d.monto_original) : null, d.moneda),
      fmtMonto(Number(d.monto_pagado || 0), d.moneda === 'USD' ? Number(d.monto_pagado || 0) / (Number(d.cotizacion) || 1) : null, d.moneda),
      fmtMonto(Number(d.saldo_pendiente), d.moneda === 'USD' ? Number(d.saldo_pendiente) / (Number(d.cotizacion) || 1) : null, d.moneda),
      moraStr,
      d.moneda,
      estadoLabel[d.estado] || d.estado,
      formatDate(d.fecha_vencimiento),
    ]
  })

  autoTable(doc, {
    head: [['Cliente', 'Descripción', 'Factura', 'Total', 'Pagado', 'Pendiente', 'Mora', 'Moneda', 'Estado', 'Vencimiento']],
    body: tableRows,
    startY: finalY + 20,
    styles: { fontSize: 8, cellPadding: 5 },
    headStyles: { fillColor: DARK_HEADER, textColor: 255, fontSize: 8, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 249, 250] },
    columnStyles: {
      0: { cellWidth: 75 },
      1: { cellWidth: 90 },
      2: { cellWidth: 50 },
      3: { cellWidth: 60 },
      4: { cellWidth: 60 },
      5: { cellWidth: 60 },
      6: { cellWidth: 55, textColor: RED },
      7: { cellWidth: 38 },
      8: { cellWidth: 50 },
      9: { cellWidth: 55 },
    },
    didParseCell: (data) => {
      // Colorea la celda de Estado según su valor
      if (data.section === 'body' && data.column.index === 8) {
        const estadoRaw = deudas[data.row.index]?.estado
        const color = estadoColor[estadoRaw] ?? [60, 60, 60]
        data.cell.styles.textColor = color
        data.cell.styles.fontStyle = 'bold'
      }
    },
  })

  const lastY = (doc as any).lastAutoTable?.finalY ?? 200
  drawFooter(doc, pageWidth, lastY + 16)

  const nombre = nombreArchivo || `deudas_${new Date().toISOString().split('T')[0]}`
  doc.save(`${nombre}.pdf`)
}