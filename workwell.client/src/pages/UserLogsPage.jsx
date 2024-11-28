import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RoutineLogTable from '../components/RoutineLogTable'; // Reuse your table component
import { getPatient } from '../services/patientService'; // Use getPatient to fetch user details
import { useRoutineLogContext } from '../hooks/useRoutineLogContext'; // Use context to get routine logs

const UserLogsPage = () => {
    const { uid } = useParams(); // Get UID from URL parameters
    const { state: { routineLogs } } = useRoutineLogContext(); // Access routine logs from context

    const [user, setUser] = useState(null); // User information

    // Fetch user information based on UID
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getPatient(uid); // Use the service function to fetch user data
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [uid]);

    // If user data is still loading, show a loading message
    if (!user) {
        return <div>Loading user information...</div>;
    }

    // Filter routine logs based on user UID
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
                        <p><strong>Medical Condition:</strong> {user.medicalCondition || 'None'}</p>                 
                    </div>
                </div>
            </div>

            {/* Routine Logs */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Routine Logs</h2>
                <RoutineLogTable
                    routineLogs={filteredLogs} // Pass filtered logs for this user
                />
            </div>
        </div>
    );
};

export default UserLogsPage;
