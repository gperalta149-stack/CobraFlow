import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Formatear fecha
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return dateString
  }
}

// Formatear hora
const formatTime = (): string => {
  return new Date().toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Generar comprobante de un pago individual (HU-13b)
export const generarComprobantePago = async (pago: any, deuda: any, cliente: any) => {
  const doc = new jsPDF()
  const fecha = formatDate(pago.fecha_pago)
  const hora = formatTime()

  // Logo / Título
  doc.setFontSize(20)
  doc.setTextColor(37, 99, 235) // azul
  doc.text('CobraFlow', 20, 25)
  
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Sistema de Gestión de Cobranza', 20, 33)
  
  // Línea separadora
  doc.setDrawColor(200, 200, 200)
  doc.line(20, 38, 190, 38)

  // Título del comprobante
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('COMPROBANTE DE PAGO', 20, 50)

  // Datos del comprobante
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  doc.text(`Fecha: ${fecha} - ${hora}`, 20, 62)
  doc.text(`Comprobante N°: ${pago.id.substring(0, 8)}...`, 20, 70)

  // Línea separadora
  doc.line(20, 75, 190, 75)

  // Información del cliente
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('DATOS DEL CLIENTE', 20, 85)
  
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  doc.text(`Nombre: ${cliente?.nombre || 'N/A'}`, 20, 95)
  doc.text(`Email: ${cliente?.email || 'N/A'}`, 20, 103)

  // Información de la deuda
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('DETALLE DE LA DEUDA', 20, 118)
  
  autoTable(doc, {
    startY: 125,
    head: [['Concepto', 'Descripción']],
    body: [
      ['Descripción', deuda?.descripcion || 'N/A'],
      ['Monto total', `$${Number(deuda?.monto_total || 0).toLocaleString()}`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 20 },
  })

  // Información del pago
  const finalY = (doc as any).lastAutoTable?.finalY || 160
  
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('DETALLE DEL PAGO', 20, finalY + 10)
  
  autoTable(doc, {
    startY: finalY + 17,
    head: [['Monto pagado', 'Forma de pago', 'Observaciones']],
    body: [
      [
        `$${Number(pago.monto).toLocaleString()}`,
        'Transferencia / Efectivo',
        pago.observaciones || '-'
      ],
    ],
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94], textColor: 255, fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 20 },
  })

  // Footer
  const lastY = (doc as any).lastAutoTable?.finalY || 200
  doc.setDrawColor(200, 200, 200)
  doc.line(20, lastY + 15, 190, lastY + 15)
  
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('Documento válido como comprobante de pago', 20, lastY + 25)
  doc.text(`Generado por CobraFlow - ${new Date().toLocaleDateString('es-AR')}`, 20, lastY + 33)

  // Guardar PDF
  doc.save(`comprobante_pago_${pago.id.substring(0, 8)}.pdf`)
}

// Generar reporte de pagos (HU-27)
export const generarReportePagos = async (pagos: any[], filtros?: { desde?: string; hasta?: string }) => {
  const doc = new jsPDF('landscape')
  const fechaActual = formatDate(new Date().toISOString())

  // Logo / Título
  doc.setFontSize(20)
  doc.setTextColor(37, 99, 235)
  doc.text('CobraFlow', 20, 20)
  
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Reporte de Pagos', 20, 30)

  // Información del reporte
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  doc.text(`Fecha de generación: ${fechaActual}`, 20, 40)
  
  if (filtros?.desde || filtros?.hasta) {
    let filtroText = 'Filtros aplicados: '
    if (filtros.desde) filtroText += `desde ${filtros.desde} `
    if (filtros.hasta) filtroText += `hasta ${filtros.hasta}`
    doc.text(filtroText, 20, 48)
  }

  // Calcular totales
  const totalRecaudado = pagos.reduce((sum, p) => sum + Number(p.monto), 0)
  const promedioPago = pagos.length > 0 ? totalRecaudado / pagos.length : 0

  // Resumen
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text('RESUMEN', 20, 60)
  
  autoTable(doc, {
    startY: 65,
    head: [['Total pagos', 'Monto total recaudado', 'Promedio por pago']],
    body: [[
      pagos.length.toString(),
      `$${totalRecaudado.toLocaleString()}`,
      `$${promedioPago.toLocaleString()}`
    ]],
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontSize: 10 },
    bodyStyles: { fontSize: 10, fontStyle: 'bold' },
    margin: { left: 20 },
  })

  // Tabla de pagos
  const finalY = (doc as any).lastAutoTable?.finalY || 85
  
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text('DETALLE DE PAGOS', 20, finalY + 12)
  
  autoTable(doc, {
    startY: finalY + 19,
    head: [['Cliente', 'Concepto', 'Monto', 'Fecha', 'Observaciones']],
    body: pagos.map(p => [
      p.clientes?.nombre || 'N/A',
      p.deudas?.descripcion || 'N/A',
      `$${Number(p.monto).toLocaleString()}`,
      formatDate(p.fecha_pago),
      p.observaciones || '-'
    ]),
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94], textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 20 },
  })

  // Footer
  const lastY = (doc as any).lastAutoTable?.finalY || 100
  doc.setDrawColor(200, 200, 200)
  doc.line(20, lastY + 10, 280, lastY + 10)
  
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(`Reporte generado por CobraFlow - ${new Date().toLocaleDateString('es-AR')}`, 20, lastY + 20)

  // Guardar PDF
  doc.save(`reporte_pagos_${new Date().toISOString().split('T')[0]}.pdf`)
}