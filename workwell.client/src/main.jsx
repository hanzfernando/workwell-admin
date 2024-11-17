import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import { PatientProvider } from './context/PatientContext.jsx'
import { RoutineProvider } from './context/RoutineContext.jsx'
import { ExerciseProvider } from './context/ExerciseContext.jsx' 
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <PatientProvider>
                <RoutineProvider>
                    <ExerciseProvider>
                        <App />
                    </ExerciseProvider>
                </RoutineProvider>               
            </PatientProvider>
        </AuthProvider>
    </StrictMode>,
)
