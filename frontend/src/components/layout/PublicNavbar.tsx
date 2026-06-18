// frontend/src/components/layout/PublicNavbar.tsx
import { useNavigate } from 'react-router-dom'

export function PublicNavbar() {
  const navigate = useNavigate()

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: 60,
      backgroundColor: 'rgba(15,17,23,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '0.5px solid #2e3347',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: '#1D9E75',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>C</span>
        </div>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#f0f2f5', letterSpacing: '-0.3px' }}>
          CobraFlow
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '7px 16px', fontSize: 13, fontWeight: 500,
            color: '#94a3b8', background: 'none',
            border: 'none', cursor: 'pointer', borderRadius: 8,
          }}
        >
          Ingresar
        </button>
        <button
          onClick={() => navigate('/register')}
          style={{
            padding: '7px 16px', fontSize: 13, fontWeight: 600,
            color: '#fff', backgroundColor: '#1D9E75',
            border: 'none', cursor: 'pointer', borderRadius: 8,
          }}
        >
          Comenzar gratis
        </button>
      </div>
    </nav>
  )
}