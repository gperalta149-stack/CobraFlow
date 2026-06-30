// frontend/src/features/auth/components/LoginVideo.tsx
import { useEffect, useState } from 'react'
import { 
  IconLayoutDashboard, 
  IconUsers, 
  IconFileInvoice, 
  IconCash, 
  IconChartBar, 
  IconSettings
} from '@tabler/icons-react'

// Importar imágenes
import dashboardImg from '../../../assets/screenshots/dashboard.png'
import clientesImg from '../../../assets/screenshots/clientes.png'
import deudasImg from '../../../assets/screenshots/deudas.png'
import pagosImg from '../../../assets/screenshots/pagos.png'
import analisisImg from '../../../assets/screenshots/analisis.png'
import configuracionMoraImg from '../../../assets/screenshots/configuracion-mora.png'

const slides = [
  { 
    src: dashboardImg, 
    icon: <IconLayoutDashboard size={24} />,
    color: '#1D9E75', 
    label: 'Dashboard',
    description: 'Métricas en tiempo real de tu cartera'
  },
  { 
    src: clientesImg, 
    icon: <IconUsers size={24} />,
    color: '#378ADD', 
    label: 'Clientes',
    description: 'Gestión de contactos y su historial'
  },
  { 
    src: deudasImg, 
    icon: <IconFileInvoice size={24} />,
    color: '#EF9F27', 
    label: 'Deudas',
    description: 'Control de vencimientos y mora'
  },
  { 
    src: pagosImg, 
    icon: <IconCash size={24} />,
    color: '#34d399', 
    label: 'Pagos',
    description: 'Registro y seguimiento de cobros'
  },
  { 
    src: analisisImg, 
    icon: <IconChartBar size={24} />,
    color: '#8b5cf6', 
    label: 'Análisis',
    description: 'Tendencias y evolución de tu cartera'
  },
  { 
    src: configuracionMoraImg, 
    icon: <IconSettings size={24} />,
    color: '#f59e0b', 
    label: 'Configuración',
    description: 'Mora y moneda para tu negocio'
  },
]

export function LoginVideo() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length)
        setIsTransitioning(false)
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const slide = slides[currentIndex]

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 320,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#0f172a',
      }}
    >
      {/* Imagen de fondo */}
      <img
        src={slide.src}
        alt={slide.label}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          transform: isTransitioning ? 'scale(1.05)' : 'scale(1)',
        }}
      />

      {/* Overlay oscuro - solo para legibilidad del texto */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: 'linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Icono y título - abajo a la izquierda */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 5,
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `${slide.color}20`,
            color: slide.color,
          }}
        >
          {slide.icon}
        </div>
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: '#ffffff',
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}
        >
          {slide.label}
        </span>
      </div>

      {/* Descripción - abajo a la derecha */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          right: '28px',
          zIndex: 5,
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.5s ease 0.1s',
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            textAlign: 'right',
            display: 'block',
          }}
        >
          {slide.description}
        </span>
      </div>

      {/* Indicadores de slide - abajo centrado */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 6,
          zIndex: 10,
        }}
      >
        {slides.map((_, index) => (
          <div
            key={index}
            style={{
              width: index === currentIndex ? 24 : 6,
              height: 3,
              borderRadius: 4,
              backgroundColor: index === currentIndex ? '#1D9E75' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}