import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RoutineLogTable from '../components/RoutineLogTable';
import MedicalHistoryComponent from '../components/MedicalHistoryComponent';
import DiagnosisComponent from '../components/DiagnosisComponent';
import AppointmentTable from '../components/AppointmentTable';
import { getPatient } from '../services/patientService';
import { useRoutineLogContext } from '../hooks/useRoutineLogContext';

const tabs = [
    { id: 'medical-history', label: 'Medical History' },
    { id: 'diagnosis', label: 'Diagnosis' },
    { id: 'routine-logs', label: 'Routine Logs' },
    { id: 'appointments', label: 'Appointments' }
];

const UserLogsPage = () => {
    const { uid } = useParams();
    const { state: { routineLogs } } = useRoutineLogContext();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('medical-history');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getPatient(uid);
                //console.log(userData)
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [uid]);

    if (!user) {
        return <div>Loading user information...</div>;
    }

    const filteredLogs = routineLogs.filter(log => log.uid === uid);

    return (
        <div className="container mx-auto p-6">
            {/* User Information */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-semibold mb-4">User Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p><strong>First Name:</strong> {user.firstName}</p>
                        <p><strong>Last Name:</strong> {user.lastName}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                    <div>
                        <p><strong>Age:</strong> {user.age}</p>
                        <p><strong>Contact:</strong> {user.contact}</p>
                        <p><strong>Medical Condition:</strong> {user.medicalCondition || 'None'}</p>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
                <div className="flex border-b">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-4 font-semibold ${activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {activeTab === 'medical-history' && <MedicalHistoryComponent patient={user} />}
                {activeTab === 'diagnosis' && <DiagnosisComponent patient={user} />}
                {activeTab === 'routine-logs' && <RoutineLogTable routineLogs={filteredLogs} />}
                {activeTab === 'appointments' && <AppointmentTable patient={user} />}
            </div>
        </div>
    );
};

export default UserLogsPage;
