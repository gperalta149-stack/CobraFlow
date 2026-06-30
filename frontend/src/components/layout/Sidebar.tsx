// frontend/src/components/layout/Sidebar.tsx

import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/context/AuthContext'
import { useState, useRef, useEffect } from 'react'
import {
  IconLayoutDashboard, IconUsers, IconFileInvoice, IconCash,
  IconChartBar, IconSettings, IconUser, IconLogout,
  IconChevronUp, IconChevronDown, IconMenu2,
  IconAlertTriangle, IconCoin,
} from '@tabler/icons-react'
import '../../styles/sidebar.css'

interface NavItemProps {
  to: string
  icon: React.ElementType
  label: string
  badge?: number
  collapsed: boolean
}

interface MenuItemProps {
  icon: React.ElementType
  label: string
  onClick: () => void
  danger?: boolean
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

function NavItem({ to, icon: Icon, label, badge, collapsed }: NavItemProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const active = location.pathname === to

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate(to)
  }

  return (
    <a
      href={to}
      onClick={handleClick}
      title={collapsed ? label : undefined}
      className="nav-item"
      style={{ background: active ? 'rgba(255,255,255,0.08)' : 'transparent' }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = active ? 'rgba(255,255,255,0.08)' : 'transparent' }}
    >
      <Icon size={18} style={{ color: active ? '#fff' : 'rgba(255,255,255,0.45)', flexShrink: 0 }} />
      {!collapsed && (
        <span className="nav-label" style={{ fontSize: 13, color: active ? '#fff' : 'rgba(255,255,255,0.55)', flex: 1 }}>
          {label}
        </span>
      )}
      {!collapsed && badge != null && badge > 0 && (
        <span className="nav-badge" style={{ background: '#E24B4A', color: '#fff', fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 10 }}>
          {badge}
        </span>
      )}
    </a>
  )
}

interface SubNavItemProps {
  to: string
  icon: React.ElementType
  label: string
  collapsed: boolean
  depth?: number
}

