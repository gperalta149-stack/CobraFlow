import { useState } from 'react'
import type { TopCliente } from '../types'

interface TopClientesChartProps {
  clientes: TopCliente[]
  maxSaldo: number
}

export function TopClientesChart({ clientes, maxSaldo }: TopClientesChartProps) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)

  const getBarTooltip = (saldo: number, max: number, clienteNombre: string): string => {
    if (max === 0) return `${clienteNombre}: 0% del total`
    const percentage = ((saldo / max) * 100).toFixed(1)
    return `${clienteNombre}: $${saldo.toLocaleString()} - ${percentage}% del total`
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="border-b border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 text-lg">📊 Top clientes con mayor deuda</h2>
        <p className="text-xs text-gray-400 mt-1">Clientes que más deben</p>
      </div>
      <div className="p-5">
        {clientes.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-sm">No hay datos de clientes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {clientes.map((c, i) => {
              const porcentaje = maxSaldo ? (c.saldo_pendiente / maxSaldo) * 100 : 0
              const tooltip = getBarTooltip(c.saldo_pendiente, maxSaldo, c.clientes.nombre)
              const isHovered = hoveredBar === c.cliente_id

              return (
                <div
                  key={c.cliente_id}
                  className="group"
                  onMouseEnter={() => setHoveredBar(c.cliente_id)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {i + 1}. {c.clientes.nombre}
                    </span>
                    <span className={`text-sm font-bold transition-colors ${isHovered ? 'text-red-700' : 'text-red-500'}`}>
                      ${Number(c.saldo_pendiente).toLocaleString()}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-red-400 to-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                    {isHovered && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 animate-pulse">
                        {tooltip}
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}