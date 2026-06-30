// frontend/src/features/home/components/SocialProof.tsx
import { useEffect, useRef } from 'react'
import { TextMuted } from '../../../components/ui/Typography'

interface StatItem {
  value: string
  label: string
  color?: string
  animated?: boolean
  animTarget?: number
  animSuffix?: string
}

const STATS: StatItem[] = [
  { value: '+120',  label: 'Negocios activos', animated: true, animTarget: 120, animSuffix: '' },
  { value: '+35%',  label: 'Más cobranza',     animated: true, animTarget: 35,  animSuffix: '%' },
  { value: '24/7',  label: 'Disponibilidad' },
  { value: '★ 4.9', label: 'Satisfacción', color: '#EF9F27' },
]

function animateCount(el: HTMLElement, target: number, suffix: string, duration: number) {
  const start = Date.now()
  const update = () => {
    const progress = Math.min((Date.now() - start) / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    el.textContent = '+' + Math.round(target * ease) + suffix
    if (progress < 1) requestAnimationFrame(update)
    else el.textContent = '+' + target + suffix
  }
  requestAnimationFrame(update)
}

export function SocialProof() {
  const ref0 = useRef<HTMLDivElement>(null)
  const ref1 = useRef<HTMLDivElement>(null)
  const animRefs = [ref0, ref1]

  useEffect(() => {
    const timer = setTimeout(() => {
      STATS.forEach((stat, i) => {
        const el = animRefs[i]?.current
        if (stat.animated && el && stat.animTarget !== undefined && stat.animSuffix !== undefined) {
          animateCount(el, stat.animTarget, stat.animSuffix, 1200)
        }
      })
    }, 900)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="social-proof">
      {STATS.map((stat, i) => (
        <div key={stat.label} className="social-proof-item">
          {/* div con ref porque animateCount muta textContent directamente */}
          <div
            ref={stat.animated ? animRefs[i] : undefined}
            className="social-proof-value"
            style={stat.color ? { color: stat.color } : undefined}
          >
            {stat.value}
          </div>
          <TextMuted className="social-proof-label" style={{ fontSize: 14 }}>
            {stat.label}
          </TextMuted>
        </div>
      ))}
    </div>
  )
}