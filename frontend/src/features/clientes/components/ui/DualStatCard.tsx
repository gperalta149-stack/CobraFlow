// frontend/src/components/ui/DualStatCard.tsx
interface DualStatCardProps {
  label: string
  ars: number
  usd: number
  color?: 'white' | 'orange'
}

const colorClasses = {
  white: 'text-white',
  orange: 'text-orange-400',
}

export function DualStatCard({ label, ars, usd, color = 'white' }: DualStatCardProps) {
  return (
    <div className="bg-[#1e2334] rounded-xl p-4 text-center">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-lg font-bold ${colorClasses[color]}`}>${ars.toLocaleString()}</p>
      <p className="text-xs text-gray-400 mt-1">≈ USD {usd.toLocaleString()}</p>
    </div>
  )
}