import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Kiosk from './pages/Kiosk.jsx'
import MobileControl from './pages/MobileControl.jsx'
import Admin from './pages/Admin.jsx'

const path = window.location.pathname

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {path === '/mobile' ? <MobileControl /> : path === '/admin' ? <Admin /> : <Kiosk />}
  </StrictMode>,
)
