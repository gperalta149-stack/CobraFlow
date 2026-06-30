// frontend/src/features/home/components/SectionHeader.tsx
import { DisplayHeading, SectionLabel, Text } from '../../../components/ui/Typography'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ eyebrow, title, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <div className={`home-section-header ${className}`}>
      <SectionLabel className="home-eyebrow">{eyebrow}</SectionLabel>
      <DisplayHeading className="home-title" style={{ fontSize: 38, letterSpacing: '-.5px' }}>
        {title}
      </DisplayHeading>
      {subtitle && (
        <Text
          className="home-subtitle"
          style={{
            fontSize: 17,
            color: '#6b7280',
            textAlign: 'center',      // ← forzar centrado
            display: 'block',         // ← necesario para que margin: auto funcione en p
            margin: '0 auto',         // ← override del margin: 0 de Typography
            maxWidth: 520,
          }}
        >
          {subtitle}
        </Text>
      )}
    </div>
  )
}