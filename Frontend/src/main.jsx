import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './Components/App.jsx'
import NavBar from './Components/NavBar.jsx'

import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavBar />
    <App />
  </StrictMode>,
)
