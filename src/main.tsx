import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HabitProvider } from './context/HabitContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <HabitProvider>
        <App />
      </HabitProvider>
    </ThemeProvider>
  </StrictMode>,
)
