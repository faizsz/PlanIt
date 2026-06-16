import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { PlannerProvider } from './context/PlannerContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { UIProvider } from './context/UIContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <UIProvider>
        <PlannerProvider>
          <App />
        </PlannerProvider>
      </UIProvider>
    </ThemeProvider>
  </React.StrictMode>
)
