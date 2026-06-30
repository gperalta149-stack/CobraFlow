// frontend/src/components/layout/Navbar.tsx
import { useLocation } from 'react-router-dom'
import { useExchangeRate } from '../../hooks/useExchangeRate'
import { NotificationBell } from './NotificationBell'
import '../../styles/sidebar.css'

interface NavbarProps {
  collapsed: boolean
}

const pageInfo: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':            { title: 'Panel',         subtitle: 'Resumen operativo de tu cartera' },
  '/clientes':             { title: 'Clientes',      subtitle: 'Gestioná tus contactos y su historial' },
  '/deudas':               { title: 'Deudas',        subtitle: 'Control de deudas activas, vencidas y mora' },
  '/pagos':                { title: 'Pagos',         subtitle: 'Registro y seguimiento de cobros' },
  '/analisis':             { title: 'Análisis',      subtitle: 'Tendencias y evolución de tu cartera' },
  '/perfil':               { title: 'Mi Perfil',     subtitle: 'Datos personales y seguridad' },
  '/configuracion/mora':   { title: 'Configuración', subtitle: 'Mora · Ajustá el recargo por atraso' },
  '/configuracion/moneda': { title: 'Configuración', subtitle: 'Moneda · Equivalencias entre ARS y USD' },
  '/configuracion':        { title: 'Configuración', subtitle: 'Moneda, mora y preferencias del sistema' },
}

export function Navbar({ collapsed }: NavbarProps) {
  const location = useLocation()
  const { rate, loading: rateLoading } = useExchangeRate()

  const info = pageInfo[location.pathname] ?? { title: 'CobraFlow', subtitle: '' }

  return (
    <nav
      className={`navbar ${collapsed ? 'collapsed' : ''}`}
      style={{ borderBottom: '0.5px solid #2e3347' }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', height: '100%', padding: '0 24px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.3px', margin: 0 }}>
            {info.title}
          </h1>
          {info.subtitle && (
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0, letterSpacing: '0.01em' }}>
              {info.subtitle}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {!rateLoading && rate && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', backgroundColor: '#242938',
              borderRadius: 10, border: '0.5px solid #2e3347',
            }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8' }}>USD Oficial</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title="Precio de compra">
                <span style={{ fontSize: 10, color: '#94a3b8' }}>C:</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#ffffff' }}>
                  ${rate.compra.toLocaleString('es-AR')}
                </span>
              </div>
              <div style={{ width: 1, height: 14, backgroundColor: '#2e3347' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} title="Precio de venta">
                <span style={{ fontSize: 10, color: '#94a3b8' }}>V:</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#ffffff' }}>
                  ${rate.venta.toLocaleString('es-AR')}
                </span>
              </div>
              <div style={{ width: 1, height: 14, backgroundColor: '#2e3347' }} />
              <span style={{ fontSize: 10, color: '#34d399' }}>● hoy</span>
            </div>
          )}
          <NotificationBell />
        </div>
      </div>
    </nav>
  )
}