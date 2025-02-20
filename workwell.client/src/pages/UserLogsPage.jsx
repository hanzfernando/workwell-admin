import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RoutineLogTable from '../components/RoutineLogTable';
import MedicalHistoryComponent from '../components/MedicalHistoryComponent';
import DiagnosisComponent from '../components/DiagnosisComponent';
import VisitationLogComponent from '../components/VisitationLogComponent';
import EditPatientModal from '../components/EditPatientModal';
import { getPatient } from '../services/patientService';
import { useRoutineLogContext } from '../hooks/useRoutineLogContext';
import { useAdminContext } from '../hooks/useAdminContext';
import icEdit from '../assets/ic_edit.svg';

const tabs = [
    { id: 'appointments', label: 'Visitation Logs' },
    { id: 'medical-history', label: 'Medical History' },
    { id: 'diagnosis', label: 'Diagnosis and Prescription' },
    { id: 'routine-logs', label: 'Routine Logs' }
];

const UserLogsPage = () => {
    const { uid } = useParams();
    const { state: { routineLogs } } = useRoutineLogContext();
    const { state: adminState } = useAdminContext();
    const [user, setUser] = useState(null);
    const [assignedProfessionalName, setAssignedProfessionalName] = useState('N/A');
    const [activeTab, setActiveTab] = useState('appointments');
    const [editModal, setEditModal] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getPatient(uid);
                setUser(userData);

                // Find assigned professional's name using their UID
                const assignedAdmin = adminState?.admins?.find(admin => admin.uid === userData.assignedProfessional);
                setAssignedProfessionalName(assignedAdmin ? `${assignedAdmin.firstName} ${assignedAdmin.lastName}` : 'N/A');
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [uid, adminState?.admins]);

    if (!user) {
        return <div>Loading patient information...</div>;
    }

    const filteredLogs = routineLogs ? routineLogs.filter(log => log.uid === uid) : [];

    return (
        <div className="container mx-auto p-6">
            {/* Patient Information */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Patient Information</h2>
                    <button
                        onClick={() => setEditModal(true)}
                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                        <img src={icEdit} alt="Edit" className="w-5 h-5 mr-2" />
                        Edit
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div className="space-y-2">
                        <p><strong>First Name:</strong> {user.firstName}</p>
                        <p><strong>Last Name:</strong> {user.lastName}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Contact No:</strong> {user.contact || 'N/A'}</p>
                        <p><strong>Age:</strong> {user.age ? `${user.age} years` : 'N/A'}</p>
                    </div>

                    <div className="space-y-2">
                        <p><strong>Height:</strong> {user.height ? `${user.height} cm` : 'N/A'}</p>
                        <p><strong>Weight:</strong> {user.weight ? `${user.weight} kg` : 'N/A'}</p>
                        <p><strong>Medical Condition:</strong> {user.medicalCondition || 'None'}</p>
                        <p><strong>Address:</strong> {user.address || 'N/A'}</p>
                        <p><strong>Assigned Professional:</strong> {assignedProfessionalName}</p>
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
                            className={`py-2 px-4 font-semibold ${activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {activeTab === 'appointments' && <VisitationLogComponent patient={user} />}
                {activeTab === 'medical-history' && <MedicalHistoryComponent patient={user} />}
                {activeTab === 'diagnosis' && <DiagnosisComponent patient={user} />}
                {activeTab === 'routine-logs' && <RoutineLogTable routineLogs={filteredLogs} />}
            </div>

            {editModal && (
                <EditPatientModal
                    isOpen={editModal}
                    onClose={() => setEditModal(false)}
                    patient={user}
                    refreshPatients={() => {
                        getPatient(uid).then(setUser).catch(console.error);
                    }}
                />
            )}
        </div>
    );
};

export default UserLogsPage;
