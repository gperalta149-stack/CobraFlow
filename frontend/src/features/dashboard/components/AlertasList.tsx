import { useNavigate } from 'react-router-dom'
import type { Alerta, UrgencyLevel } from '../types'

const getUrgencyLevel = (dateString: string): UrgencyLevel => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(dateString)
    dueDate.setHours(0, 0, 0, 0)
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays <= 2) return 'urgent'
    if (diffDays <= 7) return 'warning'
    return 'normal'
  } catch {
    return 'normal'
  }
}

const getUrgencyConfig = (level: UrgencyLevel) => {
  switch (level) {
    case 'urgent':
      return { bg: 'bg-red-100', border: 'border-red-600', badge: '🔴 URGENTE', badgeClass: 'bg-red-600 text-white' }
    case 'warning':
      return { bg: 'bg-yellow-50', border: 'border-yellow-500', badge: '🟡 Próximo', badgeClass: 'bg-yellow-500 text-white' }
    default:
      return { bg: 'bg-blue-50', border: 'border-blue-400', badge: '🔵 Normal', badgeClass: 'bg-blue-400 text-white' }
  }
}

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    return dateString
  }
}

interface AlertasListProps {
  alertas: Alerta[]
}

export function AlertasList({ alertas }: AlertasListProps) {
  const navigate = useNavigate()

  const handleVerDeuda = (alerta: Alerta) => {
    if (alerta.deuda_id) navigate(`/deudas?deuda=${alerta.deuda_id}`)
    else if (alerta.cliente_id) navigate(`/deudas?cliente=${alerta.cliente_id}`)
    else navigate('/deudas')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="border-b border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 text-lg">⚠️ Vencimientos próximos</h2>
        <p className="text-xs text-gray-400 mt-1">Próximos 7 días</p>
      </div>
      <div className="p-5">
        {alertas.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">No hay vencimientos próximos</p>
            <p className="text-xs mt-1">Todas las deudas están al día</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alertas.map((a) => {
              const urgencyConfig = getUrgencyConfig(getUrgencyLevel(a.fecha_vencimiento))
              return (
                <div key={a.id} className={`${urgencyConfig.bg} border-l-4 ${urgencyConfig.border} rounded-r-lg p-4 hover:shadow-md transition-all duration-200`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">{a.clientes.nombre}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{a.descripcion}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${urgencyConfig.badgeClass}`}>{urgencyConfig.badge}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="text-sm font-bold text-red-600">${Number(a.saldo_pendiente).toLocaleString()}</span>
                        <span className="text-xs text-red-500">📅 Vence: {formatDate(a.fecha_vencimiento)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleVerDeuda(a)} className="text-xs bg-white text-blue-600 px-2 py-1 rounded hover:bg-blue-50 transition-colors">Ver deuda</button>
                      <div className="text-red-500 text-xl">⚠️</div>
                    </div>
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