const getDelayClass = (delay: number): string => {
  const delayMap: Record<number, string> = {
    0: '',
    100: 'animation-delay-100',
    200: 'animation-delay-200'
  }
  return delayMap[delay] || ''
}

export function Stats() {
  return null // Contenido absorbido por SocialProof — podés eliminar este componente
}