import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { LanguageProvider } from '@/i18n/LanguageContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </LanguageProvider>,
)
