const getDelayClass = (delay: number): string => {
  const delayMap: Record<number, string> = {
    0: '',
    100: 'animation-delay-100',
    200: 'animation-delay-200'
  }
  return delayMap[delay] || ''
}

export function Stats() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 text-center gap-8">
        {[
          { value: "+30%", label: "Mejor recaudación", color: "text-blue-600", delay: 0 },
          { value: "24/7", label: "Disponible siempre", color: "text-green-600", delay: 100 },
          { value: "100%", label: "Control total", color: "text-purple-600", delay: 200 }
        ].map((item, i) => (
          <div key={i} className={`transform hover:scale-105 transition animate-fade-in ${getDelayClass(item.delay)}`}>
            <p className={`text-5xl md:text-6xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-gray-600 text-lg mt-2">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}