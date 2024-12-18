import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Fsite from './Fsite.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Fsite />
  </StrictMode>,
)
