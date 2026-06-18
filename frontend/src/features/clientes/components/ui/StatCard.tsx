interface StatCardProps {
  label: string
  value: string | number
  subtext?: string
  color?: 'blue' | 'purple' | 'white' | 'orange'
}

const colorClasses = {
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  white: 'text-white',
  orange: 'text-orange-400',
}

export function StatCard({ label, value, subtext, color = 'blue' }: StatCardProps) {
  return (
    <div className="bg-[#1e2334] rounded-xl p-4 text-center">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  )
}