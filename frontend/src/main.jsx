import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MobileControl from './MobileControl.jsx'
import Admin from './Admin.jsx'

const path = window.location.pathname

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {path === '/mobile' ? <MobileControl /> : path === '/admin' ? <Admin /> : <App />}
  </StrictMode>,
)