function SubNavItem({ to, icon: Icon, label, collapsed, depth = 2 }: SubNavItemProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const active = location.pathname === to

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate(to)
  }

  return (
    <a
      href={to}
      onClick={handleClick}
      title={collapsed ? label : undefined}
      className="nav-item sub-nav-item"
      style={{
        background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
        paddingLeft: !collapsed ? `${depth * 12}px` : '8px',
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = active ? 'rgba(255,255,255,0.06)' : 'transparent' }}
    >
      <Icon size={16} style={{ color: active ? '#fff' : 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
      {!collapsed && (
        <span className="nav-label" style={{ fontSize: 12, color: active ? '#fff' : 'rgba(255,255,255,0.45)', flex: 1 }}>
          {label}
        </span>
      )}
    </a>
  )
}

function SectionLabel({ children }: { children: string }) {
  return <div className="section-label">{children}</div>
}

// ============================================================
// ✅ SIDEBAR DIVIDER - Línea separadora
// ============================================================
function SidebarDivider() {
  return <div className="sidebar-divider" />
}

function UserMenu({ collapsed }: { collapsed: boolean }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const initials = usuario
    ? `${usuario.nombre?.[0] ?? ''}${usuario.apellido?.[0] ?? ''}`.toUpperCase()
    : '?'

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const MenuItem = ({ icon: Icon, label, onClick, danger = false }: MenuItemProps) => (
    <button
      onClick={() => { setOpen(false); onClick() }}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        width: '100%', padding: '8px 12px',
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 13, color: danger ? '#E24B4A' : '#374151',
        borderRadius: 8, textAlign: 'left',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = danger ? '#FEF2F2' : '#F9FAFB')}
      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
    >
      <Icon size={15} style={{ color: danger ? '#E24B4A' : '#9CA3AF' }} />
      {label}
    </button>
  )

  return (
    <div ref={ref} className="user-menu">
      <button
        onClick={() => setOpen(prev => !prev)}
        title={collapsed ? `${usuario?.nombre} ${usuario?.apellido}` : undefined}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          width: '100%', padding: collapsed ? '6px' : '8px 10px',
          background: open ? 'rgba(255,255,255,0.06)' : 'transparent',
          border: 'none', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
          transition: 'background 0.15s', justifyContent: collapsed ? 'center' : 'flex-start',
        }}
        onMouseEnter={e => { if (!open) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
        onMouseLeave={e => { if (!open) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
      >
        <div className="user-avatar" style={{
          width: 30, height: 30, borderRadius: '50%', background: '#1D9E75',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600, color: '#fff', flexShrink: 0,
        }}>
          {initials}
        </div>
        {!collapsed && (
          <>
            <div className="user-info" style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {usuario?.nombre} {usuario?.apellido}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {usuario?.email}
              </div>
            </div>
            <span className="user-chevron">
              {open ? <IconChevronUp size={12} style={{ color: 'rgba(255,255,255,0.3)' }} /> : <IconChevronDown size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />}
            </span>
          </>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)',
          left: 8, right: 8,
          background: '#fff', border: '0.5px solid #E5E7EB',
          borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          overflow: 'hidden', zIndex: 200,
        }}>
          <div style={{ padding: '12px 14px', borderBottom: '0.5px solid #F3F4F6' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
              {usuario?.nombre} {usuario?.apellido}
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{usuario?.email}</div>
          </div>
          <div style={{ padding: '4px 0' }}>
            <MenuItem icon={IconUser} label="Mi perfil" onClick={() => navigate('/perfil')} />
            <div style={{ height: '0.5px', background: '#E5E7EB', margin: '4px 12px' }} />
            <MenuItem icon={IconLogout} label="Cerrar sesión" onClick={() => { logout(); navigate('/login') }} danger />
          </div>
        </div>
      )}
    </div>
  )
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()
  const isConfiguracion = location.pathname.startsWith('/configuracion')
  const [configOpen, setConfigOpen] = useState(isConfiguracion)

  useEffect(() => {
    if (isConfiguracion) setConfigOpen(true)
  }, [isConfiguracion])

  return (
    <>
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          {collapsed
            ? <span style={{ fontSize: 20, color: '#1D9E75', fontWeight: 700 }}>C</span>
            : (
              <>
                <div className="sidebar-logo-title">CobraFlow</div>
                <div className="sidebar-logo-subtitle">Sistema de cobranzas</div>
              </>
            )
          }
        </div>

        <nav className="sidebar-nav">
          <SectionLabel>Principal</SectionLabel>
          <NavItem to="/dashboard" icon={IconLayoutDashboard} label="Dashboard" collapsed={collapsed} />
          <NavItem to="/clientes"  icon={IconUsers}           label="Clientes"  collapsed={collapsed} />
          <NavItem to="/deudas"    icon={IconFileInvoice}     label="Deudas"    collapsed={collapsed} />
          <NavItem to="/pagos"     icon={IconCash}            label="Pagos"     collapsed={collapsed} />

          <SectionLabel>Análisis</SectionLabel>
          <NavItem to="/analisis" icon={IconChartBar} label="Análisis" collapsed={collapsed} />

          {/* ✅ LÍNEA SEPARADORA ANTES DE CONFIGURACIÓN */}
          <SidebarDivider />

          {!collapsed ? (
            <>
              <div
                onClick={() => setConfigOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                  background: isConfiguracion ? 'rgba(255,255,255,0.06)' : 'transparent',
                  transition: 'background 0.15s', marginTop: 2,
                }}
                onMouseEnter={e => { if (!isConfiguracion) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={e => { if (!isConfiguracion) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <IconSettings size={18} style={{ color: isConfiguracion ? '#fff' : 'rgba(255,255,255,0.45)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: isConfiguracion ? '#fff' : 'rgba(255,255,255,0.55)', flex: 1 }}>
                  Configuración
                </span>
                {configOpen
                  ? <IconChevronUp size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  : <IconChevronDown size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                }
              </div>

              {configOpen && (
                <div style={{ marginTop: 2 }}>
                  <SubNavItem to="/configuracion/mora"   icon={IconAlertTriangle} label="Mora"   collapsed={collapsed} depth={2} />
                  <SubNavItem to="/configuracion/moneda" icon={IconCoin}          label="Moneda" collapsed={collapsed} depth={2} />
                </div>
              )}
            </>
          ) : (
            <NavItem to="/configuracion/mora" icon={IconSettings} label="Configuración" collapsed={collapsed} />
          )}
        </nav>

        <UserMenu collapsed={collapsed} />
      </aside>

      <button
        onClick={onToggle}
        className={`sidebar-toggle ${collapsed ? 'collapsed' : ''}`}
        title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
      >
        <IconMenu2 size={14} />
      </button>
    </>
  )
}