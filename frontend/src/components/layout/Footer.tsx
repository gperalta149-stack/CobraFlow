// frontend/src/components/layout/Footer.tsx
export function Footer() {
  return (
    <footer style={{ borderTop: '0.5px solid #2e3347', padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>C</div>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>CobraFlow</span>
      </div>
      <p style={{ fontSize: 11, color: '#6b7280' }}>© 2026 CobraFlow. Todos los derechos reservados.</p>
    </footer>
  )
}