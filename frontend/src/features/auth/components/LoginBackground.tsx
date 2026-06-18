// frontend/src/features/auth/components/LoginBackground.tsx
import { useEffect, useRef } from 'react'

// Capturas de pantalla de las diferentes secciones
// (vas a necesitar tener estas imágenes en public/ o importarlas)
import dashboardImg from '../../../assets/screenshots/dashboard.png'
import clientesImg from '../../../assets/screenshots/clientes.png'
import deudasImg from '../../../assets/screenshots/deudas.png'
import pagosImg from '../../../assets/screenshots/pagos.png'
import analisisImg from '../../../assets/screenshots/analisis.png'
import configImg from '../../../assets/screenshots/configuracion.png'

const screenshots = [
  { src: dashboardImg, label: 'Dashboard' },
  { src: clientesImg, label: 'Clientes' },
  { src: deudasImg, label: 'Deudas' },
  { src: pagosImg, label: 'Pagos' },
  { src: analisisImg, label: 'Análisis' },
  { src: configImg, label: 'Configuración' },
]

export function LoginBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let currentIndex = 0
    let interval: ReturnType<typeof setInterval>

    const showSlide = (index: number) => {
      const children = container.children
      for (let i = 0; i < children.length; i++) {
        (children[i] as HTMLElement).style.opacity = i === index ? '1' : '0'
        ;(children[i] as HTMLElement).style.transform = i === index ? 'scale(1) rotate(0deg)' : 'scale(0.95) rotate(-2deg)'
      }
    }

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % screenshots.length
      showSlide(currentIndex)
    }

    // Iniciar primera slide
    showSlide(0)

    // Cambiar cada 4 segundos
    interval = setInterval(nextSlide, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: '16px',
        backgroundColor: '#0f172a',
      }}
    >
      {screenshots.map((screenshot, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            transform: 'scale(0.95) rotate(-2deg)',
            transition: 'opacity 1.2s ease-in-out, transform 1.2s ease-in-out',
            willChange: 'opacity, transform',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              border: '0.5px solid rgba(255,255,255,0.08)',
            }}
          >
            <img
              src={screenshot.src}
              alt={screenshot.label}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(12px)',
              padding: '8px 20px',
              borderRadius: '20px',
              border: '0.5px solid rgba(255,255,255,0.1)',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: '#f0f2f5', letterSpacing: '0.04em' }}>
              {screenshot.label}
            </span>
          </div>
        </div>
      ))}

      {/* Overlay con gradiente para que el texto sea legible */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Indicadores de slide */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
          zIndex: 10,
        }}
      >
        {screenshots.map((_, index) => (
          <div
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
            }}
            // El indicador activo se controla con un efecto de opacidad
            // Podríamos mejorarlo con un estado, pero por simplicidad usamos un keyframe
          />
        ))}
      </div>
    </div>
  )
}