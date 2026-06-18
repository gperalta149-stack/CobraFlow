// frontend/src/features/perfil/components/ConfiguracionMoneda.tsx
import {
  IconCoin, IconLayoutDashboard,
  IconFileInvoice, IconCash, IconChartBar, IconCheck,
} from '@tabler/icons-react'
import { useMonedaConfig } from '../../../hooks/useMonedaConfig'

const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    style={{
      position: 'relative',
      width: 44, height: 24, flexShrink: 0,
      background: active ? '#1D9E75' : '#2e3347',
      borderRadius: 24, border: 'none', cursor: 'pointer',
      transition: 'background 0.25s',
    }}
  >
    <span style={{
      position: 'absolute',
      width: 18, height: 18,
      left: active ? 23 : 3, bottom: 3,
      background: '#fff', borderRadius: '50%',
      transition: 'left 0.25s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    }} />
  </button>
)

const SECCIONES = [
  { key: 'dashboard', label: 'Dashboard', icon: <IconLayoutDashboard size={14} /> },
  { key: 'deudas',    label: 'Deudas',    icon: <IconFileInvoice size={14} /> },
  { key: 'pagos',     label: 'Pagos',     icon: <IconCash size={14} /> },
  { key: 'analisis',  label: 'Análisis',  icon: <IconChartBar size={14} /> },
]

export function ConfiguracionMoneda() {
  const { config, loading, isSubmitting, exito, error, toggleOption, saveConfig, cotizacion } = useMonedaConfig()

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[...Array(2)].map((_, i) => (
          <div key={i} style={{ backgroundColor: '#242938', border: '0.5px solid #2e3347', borderRadius: 12, height: 300, opacity: 0.4 }} />
        ))}
      </div>
    )
  }

  const arsToUsd = (1455000 / cotizacion).toFixed(0)
  const usdToArs = (1000 * cotizacion).toLocaleString('es-AR')

  return (
    <form onSubmit={saveConfig}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>

        {/* Columna izquierda — toggles principales */}
        <div style={{
          backgroundColor: '#242938', border: '0.5px solid #2e3347',
          borderRadius: 12, overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px', borderBottom: '0.5px solid #2e3347',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ padding: 7, background: '#fbbf2418', borderRadius: 8, color: '#fbbf24', display: 'flex' }}>
              <IconCoin size={15} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>
                Configuración de moneda
              </p>
              <p style={{ fontSize: 11, color: '#6b7280', marginTop: 1 }}>
                Equivalencias entre ARS y USD
              </p>
            </div>
          </div>

          {/* Cotización */}
          <div style={{
            margin: '14px 20px',
            background: '#1e2334', borderRadius: 9,
            padding: '10px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8', margin: 0 }}>Cotización actual</p>
              <p style={{ fontSize: 10, color: '#4a5568', marginTop: 1 }}>Fuente: DolarAPI.com · Dólar Oficial</p>
            </div>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#34d399', margin: 0 }}>
              ${cotizacion.toLocaleString('es-AR')}
            </p>
          </div>

          {/* Toggles */}
          <div style={{ padding: '0 20px 20px' }}>
            {[
              {
                key: 'mostrarEquivalencias',
                active: config.mostrarEquivalencias,
                label: 'Mostrar equivalencias',
                sub: 'Conversión automática entre monedas',
                principal: true,
              },
              {
                key: 'mostrarUsdEnArs',
                active: config.mostrarUsdEnArs,
                label: 'USD en deudas ARS',
                sub: `ARS 1.455.000 ≈ USD ${arsToUsd}`,
                principal: false,
              },
              {
                key: 'mostrarArsEnUsd',
                active: config.mostrarArsEnUsd,
                label: 'ARS en deudas USD',
                sub: `USD 1.000 ≈ ARS ${usdToArs}`,
                principal: false,
              },
            ].map(({ key, active, label, sub, principal }) => {
              const disabled = !principal && !config.mostrarEquivalencias
              return (
                <div
                  key={key}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 0',
                    borderBottom: '0.5px solid #1e2334',
                    opacity: disabled ? 0.4 : 1,
                    transition: 'opacity 0.2s',
                    paddingLeft: principal ? 0 : 12,
                  }}
                >
                  <div>
                    <p style={{ fontSize: principal ? 13 : 12, fontWeight: principal ? 600 : 500, color: '#f0f2f5', margin: 0 }}>
                      {label}
                    </p>
                    <p style={{ fontSize: 10, color: '#6b7280', marginTop: 1 }}>{sub}</p>
                  </div>
                  <Toggle
                    active={active}
                    onToggle={() => !disabled && toggleOption(key)}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Columna derecha — secciones */}
        <div style={{
          backgroundColor: '#242938', border: '0.5px solid #2e3347',
          borderRadius: 12, overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 20px', borderBottom: '0.5px solid #2e3347',
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', margin: 0 }}>
              Activar por sección
            </p>
            <p style={{ fontSize: 11, color: '#6b7280', marginTop: 1 }}>
              Elegí dónde mostrar las equivalencias
            </p>
          </div>

          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SECCIONES.map(({ key, label, icon }) => {
              const active = config.secciones[key as keyof typeof config.secciones]
              const disabled = !config.mostrarEquivalencias
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => !disabled && toggleOption(`seccion_${key}`)}
                  disabled={disabled}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 14px',
                    background: active && !disabled ? 'rgba(29,158,117,0.08)' : '#1e2334',
                    border: `0.5px solid ${active && !disabled ? 'rgba(29,158,117,0.35)' : '#2a3045'}`,
                    borderRadius: 9,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.4 : 1,
                    transition: 'all 0.15s',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => {
                    if (!disabled) e.currentTarget.style.borderColor = active ? 'rgba(29,158,117,0.6)' : '#3a4159'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = active && !disabled ? 'rgba(29,158,117,0.35)' : '#2a3045'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 7,
                      background: active && !disabled ? 'rgba(29,158,117,0.15)' : '#242938',
                      color: active && !disabled ? '#1D9E75' : '#4a5568',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}>
                      {icon}
                    </div>
                    <span style={{
                      fontSize: 13, fontWeight: 500,
                      color: active && !disabled ? '#f0f2f5' : '#94a3b8',
                    }}>
                      {label}
                    </span>
                  </div>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: active && !disabled ? '#1D9E75' : '#2a3045',
                    border: `0.5px solid ${active && !disabled ? '#1D9E75' : '#3a4159'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}>
                    {active && !disabled && <IconCheck size={11} color="white" />}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Feedback + guardar */}
          <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {error && (
              <div style={{
                padding: '9px 13px', background: '#E24B4A18',
                border: '0.5px solid rgba(226,75,74,0.4)', borderRadius: 8,
                fontSize: 12, color: '#f87171',
              }}>
                {error}
              </div>
            )}
            {exito && (
              <div style={{
                padding: '9px 13px', background: 'rgba(29,158,117,0.1)',
                border: '0.5px solid rgba(29,158,117,0.35)', borderRadius: 8,
                display: 'flex', alignItems: 'center', gap: 7,
                fontSize: 12, color: '#34d399',
              }}>
                <IconCheck size={13} /> Configuración guardada
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%', padding: '11px',
                background: 'linear-gradient(135deg, #1D9E75 0%, #1a8b68 100%)',
                border: 'none', borderRadius: 9,
                fontSize: 13, fontWeight: 600, color: '#fff',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar configuración'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}