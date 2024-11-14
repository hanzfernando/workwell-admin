import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import { PatientProvider } from './context/PatientContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <PatientProvider>
                <App />
            </PatientProvider>
        </AuthProvider>
    </StrictMode>,
)
