// frontend/src/features/auth/components/LoginVideo.tsx
import { useEffect, useState } from 'react'

const slides = [
  { 
    label: '📊 Dashboard', 
    color: '#1D9E75', 
    description: 'Métricas en tiempo real de tu cartera',
    icon: '📊'
  },
  { 
    label: '👥 Clientes', 
    color: '#378ADD', 
    description: 'Gestión de contactos y su historial',
    icon: '👥'
  },
  { 
    label: '📄 Deudas', 
    color: '#EF9F27', 
    description: 'Control de vencimientos y mora',
    icon: '📄'
  },
  { 
    label: '💳 Pagos', 
    color: '#34d399', 
    description: 'Registro y seguimiento de cobros',
    icon: '💳'
  },
  { 
    label: '📈 Análisis', 
    color: '#8b5cf6', 
    description: 'Tendencias y evolución de tu cartera',
    icon: '📈'
  },
  { 
    label: '⚙️ Configuración', 
    color: '#f59e0b', 
    description: 'Moneda, mora y preferencias',
    icon: '⚙️'
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
      {/* Fondo con gradiente animado */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${slide.color}22, #0f172a 70%)`,
          transition: 'background 0.8s ease',
        }}
      />

      {/* Contenido centrado */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          textAlign: 'center',
        }}
      >
        {/* Icono grande */}
        <div
          style={{
            fontSize: 72,
            marginBottom: 20,
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'scale(0.8)' : 'scale(1)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          {slide.icon}
        </div>

        {/* Título */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#f0f2f5',
            marginBottom: 8,
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          {slide.label}
        </div>

        {/* Descripción */}
        <div
          style={{
            fontSize: 13,
            color: '#94a3b8',
            maxWidth: 280,
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          {slide.description}
        </div>

        {/* Mini features */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 24,
            opacity: isTransitioning ? 0 : 1,
            transition: 'opacity 0.5s ease 0.2s',
          }}
        >
          {['📊', '💰', '📈'].map((emoji, i) => (
            <div
              key={i}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.06)',
                border: '0.5px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Overlay inferior con gradiente */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Indicadores de slide */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 6,
          zIndex: 3,
        }}
      >
        {slides.map((_, index) => (
          <div
            key={index}
            style={{
              width: index === currentIndex ? 24 : 6,
              height: 4,
              borderRadius: 4,
              backgroundColor: index === currentIndex ? slide.color : 'rgba(255,255,255,0.2)',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}