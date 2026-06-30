// frontend/src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import './styles/theme.css'
import './styles/globals.css'
import './styles/animations.css'
import './styles/table.css'
import './styles/filter.css'
import './styles/forms.css'
import './styles/analisis.css'
import './styles/search.css'
import './styles/actions.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)