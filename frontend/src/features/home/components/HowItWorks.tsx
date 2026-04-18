const getDelayClass = (delay: number): string => {
  const delayMap: Record<number, string> = {
    0: '',
    100: 'animation-delay-100',
    200: 'animation-delay-200',
    300: 'animation-delay-300'
  }
  return delayMap[delay] || ''
}

export function HowItWorks() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
          Cómo funciona
        </h2>
        <p className="text-xl text-gray-500 mb-16 animate-fade-in animation-delay-100">
          En 3 pasos simples
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "1️⃣", title: "Creás tus clientes", desc: "Registrá tu cartera de clientes en minutos", delay: 0 },
            { step: "2️⃣", title: "Registrás deudas", desc: "Cargá las deudas con montos y fechas de vencimiento", delay: 100 },
            { step: "3️⃣", title: "Controlás pagos", desc: "Gestioná cobros y seguí el estado en tiempo real", delay: 200 }
          ].map((item, i) => (
            <div 
              key={i} 
              className={`text-center p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in ${getDelayClass(item.delay)}`}
            >
              <div className="text-6xl mb-4">{item.step}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}