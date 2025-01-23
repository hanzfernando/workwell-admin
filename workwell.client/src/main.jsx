import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import { PatientProvider } from './context/PatientContext.jsx'
import { RoutineProvider } from './context/RoutineContext.jsx'
import { ExerciseProvider } from './context/ExerciseContext.jsx' 
import { RoutineLogProvider } from './context/RoutineLogContext.jsx'
import { VideoProvider } from './context/VideoContext.jsx';
import { SelfAssessmentProvider } from './context/SelfAssessmentContext.jsx';
import { JournalProvider } from './context/JournalContext.jsx';
import { OrganizationProvider } from './context/OrganizationContext.jsx'
import {AdminProvider } from './context/AdminContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <AdminProvider>
                <OrganizationProvider>           
                    <PatientProvider>
                        <RoutineProvider>
                            <ExerciseProvider>
                                <RoutineLogProvider>
                                    <VideoProvider>
                                        <SelfAssessmentProvider>
                                            <JournalProvider>
                                                <App />
                                            </JournalProvider>
                                        </SelfAssessmentProvider>
                                    </VideoProvider>
                                </RoutineLogProvider>    
                            </ExerciseProvider>
                        </RoutineProvider>               
                    </PatientProvider>
                </OrganizationProvider>
            </AdminProvider>
        </AuthProvider>
    </StrictMode>,
)
