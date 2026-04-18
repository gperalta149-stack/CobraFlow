const getDelayClass = (delay: number): string => {
  const delayMap: Record<number, string> = {
    0: '',
    100: 'animation-delay-100',
    200: 'animation-delay-200',
    300: 'animation-delay-300'
  }
  return delayMap[delay] || ''
}

export function SocialProof() {
  return (
    <section className="py-16 border-y border-gray-100 bg-gray-50/30">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-gray-400 text-sm mb-8 uppercase tracking-wide">
          CONFIADO POR NEGOCIOS EN TODO EL PAÍS
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "+120", label: "Negocios activos", color: "text-blue-600", delay: 0 },
            { value: "+35%", label: "Aumento en cobranza", color: "text-green-600", delay: 100 },
            { value: "24/7", label: "Disponibilidad total", color: "text-purple-600", delay: 200 },
            { value: "★★★★★", label: "+100 usuarios felices", color: "text-yellow-500", delay: 300 }
          ].map((item, i) => (
            <div key={i} className={`animate-fade-in ${getDelayClass(item.delay)}`}>
              <p className={`text-3xl md:text-4xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-sm text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}