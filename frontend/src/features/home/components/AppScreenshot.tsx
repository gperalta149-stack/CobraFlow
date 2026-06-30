// frontend/src/features/home/components/AppScreenshot.tsx
// Componente reutilizable que envuelve un screenshot con marco de browser

interface AppScreenshotProps {
  src: string
  alt: string
  className?: string
}

export function AppScreenshot({ src, alt, className = '' }: AppScreenshotProps) {
  return (
    <div className={`app-screenshot ${className}`}>
      {/* Barra del browser */}
      <div className="app-screenshot-bar">
        <div className="app-screenshot-dots">
          <span className="app-screenshot-dot" style={{ background: '#E24B4A' }} />
          <span className="app-screenshot-dot" style={{ background: '#EF9F27' }} />
          <span className="app-screenshot-dot" style={{ background: '#1D9E75' }} />
        </div>
        <div className="app-screenshot-url">
          <span>cobraflow.app</span>
        </div>
      </div>

      {/* Imagen */}
      <div className="app-screenshot-content">
        <img src={src} alt={alt} className="app-screenshot-img" />
      </div>
    </div>
  )
}