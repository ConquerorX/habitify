import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HabitProvider } from './context/HabitContext'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <HabitProvider>
          <App />
        </HabitProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
