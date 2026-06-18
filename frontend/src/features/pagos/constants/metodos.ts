// frontend/src/features/pagos/constants/metodos.ts
export const metodosLabel: Record<string, string> = {
  efectivo: 'Efectivo', transferencia: 'Transferencia',
  tarjeta_credito: 'T. Crédito', tarjeta_debito: 'T. Débito',
  cheque: 'Cheque', mercado_pago: 'Mercado Pago',
  paypal: 'PayPal', cripto: 'Cripto', otro: 'Otro',
}

export const metodosEmoji: Record<string, string> = {
  efectivo: '💵', transferencia: '🏦', tarjeta_credito: '💳',
  tarjeta_debito: '💳', cheque: '📄', mercado_pago: '💙',
  paypal: '🅿️', cripto: '₿', otro: '📦',
}