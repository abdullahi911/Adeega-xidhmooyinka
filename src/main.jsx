import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

// ── Security: Disable console logs in production ──────────────────────────
if (import.meta.env.PROD) {
  // eslint-disable-next-line no-console
  console.log = () => {};
  // eslint-disable-next-line no-console
  console.debug = () => {};
  // eslint-disable-next-line no-console
  console.info = () => {};
}
// ──────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
