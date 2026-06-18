// frontend/src/features/perfil/components/ImpactoMora.tsx
import { useDeudas } from '../../deudas/hooks/useDeudas'
import { useMora } from '../hooks/useMora'
import { useExchangeRate } from '../../../hooks/useExchangeRate'
import { IconTrendingUp } from '@tabler/icons-react'

export function ImpactoMora() {
  const { deudas } = useDeudas()
  const { config } = useMora()
  const { rate } = useExchangeRate()
  const cotizacion = rate?.venta || 1

  // Calcular métricas
  const deudasVencidas = deudas?.filter(d => d.estado === 'vencida') || []
  
  // Separar por moneda
  let montoOriginalARS = 0
  let montoOriginalUSD = 0
  let moraAcumuladaARS = 0
  let moraAcumuladaUSD = 0
  
  const hoy = new Date()
  
  deudasVencidas.forEach(d => {
    const saldo = Number(d.saldo_pendiente)
    const esUSD = d.moneda === 'USD'
    
    // Monto original en su moneda nativa
    if (esUSD) {
      const cotiz = Number(d.cotizacion) || cotizacion
      montoOriginalUSD += saldo / cotiz
    } else {
      montoOriginalARS += saldo
    }
    
    // Calcular mora en su moneda nativa
    if (config?.mora_activa) {
      const vencimiento = new Date(d.fecha_vencimiento)
      const diasVencida = Math.floor((hoy.getTime() - vencimiento.getTime()) / 86400000)
      if (diasVencida > 0) {
        const mesesVencida = Math.floor(diasVencida / 30) || 1
        const porcentaje = (config.mora_porcentaje || 0) / 100
        
        let montoMora = 0
        if (esUSD) {
          const cotiz = Number(d.cotizacion) || cotizacion
          const saldoUSD = saldo / cotiz
          montoMora = config.mora_tipo === 'unica'
            ? saldoUSD * porcentaje
            : saldoUSD * porcentaje * mesesVencida
          moraAcumuladaUSD += Math.round(montoMora * 100) / 100
        } else {
          montoMora = config.mora_tipo === 'unica'
            ? saldo * porcentaje
            : saldo * porcentaje * mesesVencida
          moraAcumuladaARS += Math.round(montoMora * 100) / 100
        }
      }
    }
  })

  const totalRecuperarARS = montoOriginalARS + moraAcumuladaARS
  const totalRecuperarUSD = montoOriginalUSD + moraAcumuladaUSD
  const tieneMora = config?.mora_activa && (moraAcumuladaARS > 0 || moraAcumuladaUSD > 0)

  const fmtARS = (v: number) => `$${Math.round(v).toLocaleString('es-AR')}`
  const fmtUSD = (v: number) => `USD ${v.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div>
      {/* Header con icono */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ padding: 6, background: '#34d39920', borderRadius: 8, color: '#34d399', display: 'flex' }}>
          <IconTrendingUp size={16} />
        </div>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>
            Impacto en tu cartera
          </h3>
          <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
            {tieneMora 
              ? `Mora activa: ${config.mora_tipo === 'unica' ? 'Única vez' : 'Mensual'} · ${config.mora_porcentaje}%`
              : 'Mora desactivada'
            }
          </p>
        </div>
      </div>

      {/* Grid de métricas - 2 columnas de ancho */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Columna ARS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#60a5fa', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            🇦🇷 ARS
          </p>
          
          <div style={{ background: '#1e2334', padding: '12px 14px', borderRadius: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Original
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#f0f2f5', margin: '4px 0 0' }}>
              {fmtARS(montoOriginalARS)}
            </p>
          </div>

          <div style={{ background: '#1e2334', padding: '12px 14px', borderRadius: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Mora acumulada
            </p>
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#fb923c', margin: '4px 0 0' }}>
                {fmtARS(moraAcumuladaARS)}
              </p>
              {tieneMora && moraAcumuladaARS > 0 && (
                <p style={{ fontSize: 11, color: '#34d399', marginTop: 2 }}>
                  +{montoOriginalARS > 0 ? ((moraAcumuladaARS / montoOriginalARS) * 100).toFixed(1) : 0}% del original
                </p>
              )}
            </div>
          </div>

          <div style={{ 
            background: '#1D9E7510', 
            border: '1px solid #1D9E7530', 
            padding: '12px 14px', 
            borderRadius: 8 
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total a recuperar
            </p>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#34d399', margin: '4px 0 0' }}>
              {fmtARS(totalRecuperarARS)}
            </p>
          </div>
        </div>

        {/* Columna USD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#fbbf24', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            🇺🇸 USD
          </p>
          
          <div style={{ background: '#1e2334', padding: '12px 14px', borderRadius: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Original
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#f0f2f5', margin: '4px 0 0' }}>
              {fmtUSD(montoOriginalUSD)}
            </p>
          </div>

          <div style={{ background: '#1e2334', padding: '12px 14px', borderRadius: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Mora acumulada
            </p>
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#fb923c', margin: '4px 0 0' }}>
                {fmtUSD(moraAcumuladaUSD)}
              </p>
              {tieneMora && moraAcumuladaUSD > 0 && (
                <p style={{ fontSize: 11, color: '#34d399', marginTop: 2 }}>
                  +{montoOriginalUSD > 0 ? ((moraAcumuladaUSD / montoOriginalUSD) * 100).toFixed(1) : 0}% del original
                </p>
              )}
            </div>
          </div>

          <div style={{ 
            background: '#1D9E7510', 
            border: '1px solid #1D9E7530', 
            padding: '12px 14px', 
            borderRadius: 8 
          }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total a recuperar
            </p>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#34d399', margin: '4px 0 0' }}>
              {fmtUSD(totalRecuperarUSD)}
            </p>
          </div>
        </div>
      </div>

      {/* Mensaje informativo */}
      {tieneMora && (
        <div style={{
          marginTop: 12,
          padding: '10px 14px',
          background: '#1D9E7510',
          borderRadius: 8,
          border: '0.5px solid #1D9E7530',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontSize: 14 }}>💡</span>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
            Vas a recuperar <strong style={{ color: '#34d399' }}>{fmtARS(moraAcumuladaARS)}</strong> ARS y <strong style={{ color: '#34d399' }}>{fmtUSD(moraAcumuladaUSD)}</strong> USD adicionales por mora
          </p>
        </div>
      )}
    </div>
  )
}