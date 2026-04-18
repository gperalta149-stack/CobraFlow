const getDelayClass = (delay: number): string => {
  const delayMap: Record<number, string> = {
    0: '',
    100: 'animation-delay-100',
    200: 'animation-delay-200'
  }
  return delayMap[delay] || ''
}

export function Features() {
  return (
    <section className="py-24 px-6 bg-gray-50/50">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
          Beneficios que transforman tu negocio
        </h2>
        <p className="text-xl text-gray-500 animate-fade-in animation-delay-100">
          No solo gestionás, optimizás tu rentabilidad
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          { title: "Visión 360°", desc: "Dashboard en tiempo real con métricas clave para tomar decisiones rápidas.", icon: "📊", bg: "bg-blue-100", benefit: "Cobrá más rápido", delay: 0 },
          { title: "Control total", desc: "Seguí cada deuda, vencimiento y pago sin perder detalle.", icon: "💰", bg: "bg-green-100", benefit: "Reducí la morosidad", delay: 100 },
          { title: "Gestión simple", desc: "Administrá clientes, historial de pagos y deudas desde un solo lugar.", icon: "👥", bg: "bg-purple-100", benefit: "Ahorrá tiempo", delay: 200 }
        ].map((item, i) => (
          <div
            key={i}
            className={`bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in ${getDelayClass(item.delay)}`}
          >
            <div className={`w-16 h-16 mb-5 rounded-xl ${item.bg} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-500 mb-3">{item.desc}</p>
            <span className="text-sm font-medium text-blue-600">✓ {item.benefit}</span>
          </div>
        ))}
      </div>
    </section>
  )
}