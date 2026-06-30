// frontend/src/features/dashboard/components/evolution/constants.ts

export const MESES_MAP: Record<string, string> = {
  'Jan': 'Ene', 'Feb': 'Feb', 'Mar': 'Mar', 'Apr': 'Abr',
  'May': 'May', 'Jun': 'Jun', 'Jul': 'Jul', 'Aug': 'Ago',
  'Sep': 'Sep', 'Oct': 'Oct', 'Nov': 'Nov', 'Dec': 'Dic',
}

export const COLORS = {
  ARS: '#60a5fa',
  USD: '#fbbf24',
  POSITIVE: '#34d399',
  NEGATIVE: '#f87171',
  MUTED: '#6b7280',
  BORDER: '#2e3347',
} as const

export const CHART_HEIGHT = {
  SINGLE: 260,
  DUAL: 120,
  EMPTY: 320,
} as const