interface PagoSaldoInfoProps {
  saldoPendiente: number
}

export function PagoSaldoInfo({ saldoPendiente }: PagoSaldoInfoProps) {
  return (
    <div className="md:col-span-2 bg-blue-50 border border-blue-200 p-3 rounded-lg">
      <p className="text-sm text-blue-800">
        <span className="font-semibold">Saldo pendiente:</span> ${saldoPendiente.toLocaleString()}
      </p>
      <p className="text-xs text-blue-600 mt-1">
        Ingrese un monto menor o igual al saldo pendiente
      </p>
    </div>
  )
}