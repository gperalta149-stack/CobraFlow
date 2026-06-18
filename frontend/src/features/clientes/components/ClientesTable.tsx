// frontend/src/features/clientes/components/ClientesTable.tsx
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { IconEye, IconEdit, IconArchive, IconRestore, IconDotsVertical } from '@tabler/icons-react'
import '../../../styles/table.css'

export interface ClienteConEstado {
  id: string
  nombre: string
  apellido: string
  dni: string
  email: string | null
  telefono: string | null
  direccion: string | null
  ciudad: string | null
  provincia: string | null
  empresa: string | null
  observaciones: string | null
  activo: boolean
  created_at: string
  updated_at: string
  total_deudas: number
  estadoDeuda: 'pendiente' | 'parcial' | 'vencida' | 'pagada' | null
}

interface ClientesTableProps {
  clientes: ClienteConEstado[]
  onVer: (cliente: ClienteConEstado) => void
  onEditar: (cliente: ClienteConEstado) => void
  onArchivar: (id: string, nombre: string) => void
  onRestaurar?: (id: string, nombre: string) => void
  archivingId: string | null
  esArchivados?: boolean
}

const AVATAR_COLORS = ['#1D9E75', '#378ADD', '#EF9F27', '#E24B4A', '#8b5cf6', '#ec4899']

function EstadoBadge({ estado }: { estado: 'pendiente' | 'parcial' | 'pagada' | 'vencida' | null }) {
  const badgeClass = 
    estado === 'pendiente' ? 'status-pendiente' :
    estado === 'parcial' ? 'status-parcial' :
    estado === 'vencida' ? 'status-vencida' :
    'status-al-dia'
  
  const dotColor = 
    estado === 'pendiente' ? '#EF9F27' :
    estado === 'parcial' ? '#378ADD' :
    estado === 'vencida' ? '#E24B4A' :
    '#1D9E75'
  
  const label = 
    estado === 'pendiente' ? 'Pendiente' :
    estado === 'parcial' ? 'Parcial' :
    estado === 'vencida' ? 'Vencida' :
    'Al día'

  return (
    <div className={`status-badge ${badgeClass}`}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: dotColor }} />
      {label}
    </div>
  )
}

function ActionsMenu({ 
  cliente, onVer, onEditar, onArchivar, onRestaurar, archivingId, esArchivados 
}: { 
  cliente: ClienteConEstado
  onVer: (c: ClienteConEstado) => void
  onEditar: (c: ClienteConEstado) => void
  onArchivar: (id: string, nombre: string) => void
  onRestaurar?: (id: string, nombre: string) => void
  archivingId: string | null
  esArchivados: boolean 
}) {
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const nombreCompleto = `${cliente.nombre} ${cliente.apellido}`

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      })
    }
    setOpen(prev => !prev)
  }

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = () => setOpen(false)
    window.addEventListener('scroll', handler, true)
    return () => window.removeEventListener('scroll', handler, true)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  const handleAction = (callback: () => void) => {
    callback()
    setOpen(false)
  }

  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    top: menuPos.top,
    right: menuPos.right,
    zIndex: 99999,
    backgroundColor: '#242938',
    border: '0.5px solid #3a4159',
    borderRadius: '10px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    minWidth: '160px',
    overflow: 'hidden',
  }

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '9px 14px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '13px',
    fontWeight: 500,
    color: '#e2e8f0',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.1s ease',
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#2e3347',
          border: '0.5px solid #3a4159',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#94a3b8',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1D9E75'
          e.currentTarget.style.borderColor = '#1D9E75'
          e.currentTarget.style.color = '#ffffff'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#2e3347'
          e.currentTarget.style.borderColor = '#3a4159'
          e.currentTarget.style.color = '#94a3b8'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <IconDotsVertical size={16} />
      </button>

      {open && createPortal(
        <div ref={menuRef} style={menuStyle}>
          <button
            onClick={() => handleAction(() => onVer(cliente))}
            style={itemStyle}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2a3045' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <IconEye size={15} /> Ver cliente
          </button>
          <button
            onClick={() => handleAction(() => onEditar(cliente))}
            style={itemStyle}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2a3045' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <IconEdit size={15} /> Editar
          </button>

          <div style={{ height: '0.5px', backgroundColor: '#2e3347', margin: '4px 0' }} />

          {esArchivados ? (
            onRestaurar && (
              <button
                onClick={() => handleAction(() => onRestaurar(cliente.id, nombreCompleto))}
                disabled={archivingId === cliente.id}
                style={{ ...itemStyle, color: '#1D9E75' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1a2d26' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <IconRestore size={15} /> Restaurar
              </button>
            )
          ) : (
            <button
              onClick={() => handleAction(() => onArchivar(cliente.id, nombreCompleto))}
              disabled={archivingId === cliente.id}
              style={{ ...itemStyle, color: '#EF9F27' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2d2a1e' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <IconArchive size={15} /> Archivar
            </button>
          )}
        </div>,
        document.body
      )}
    </>
  )
}

export function ClientesTable({
  clientes,
  onVer,
  onEditar,
  onArchivar,
  onRestaurar,
  archivingId,
  esArchivados = false,
}: ClientesTableProps) {
  return (
    <div className="table-container">
      <div className="table-scroll-wrapper">
        <table className="dark-table">
          <thead>
            <tr>
              <th>CLIENTE</th>
              <th>CONTACTO</th>
              <th>DOCUMENTO</th>
              <th>EMPRESA</th>
              <th>ESTADO</th>
              <th style={{ textAlign: 'right', width: '80px' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente, index) => {
              const initials = cliente.nombre?.[0]?.toUpperCase() ?? '?'
              const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length]
              const estado = cliente.estadoDeuda
              const estadoRowClass: Record<string, string> = {
                vencida:   'row-estado-vencida',
                pendiente: 'row-estado-pendiente',
                parcial:   'row-estado-parcial',
                pagada:    'row-estado-pagada',
              }

              return (
                <tr key={cliente.id} className={estadoRowClass[estado ?? ''] ?? ''}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="table-avatar" style={{ backgroundColor: avatarColor }}>
                        {initials || '?'}
                      </div>
                      <div>
                        <p className="table-cell-name">{cliente.nombre} {cliente.apellido}</p>
                        {cliente.ciudad && (
                          <p className="table-cell-sub">{cliente.ciudad}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    {cliente.email && (
                      <p className="table-cell-name" style={{ marginBottom: 2 }}>{cliente.email}</p>
                    )}
                    {cliente.telefono && (
                      <p className="table-cell-sub">{cliente.telefono}</p>
                    )}
                    {!cliente.email && !cliente.telefono && (
                      <p className="table-cell-empty">—</p>
                    )}
                  </td>
                  <td>
                    <p className="table-cell-name">{cliente.dni}</p>
                  </td>
                  <td>
                    <p className="table-cell-name">{cliente.empresa || '—'}</p>
                  </td>
                  <td>
                    <EstadoBadge estado={estado} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <ActionsMenu
                      cliente={cliente}
                      onVer={onVer}
                      onEditar={onEditar}
                      onArchivar={onArchivar}
                      onRestaurar={onRestaurar}
                      archivingId={archivingId}
                      esArchivados={esArchivados}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}