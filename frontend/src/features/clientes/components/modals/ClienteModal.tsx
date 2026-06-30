// frontend/src/features/clientes/components/modals/ClienteModal.tsx
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  IconUser, IconId, IconPhone, IconMail, IconBuilding, IconMapPin,
  IconBuildingCommunity, IconMap, IconCalendar, IconReceipt, IconCash, IconChartBar
} from '@tabler/icons-react'
import { clientesApi } from '../../services/clientesApi'
import { pagosApi } from '../../../pagos/services/pagosApi'
import { deudasApi } from '../../../deudas/services/deudasApi'
import { Button } from '../../../../components/ui/Button'
import { InfoField } from '../ui/InfoField'
import { SectionHeader } from '../ui/SectionHeader'
import { StatCard } from '../ui/StatCard'
import { DualStatCard } from '../ui/DualStatCard'
import { ModalHeader } from '../ui/ModalHeader'
import { useNavigate } from 'react-router-dom'
import { useExchangeRate } from '../../../../hooks/useExchangeRate'
import type { Cliente } from '../../types'

interface ResumenRapido {
  totalDeudas: number
  totalPagos: number
  adeudadoARS: number
  adeudadoUSD: number
  // Pendiente, mismo criterio
  pendienteARS: number
  pendienteUSD: number
}

interface ClienteModalProps {
  clienteId: string
  onClose: () => void
}

export function ClienteModal({ clienteId, onClose }: ClienteModalProps) {
  const navigate = useNavigate()
  const { rate } = useExchangeRate()
  const cotizacionFallback = rate?.venta || 1

  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [resumen, setResumen] = useState<ResumenRapido | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [clienteRes, deudasRes, pagosRes] = await Promise.all([
          clientesApi.getById(clienteId),
          deudasApi.getAll(),
          pagosApi.getAll()
        ])

        const clienteData = clienteRes.data
        const deudasCliente = deudasRes.data.filter((d: any) => d.cliente_id === clienteId)
        const totalDeudas = deudasCliente.length

        // Separar por moneda nativa de cada deuda
        let adeudadoARS = 0
        let adeudadoUSD = 0
        let pendienteARS = 0
        let pendienteUSD = 0

        for (const d of deudasCliente) {
          const cotizDeuda = Number(d.cotizacion) || cotizacionFallback
          const montoTotal = Number(d.monto_total || 0)
          const saldoPendiente = Number(d.saldo_pendiente || 0)

          if (d.moneda === 'USD') {
            // monto_total y saldo_pendiente están en ARS (convertidos), monto_original es el USD nativo
            const totalUSDNativo = Number(d.monto_original || (montoTotal / cotizDeuda))
            const pendienteUSDNativo = saldoPendiente / cotizDeuda

            adeudadoUSD += totalUSDNativo
            pendienteUSD += pendienteUSDNativo
          } else {
            // ARS nativo, sin conversión
            adeudadoARS += montoTotal
            pendienteARS += saldoPendiente
          }
        }

        const pagosCliente = pagosRes.data.filter((p: any) => p.cliente_id === clienteId)
        const totalPagos = pagosCliente.length

        setResumen({
          totalDeudas,
          totalPagos,
          adeudadoARS,
          adeudadoUSD,
          pendienteARS,
          pendienteUSD,
        })

        setCliente(clienteData)
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [clienteId, cotizacionFallback])

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  const modalContent = (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#242938] rounded-2xl w-full max-w-3xl h-[90vh] flex flex-col overflow-hidden border border-[#2e3347] shadow-xl">

        <ModalHeader
          avatar={`${cliente?.nombre?.[0] || ''}${cliente?.apellido?.[0] || ''}`}
          nombre={cliente?.nombre || ''}
          apellido={cliente?.apellido || ''}
          empresa={cliente?.empresa}
          activo={cliente?.activo || false}
          onClose={onClose}
        />

        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Cargando...</div>
          ) : cliente ? (
            <div className="space-y-6">
              <div>
                <SectionHeader icon={<IconUser size={18} className="text-emerald-400" />} title="Datos Personales" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField icon={<IconUser size={12} />} label="Nombre completo" value={`${cliente.nombre} ${cliente.apellido}`} />
                  <InfoField icon={<IconId size={12} />} label="Documento" value={cliente.dni} />
                  <InfoField icon={<IconPhone size={12} />} label="Teléfono" value={cliente.telefono} />
                  <InfoField icon={<IconMail size={12} />} label="Email" value={cliente.email} />
                  <InfoField icon={<IconBuilding size={12} />} label="Empresa / Razón social" value={cliente.empresa} />
                  <InfoField icon={<IconMapPin size={12} />} label="Dirección" value={cliente.direccion} />
                  <InfoField icon={<IconBuildingCommunity size={12} />} label="Ciudad" value={cliente.ciudad} />
                  <InfoField icon={<IconMap size={12} />} label="Provincia" value={cliente.provincia} />
                  <InfoField icon={<IconChartBar size={12} />} label="Estado" value={
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${cliente.activo ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cliente.activo ? 'bg-emerald-400' : 'bg-gray-400'}`} />
                      {cliente.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  } />
                  <InfoField icon={<IconCalendar size={12} />} label="Cliente desde" value={formatDate(cliente.created_at)} />
                </div>
              </div>

              {resumen && (
                <div>
                  <SectionHeader icon={<IconChartBar size={18} className="text-emerald-400" />} title="Resumen Rápido" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Deudas" value={resumen.totalDeudas} color="blue" />
                    <StatCard label="Pagos" value={resumen.totalPagos} color="purple" />
                    <DualStatCard
                      label="Total adeudado"
                      ars={resumen.adeudadoARS}
                      usd={resumen.adeudadoUSD}
                      cotizacion={cotizacionFallback}
                      color="white"
                    />
                    <DualStatCard
                      label="Pendiente"
                      ars={resumen.pendienteARS}
                      usd={resumen.pendienteUSD}
                      cotizacion={cotizacionFallback}
                      color="orange"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-red-400">Cliente no encontrado</div>
          )}
        </div>

        <div className="px-6 py-5 border-t border-[#2e3347] bg-[#1a1f2c] shrink-0">
          <div className="grid grid-cols-3 gap-3 w-full">
            <Button variant="dark" size="md" fullWidth onClick={() => { onClose(); navigate(`/deudas?cliente=${clienteId}`) }}>
              <IconReceipt size={16} /> <span>Ir a Deudas</span>
            </Button>
            <Button variant="dark" size="md" fullWidth onClick={() => { onClose(); navigate(`/pagos?cliente=${clienteId}`) }}>
              <IconCash size={16} /> <span>Ir a Pagos</span>
            </Button>
            <Button variant="outline" size="md" fullWidth onClick={onClose}>
              <span>Cerrar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}